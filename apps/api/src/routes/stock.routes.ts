import { Router } from 'express';
import {
  getAllStocks,
  getOverview,
  getStockBySymbolController,
} from '../controllers/stock.controller.js';

export const stockRoutes = Router();

stockRoutes.get('/', getAllStocks);

stockRoutes.get('/overview', getOverview);

stockRoutes.get('/:symbol', getStockBySymbolController);