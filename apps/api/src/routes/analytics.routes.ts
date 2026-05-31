
import { Router } from 'express';

import { requireAuth } from '../middlewares/auth.middleware.js';

import {
  getAnalytics,
  getSentiment,
} from '../controllers/analytics.controller.js';

export const analyticsRoutes = Router();

analyticsRoutes.use(requireAuth);

analyticsRoutes.get(
  '/',
  getAnalytics
);

analyticsRoutes.get(
  '/sentiment',
  getSentiment
);
