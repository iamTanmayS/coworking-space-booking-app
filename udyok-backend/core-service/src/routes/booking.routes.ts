import { Router } from 'express';
import { getBookings, createBooking, getBookingDetails, updateBooking, cancelBooking } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getBookings);
router.post('/', createBooking);
router.get('/:id', getBookingDetails);
router.patch('/:id', updateBooking);
router.delete('/:id', cancelBooking);

export default router;
