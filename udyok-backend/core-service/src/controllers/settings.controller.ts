import type { Response } from 'express';
import pool from '../config/db/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Fetch settings, initialize if not exists for user
        let result = await pool.query('SELECT * FROM user_settings WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            // Lazy initialization
            result = await pool.query(
                `INSERT INTO user_settings (user_id) VALUES ($1) RETURNING *`,
                [userId]
            );
        }

        const settings = result.rows[0];

        res.status(200).json({
            theme: settings.theme,
            notifications: settings.notifications,
            language: settings.language,
            timezone: settings.timezone,
            emailNotifications: settings.email_notifications,
            smsNotifications: settings.sms_notifications
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { theme, notifications, language, timezone, emailNotifications, smsNotifications } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `UPDATE user_settings 
             SET theme = COALESCE($1, theme),
                 notifications = COALESCE($2, notifications),
                 language = COALESCE($3, language),
                 timezone = COALESCE($4, timezone),
                 email_notifications = COALESCE($5, email_notifications),
                 sms_notifications = COALESCE($6, sms_notifications),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $7
             RETURNING *`,
            [theme, notifications, language, timezone, emailNotifications, smsNotifications, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User settings not found' });
            return;
        }

        const settings = result.rows[0];

        res.status(200).json({
            theme: settings.theme,
            notifications: settings.notifications,
            language: settings.language,
            timezone: settings.timezone,
            emailNotifications: settings.email_notifications,
            smsNotifications: settings.sms_notifications
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
