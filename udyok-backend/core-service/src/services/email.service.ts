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
