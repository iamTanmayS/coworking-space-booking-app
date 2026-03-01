import type { Response } from 'express';
import pool from '../config/db/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

const autoUpdateStatuses = async () => {
    try {
        await pool.query(`
            UPDATE bookings 
            SET status = 'ongoing' 
            WHERE status = 'confirmed' AND start_time <= CURRENT_TIMESTAMP AND end_time > CURRENT_TIMESTAMP
        `);
        await pool.query(`
            UPDATE bookings 
            SET status = 'completed' 
            WHERE status IN ('confirmed', 'ongoing') AND end_time <= CURRENT_TIMESTAMP
        `);
    } catch (error) {
        console.error('Error auto-updating statuses:', error);
    }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
    try {
        await autoUpdateStatuses();
        const userId = req.user?.userId;
        const { status, startDate, endDate } = req.query;

        let paramIndex = 2;
        const queryParams: any[] = [userId];
        let whereClauses: string[] = ['user_id = $1'];

        if (status) {
            whereClauses.push(`status = $${paramIndex}`);
            queryParams.push(status);
            paramIndex++;
        }

        if (startDate && endDate) {
            whereClauses.push(`start_time >= $${paramIndex} AND end_time <= $${paramIndex + 1}`);
            queryParams.push(startDate, endDate);
            paramIndex += 2;
        }

        const whereString = `WHERE ${whereClauses.join(' AND ')}`;

        const result = await pool.query(
            `SELECT id, user_id as "userId", space_id as "spaceId", 
             start_time as "startDate", end_time as "endDate", 
             TO_CHAR(start_time, 'HH24:MI') as "startTime", TO_CHAR(end_time, 'HH24:MI') as "endTime",
             status, total_amount as "totalAmount", notes
             FROM bookings 
             ${whereString} 
             ORDER BY start_time DESC`,
            queryParams
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userId = req.user?.userId;
        const {
            spaceId, startDate, endDate,
            startTime, endTime,
            paymentMethodId, notes,
            totalAmount = 100
        } = req.body;

        if (!userId) {
            await client.query('ROLLBACK');
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!spaceId) {
            await client.query('ROLLBACK');
            res.status(400).json({ error: 'spaceId is required' });
            return;
        }

        // Build actual timestamps from date + time strings if separate fields provided
        // e.g. startDate = '2024-03-15T00:00:00Z', startTime = '09:00'
        let startTs: string;
        let endTs: string;

        if (startTime && endTime && startDate) {
            // Extract date portion (YYYY-MM-DD) from the ISO date string
            const datePart = new Date(startDate).toISOString().split('T')[0];
            startTs = `${datePart}T${startTime}:00Z`;
            endTs = `${datePart}T${endTime}:00Z`;
        } else {
            startTs = startDate || new Date().toISOString();
            endTs = endDate || new Date().toISOString();
        }

        // Check if booking slot is available
        const conflictCheck = await client.query(
            `SELECT id FROM bookings
             WHERE space_id = $1
               AND status != 'cancelled'
               AND start_time < $2
               AND end_time > $3`,
            [spaceId, endTs, startTs]
        );

        if (conflictCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            res.status(409).json({ error: 'Space is already booked for the selected time' });
            return;
        }

        // Create the booking
        const result = await client.query(
            `INSERT INTO bookings (user_id, space_id, start_time, end_time, total_amount, notes, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')
             RETURNING id, user_id as "userId", space_id as "spaceId",
             start_time as "startDate", end_time as "endDate",
             status, total_amount as "totalAmount", notes`,
            [userId, spaceId, startTs, endTs, totalAmount, notes]
        );

        // Record the payment transaction (paymentMethodId may be a Stripe PI ID or 'wallet' etc.)
        await client.query(
            `INSERT INTO transactions (user_id, amount, type, description, status)
             VALUES ($1, $2, 'debit', $3, 'completed')`,
            [
                userId,
                totalAmount,
                `Booking ${result.rows[0].id} | ref: ${paymentMethodId ?? 'direct'}`
            ]
        );

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const getBookingDetails = async (req: AuthRequest, res: Response) => {
    try {
        await autoUpdateStatuses();
        const { id } = req.params;
        const userId = req.user?.userId;

        const result = await pool.query(
            `SELECT id, user_id as "userId", space_id as "spaceId", 
             start_time as "startDate", end_time as "endDate", 
             TO_CHAR(start_time, 'HH24:MI') as "startTime", TO_CHAR(end_time, 'HH24:MI') as "endTime",
             status, total_amount as "totalAmount", notes
             FROM bookings WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Get booking details error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { startDate, endDate, notes } = req.body;

        const result = await pool.query(
            `UPDATE bookings 
             SET start_time = COALESCE($1, start_time), 
                 end_time = COALESCE($2, end_time),
                 notes = COALESCE($3, notes)
             WHERE id = $4 AND user_id = $5
             RETURNING id, user_id as "userId", space_id as "spaceId", 
             start_time as "startDate", end_time as "endDate", 
             status, total_amount as "totalAmount", notes`,
            [startDate, endDate, notes, id, userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        await pool.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
