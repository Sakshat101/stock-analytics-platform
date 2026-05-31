
import { Router } from 'express';

import { requireAuth } from '../middlewares/auth.middleware.js';

import {
  listAlerts,
  createAlert,
  deleteAlert,
} from '../controllers/alert.controller.js';

export const alertRoutes = Router();

alertRoutes.use(requireAuth);

alertRoutes.get(
  '/',
  listAlerts
);

alertRoutes.post(
  '/',
  createAlert
);

alertRoutes.delete(
  '/:id',
  deleteAlert
);
