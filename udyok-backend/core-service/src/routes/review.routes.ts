import { Router } from 'express';
import { getSpaceReviews, createSpaceReview } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Notice: In the openapi spec, it mounts to /spaces/{id}/reviews. 
// Standardized grouping means this could be mounted on /spaces routers or standalone.
// We'll expose them taking spaceId as parameter.
router.get('/spaces/:id/reviews', getSpaceReviews);
router.post('/spaces/:id/reviews', authenticate, createSpaceReview);

export default router;
