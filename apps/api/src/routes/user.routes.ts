import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/user.controller.js';

export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.get('/profile', getProfile);

userRoutes.patch(
  '/profile',
  updateProfile
);

userRoutes.patch(
  '/password',
  changePassword
);
