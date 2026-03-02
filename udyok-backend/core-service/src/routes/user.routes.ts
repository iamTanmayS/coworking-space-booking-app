import { Router } from 'express';
import { getMe, updateProfile, uploadAvatar, updateLocation, changePassword } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all user routes
router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', updateProfile);
router.post('/me/avatar', uploadAvatar);
router.post('/me/location', updateLocation);
router.patch('/me/password', changePassword);

export default router;
