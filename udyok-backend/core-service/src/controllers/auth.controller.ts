import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import pool from '../config/db/db.js';
import { env } from '../config/config.js';
import { generateTokens } from '../utils/jwt.util.js';
import { sendOTP, sendWelcomeEmail } from '../services/email.service.js';

const googleClient = new OAuth2Client(env.google_web_client_id);

function generateRandomOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const register = async (req: Request, res: Response) => {
    const { name, email, password, phone_number } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
    }

    try {
        // 1. Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            if (existingUser.rows[0].provider === 'google') {
                res.status(400).json({ error: 'Email already registered with Google Sign-In' });
                return;
            }
            res.status(400).json({ error: 'Email already in use' });
            return;
        }

        // 2. Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Create user (unverified)
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password_hash, provider, email_verified, phone_number) 
       VALUES ($1, $2, $3, 'email', false, $4) RETURNING id`,
            [name, email, passwordHash, phone_number || null]
        );

        // 4. Generate and store OTP
        const otp = generateRandomOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await pool.query(
            `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)`,
            [email, otp, expiresAt]
        );

        // 5. Send Email asynchronously (don't block the request)
        sendOTP(email, otp).catch(console.error);

        res.status(201).json({
            message: 'Registration successful. Please check your email for the OTP.',
            userId: newUser.rows[0].id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400).json({ error: 'Email and OTP are required' });
        return;
    }

    try {
        // 1. Find OTP
        const otpRecord = await pool.query(
            `SELECT * FROM otps WHERE email = $1 AND otp = $2 ORDER BY created_at DESC LIMIT 1`,
            [email, otp]
        );

        if (otpRecord.rows.length === 0) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }

        if (new Date(otpRecord.rows[0].expires_at) < new Date()) {
            res.status(400).json({ error: 'OTP has expired' });
            return;
        }

        // 2. Update user as verified
        const userResult = await pool.query(
            `UPDATE users SET email_verified = true WHERE email = $1 RETURNING id, email, name`,
            [email]
        );

        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // 3. Generate tokens
        const user = userResult.rows[0];
        const tokens = generateTokens({ userId: user.id, email: user.email });

        // 4. Clean up OTPs
        await pool.query(`DELETE FROM otps WHERE email = $1`, [email]);

        // 5. Fire Welcome Email asynchronously (don't block the request)
        sendWelcomeEmail(user.email, user.name).catch(console.error);

        res.status(200).json({
            message: 'Email verified successfully',
            ...tokens,
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = userResult.rows[0];

        if (user.provider === 'google') {
            res.status(400).json({ error: 'Please use Google Sign-In for this account' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        if (!user.email_verified) {
            // Automatically generate a new OTP and send it
            const otp = generateRandomOTP();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

            await pool.query(
                `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)`,
                [user.email, otp, expiresAt]
            );

            await sendOTP(user.email, otp);

            res.status(403).json({
                error: 'UNVERIFIED_EMAIL',
                message: 'Please verify your email before logging in. A new code has been sent.'
            });
            return;
        }

        const tokens = generateTokens({ userId: user.id, email: user.email });
        res.status(200).json(tokens);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
        res.status(400).json({ error: 'Google ID token is required' });
        return;
    }

    try {
        // 1. Verify Google token (supporting both Web and Mobile client IDs)
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [env.google_web_client_id, env.google_android_client_id],
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: 'Invalid Google token' });
            return;
        }

        const { email, name, sub: googleId, picture } = payload;

        // 2. Try to find existing user first
        let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length > 0) {
            const existingUser = userResult.rows[0];
            // If user signed up with email+password, block Google login on that account
            if (existingUser.provider === 'email') {
                res.status(400).json({ error: 'This email is already registered with a password. Please sign in with your email and password.' });
                return;
            }
            // Existing Google user — log them in
            const tokens = generateTokens({ userId: existingUser.id, email: existingUser.email });
            res.status(200).json({ message: 'Google login successful', ...tokens });
            return;
        }

        // 3. New user — insert with ON CONFLICT guard to avoid race conditions
        const insertResult = await pool.query(
            `INSERT INTO users (name, email, provider, provider_user_id, email_verified, profile_image) 
             VALUES ($1, $2, 'google', $3, true, $4) 
             ON CONFLICT (email) DO NOTHING
             RETURNING id, email, name`,
            [name, email, googleId, picture]
        );

        if (insertResult.rows.length === 0) {
            // Another request beat us to it — re-fetch the user
            userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const raceUser = userResult.rows[0];
            if (!raceUser) {
                res.status(500).json({ error: 'Failed to create user account' });
                return;
            }
            if (raceUser.provider === 'email') {
                res.status(400).json({ error: 'This email is already registered with a password. Please sign in with your email and password.' });
                return;
            }
            const tokens = generateTokens({ userId: raceUser.id, email: raceUser.email });
            res.status(200).json({ message: 'Google login successful', ...tokens });
            return;
        }

        const newUser = insertResult.rows[0];
        // Fire Welcome Email asynchronously for new Google users
        sendWelcomeEmail(newUser.email, newUser.name).catch(console.error);

        // 4. Generate tokens
        const tokens = generateTokens({ userId: newUser.id, email: newUser.email });
        res.status(200).json({
            message: 'Google login successful',
            ...tokens,
        });
    } catch (error: any) {
        // Handle unique constraint violation gracefully
        if (error.code === '23505') {
            res.status(400).json({ error: 'This email is already registered. Please sign in with your email and password.' });
            return;
        }
        console.error('Google Auth error:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
};


export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // Return 200 even if user not found for security reasons
            res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
            return;
        }

        const otp = generateRandomOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await pool.query(
            `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)`,
            [email, otp, expiresAt]
        );

        sendOTP(email, otp).catch(console.error); // In reality this would be a reset link, but reusing OTP for now

        res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body; // token here acts as the OTP
    const email = req.body.email; // Assuming email is also passed, or token is a JWT containing email

    if (!token || !password || !email) {
        res.status(400).json({ error: 'Token, email, and new password are required' });
        return;
    }

    try {
        const otpRecord = await pool.query(
            `SELECT * FROM otps WHERE email = $1 AND otp = $2 ORDER BY created_at DESC LIMIT 1`,
            [email, token]
        );

        if (otpRecord.rows.length === 0 || new Date(otpRecord.rows[0].expires_at) < new Date()) {
            res.status(400).json({ error: 'Invalid or expired token' });
            return;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await pool.query(
            `UPDATE users SET password_hash = $1 WHERE email = $2`,
            [passwordHash, email]
        );

        await pool.query(`DELETE FROM otps WHERE email = $1`, [email]);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required' });
        return;
    }

    try {
        // Verify the refresh token using the refresh secret
        const { verifyRefreshToken } = await import('../utils/jwt.util.js');
        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            res.status(401).json({ error: 'Invalid or expired refresh token' });
            return;
        }

        // Confirm the user still exists in the database
        const userResult = await pool.query(
            'SELECT id, email FROM users WHERE id = $1',
            [payload.userId]
        );

        if (userResult.rows.length === 0) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Issue a fresh token pair
        const tokens = generateTokens({ userId: payload.userId, email: payload.email });
        res.status(200).json(tokens);
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const resendCode = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const otp = generateRandomOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await pool.query(
            `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)`,
            [email, otp, expiresAt]
        );

        sendOTP(email, otp).catch(console.error);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend code error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
