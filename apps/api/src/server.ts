import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { createApp } from './app.js';
import { initStockSocket } from './sockets/stock.socket.js';
import { testDbConnection } from './config/db.js';

dotenv.config();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

initStockSocket(io);

const PORT = Number(process.env.PORT || 8080);

const startServer = async () => {
  await testDbConnection();

  server.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});