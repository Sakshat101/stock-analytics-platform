
import { Router } from 'express';

import { requireAuth } from '../middlewares/auth.middleware.js';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlist.controller.js';

export const watchlistRoutes = Router();

watchlistRoutes.use(requireAuth);

watchlistRoutes.get(
  '/',
  getWatchlist
);

watchlistRoutes.post(
  '/',
  addToWatchlist
);

watchlistRoutes.delete(
  '/:symbol',
  removeFromWatchlist
);
