import { Router } from 'express';
import { getSpaces, getSpaceDetails, createSpace, updateSpace, deleteSpace } from '../controllers/space.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getSpaces);
router.post('/', authenticate, createSpace);
router.get('/:id', authenticate, getSpaceDetails);
router.patch('/:id', authenticate, updateSpace);
router.delete('/:id', authenticate, deleteSpace);

export default router;
