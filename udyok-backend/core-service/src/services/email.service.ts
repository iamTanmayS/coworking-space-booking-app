import { Resend } from 'resend';
import { env } from '../config/config.js';

const resend = env.resend_api_key ? new Resend(env.resend_api_key) : null;

export const sendOTP = async (to: string, otp: string) => {
    if (!resend) {
        console.warn(`[Email Service] Resend not configured (RESEND_API_KEY missing). OTP for ${to}: ${otp}`);
        return;
    }

    const { error } = await resend.emails.send({
        from: 'Udyok Auth <onboarding@resend.dev>',
        to,
        subject: 'Your Udyok Verification Code',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #1AB65C; text-align: center;">Udyok Verification</h2>
            <p style="text-align: center; color: #555; font-size: 16px;">Your one-time verification code is:</p>
            <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #1AB65C;">${otp}</span>
            </div>
            <p style="text-align: center; color: #888; font-size: 13px;">This code expires in 15 minutes. Do not share it with anyone.</p>
        </div>
        `,
    });

    if (error) {
        console.error('[Email Service] Failed to send OTP:', error);
        throw new Error(error.message);
    }

    console.log(`[Email Service] OTP sent to ${to}`);
};

export const sendWelcomeEmail = async (to: string, name: string) => {
    if (!resend) {
        console.warn(`[Email Service] Resend not configured. Skipping welcome email for ${to}.`);
        return;
    }

    const firstName = name?.split(' ')[0] || 'there';

    const { error } = await resend.emails.send({
        from: 'The Udyok Team <onboarding@resend.dev>',
        to,
        subject: 'Welcome to Udyok! 🎉',
        html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; color: #333333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="background-color: #1AB65C; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Udyok!</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <p style="font-size: 18px;">Hi <strong>${firstName}</strong>, 👋</p>
                    <p style="font-size: 16px; color: #555555; line-height: 1.6;">We're thrilled to have you join our workspace community. Find the perfect environment to do your best work — from quiet desks to collaborative meeting rooms.</p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="https://udyok.com/explore" style="background-color: #1AB65C; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: bold;">Book Your First Space</a>
                    </div>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="font-size: 14px; color: #888888; margin: 0;">© ${new Date().getFullYear()} Udyok. All rights reserved.</p>
                </div>
            </div>
        </div>
        `,
    });

    if (error) {
        console.error(`[Email Service] Failed to send welcome email to ${to}:`, error);
    } else {
        console.log(`[Email Service] Welcome email sent to ${to}`);
    }
};
