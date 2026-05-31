import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { authRoutes } from './routes/auth.routes.js';
import { stockRoutes } from './routes/stock.routes.js';
import { watchlistRoutes } from './routes/watchlist.routes.js';
import { portfolioRoutes } from './routes/portfolio.routes.js';
import { alertRoutes } from './routes/alert.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';
import { userRoutes } from './routes/user.routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'api',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/stocks', stockRoutes);
  app.use('/api/watchlist', watchlistRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/users', userRoutes);

  return app;
};
