import nodemailer from 'nodemailer';
import { env } from '../config/config.js';

let transporter: nodemailer.Transporter | null = null;

if (env.smtp_user && env.smtp_pass) {
    transporter = nodemailer.createTransport({
        host: env.smtp_host,
        port: env.smtp_port,
        secure: env.smtp_port === 465, // true for 465, false for other ports
        auth: {
            user: env.smtp_user,
            pass: env.smtp_pass,
        },
    });
}

export const sendOTP = async (to: string, otp: string) => {
    if (!transporter) {
        console.warn(`[Email Service] SMTP not configured. Did not send OTP ${otp} to ${to}.`);
        return;
    }

    const mailOptions = {
        from: `"Udyok Auth" <${env.smtp_user}>`,
        to,
        subject: 'Your Udyok Verification Code',
        text: `Your verification code is: ${otp}. This code is valid for 15 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (to: string, name: string) => {
    if (!transporter) {
        console.warn(`[Email Service] SMTP not configured. Did not send Welcome Email to ${to}.`);
        return;
    }

    const firstName = name.split(' ')[0] || 'there';

    const mailOptions = {
        from: `"The Udyok Team" <${env.smtp_user}>`,
        to,
        subject: 'Welcome to Udyok! 🎉 Supercharge your productivity.',
        text: `Hi ${firstName},\n\nWelcome to Udyok! We are thrilled to have you join our community.\n\nWhether you need a quiet desk for deep work or a vibrant meeting room to collaborate, Udyok has you covered.\n\nReady to get started? Book your first space today!\n\nCheers,\nThe Udyok Team`,
        html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; color: #333333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <div style="background-color: #1AB65C; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Welcome to Udyok!</h1>
                </div>
                
                <!-- Body -->
                <div style="padding: 40px 30px;">
                    <p style="font-size: 18px; line-height: 1.6; margin-top: 0;">Hi <strong>${firstName}</strong>, 👋</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                        We are absolutely thrilled to have you join our workspace community. Udyok was built to help professionals like you find the perfect environment to execute your best work.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                        Whether you need a quiet dedicated desk for deep focus or an engaging meeting room to collaborate, your next great workspace is just a tap away.
                    </p>
                    
                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="https://udyok.com/explore" style="background-color: #1AB65C; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(26, 182, 92, 0.2);">
                            Book Your First Space
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="font-size: 14px; color: #888888; margin: 0;">If you have any questions, simply reply to this email. We're here to help!</p>
                    <p style="font-size: 14px; color: #aaaaaa; margin-top: 10px;">&copy; ${new Date().getFullYear()} Udyok. All rights reserved.</p>
                </div>
                
            </div>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Welcome email sent to ${to}`);
    } catch (error) {
        console.error(`[Email Service] Failed to send Welcome email to ${to}:`, error);
    }
};
