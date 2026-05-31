
import type { Server, Socket } from 'socket.io';
import { buildMarketSnapshot } from '../services/stock.service.js';

type PortfolioPayload = {
  totalValue: number;
  unrealizedPnL: number;
};

export const initStockSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    socket.emit('market:snapshot', buildMarketSnapshot());

    const interval = setInterval(() => {
      const snapshot = buildMarketSnapshot();

      const portfolioPayload: PortfolioPayload = {
        totalValue: 100000 + Math.random() * 12000,
        unrealizedPnL: Math.random() * 5000 - 1500,
      };

      socket.emit('market:update', snapshot);
      socket.emit('watchlist:update', snapshot);
      socket.emit('portfolio:update', portfolioPayload);
    }, 2000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Socket disconnected:', socket.id);
    });
  });
};