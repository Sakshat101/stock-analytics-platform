
import { Router } from 'express';

import { requireAuth } from '../middlewares/auth.middleware.js';

import {
  getPortfolio,
  buyStock,
  sellStock,
} from '../controllers/portfolio.controller.js';

export const portfolioRoutes = Router();

portfolioRoutes.use(requireAuth);

portfolioRoutes.get(
  '/',
  getPortfolio
);

portfolioRoutes.post(
  '/buy',
  buyStock
);

portfolioRoutes.post(
  '/sell',
  sellStock
);