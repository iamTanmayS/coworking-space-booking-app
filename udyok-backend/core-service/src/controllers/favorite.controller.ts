import type { Response } from 'express';
import pool from '../config/db/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// Haversine formula – returns distance in km
const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Walking speed ~5 km/h => 12 min per km
const walkingMinutes = (km: number): number => Math.round(km * 12);

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { page = 1, limit = 10, lat, lng } = req.query;
        const userLat = lat ? parseFloat(lat as string) : null;
        const userLng = lng ? parseFloat(lng as string) : null;
        const offset = (Number(page) - 1) * Number(limit);

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const countResult = await pool.query('SELECT COUNT(*) FROM favorites WHERE user_id = $1', [userId]);
        const total = parseInt(countResult.rows[0].count);

        const dataResult = await pool.query(
            `SELECT s.id, s.category, s.name, 
             (SELECT image_url FROM space_images WHERE space_id = s.id LIMIT 1) as thumbnail,
             s.price_per_hour as "pricePerHour", s.rating, s.total_reviews as "totalReviews",
             s.city, s.latitude, s.longitude
             FROM spaces s JOIN favorites f ON s.id = f.space_id 
             WHERE f.user_id = $1 
             ORDER BY f.created_at DESC 
             LIMIT $2 OFFSET $3`,
            [userId, Number(limit), offset]
        );

        const data = dataResult.rows.map(row => {
            let distanceKm: number | null = null;
            let travelTimeMin: number | null = null;
            if (userLat != null && userLng != null && row.latitude != null && row.longitude != null) {
                distanceKm = parseFloat(haversineKm(userLat, userLng, Number(row.latitude), Number(row.longitude)).toFixed(1));
                travelTimeMin = walkingMinutes(distanceKm);
            }
            return {
                ...row,
                pricePerHour: Number(row.pricePerHour),
                rating: Number(row.rating || 0),
                totalReviews: Number(row.totalReviews || 0),
                currency: '₹',
                isOpenNow: true,
                isFavorite: true,
                distanceKm,
                travelTimeMin,
            };
        });

        res.status(200).json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const { spaceId } = req.params;
        const userId = req.user?.userId;

        await pool.query(
            'INSERT INTO favorites (user_id, space_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, spaceId]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const { spaceId } = req.params;
        const userId = req.user?.userId;

        await pool.query('DELETE FROM favorites WHERE user_id = $1 AND space_id = $2', [userId, spaceId]);

        res.status(204).send();
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
