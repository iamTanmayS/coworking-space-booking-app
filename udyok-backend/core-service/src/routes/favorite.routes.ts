import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getFavorites);
router.post('/:spaceId', addFavorite);
router.delete('/:spaceId', removeFavorite);

export default router;
