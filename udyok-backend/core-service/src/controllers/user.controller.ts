import type { Response } from 'express';
import pool from '../config/db/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userResult = await pool.query(
            `SELECT id, name, email, phone_number as phone, profile_image as avatar, 
             latitude, longitude, city, country, email_verified as "isVerified",
             provider as "isOnboarded" 
             FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const row = userResult.rows[0];
        const user = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            avatar: row.avatar,
            isVerified: row.isVerified,
            isOnboarded: row.isOnboarded,
            location: row.city ? {
                latitude: row.latitude ? parseFloat(row.latitude) : 0,
                longitude: row.longitude ? parseFloat(row.longitude) : 0,
                city: row.city,
                country: row.country || ''
            } : null,
            isProfileComplete: !!(row.name && row.phone)
        };

        res.status(200).json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, phone, email } = req.body;
        // In reality, updating email might require re-verification. Keeping simple for now.

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedUserResult = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone_number = COALESCE($2, phone_number),
                 email = COALESCE($3, email),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, name, email, phone_number as phone, profile_image as avatar, 
             latitude, longitude, city, country, email_verified as "isVerified", provider as "isOnboarded"`,
            [name, phone, email, userId]
        );

        const row = updatedUserResult.rows[0];
        const user = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            avatar: row.avatar,
            isVerified: row.isVerified,
            isOnboarded: row.isOnboarded,
            location: row.city ? {
                latitude: row.latitude ? parseFloat(row.latitude) : 0,
                longitude: row.longitude ? parseFloat(row.longitude) : 0,
                city: row.city,
                country: row.country || ''
            } : null,
            isProfileComplete: !!(row.name && row.phone)
        };

        res.status(200).json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Mock upload handling
        // A real implementation would parse multipart/form-data and upload to S3/Cloudinary
        const mockAvatarUrl = 'https://example.com/avatar.jpg';

        await pool.query('UPDATE users SET profile_image = $1 WHERE id = $2', [mockAvatarUrl, userId]);

        res.status(200).json({ avatarUrl: mockAvatarUrl });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { latitude, longitude, city, country } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        await pool.query(
            `UPDATE users 
             SET latitude = $1, longitude = $2, city = $3, country = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5`,
            [latitude, longitude, city, country || null, userId]
        );

        res.status(200).json({
            message: 'Location updated successfully',
            location: { latitude, longitude, city, country: country || '' }
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
