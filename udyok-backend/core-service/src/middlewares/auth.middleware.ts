import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';

export interface AuthRequest extends Request {
    user?: any; // Consider typing this properly if we have a defined user payload
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: { message: 'Authorization header is missing', code: 'UNAUTHORIZED' } });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: { message: 'Token is missing', code: 'UNAUTHORIZED' } });
            return;
        }

        const decoded = jwt.verify(token, env.jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: { message: 'Invalid or expired token', code: 'UNAUTHORIZED' } });
    }
};
