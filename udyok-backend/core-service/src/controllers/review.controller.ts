import type { Request, Response } from 'express';
import pool from '../config/db/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getSpaceReviews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // spaceId
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const countResult = await pool.query('SELECT COUNT(*) FROM reviews WHERE space_id = $1', [id]);
        const total = parseInt(countResult.rows[0].count);

        const reviewResult = await pool.query(
            `SELECT r.id as "reviewId", r.title, r.description, r.rating, r.created_at as "createdAt",
             u.id as "userId", u.name as "username", u.profile_image as "userImage"
             FROM reviews r JOIN users u ON r.user_id = u.id 
             WHERE r.space_id = $1
             ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`,
            [id, Number(limit), offset]
        );

        const data = reviewResult.rows.map(row => ({
            reviewId: row.reviewId,
            title: row.title,
            description: row.description,
            rating: parseFloat(row.rating),
            images: [], // Assuming reviews table doesn't have images yet, but schema does. Can be enhanced later
            createdAt: row.createdAt,
            user: {
                userId: row.userId,
                username: row.username,
                userImage: row.userImage
            }
        }));

        res.status(200).json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Get space reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createSpaceReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // spaceId
        const userId = req.user?.userId;
        const { title, description, rating } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `INSERT INTO reviews (space_id, user_id, title, description, rating) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [id, userId, title, description, rating]
        );

        // Update space total reviews & rating
        await pool.query(
            `UPDATE spaces 
             SET total_reviews = total_reviews + 1, 
                 rating = ((rating * total_reviews) + $1) / (total_reviews + 1)
             WHERE id = $2`,
            [rating, id]
        );

        res.status(201).json({
            reviewId: result.rows[0].id,
            message: "Review created successfully"
        });
    } catch (error) {
        console.error('Create space review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
