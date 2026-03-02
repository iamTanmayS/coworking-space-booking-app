import { Router } from 'express';
import { register, verifyEmail, login, googleAuth, forgotPassword, resetPassword, refresh, resendCode } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/verify-otp', verifyEmail); // Fallback for cached frontend bundles
router.post('/resend-code', resendCode);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refresh);

export default router;
