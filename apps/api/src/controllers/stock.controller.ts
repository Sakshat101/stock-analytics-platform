import type { Request, Response } from 'express';
import {
  buildMarketSnapshot,
  getMarketOverview,
  getStockBySymbol,
} from '../services/stock.service.js';

export const getAllStocks = (_req: Request, res: Response) => {
  try {
    const stocks = buildMarketSnapshot();

    return res.json({
      stocks,
    });
  } catch (error) {
    console.error('Get all stocks error:', error);

    return res.status(500).json({
      message: 'Failed to fetch stocks',
    });
  }
};

export const getStockBySymbolController = (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = getStockBySymbol(symbol);

    if (!stock) {
      return res.status(404).json({
        message: 'Stock not found',
      });
    }

    return res.json({
      stock,
    });
  } catch (error) {
    console.error('Get stock by symbol error:', error);

    return res.status(500).json({
      message: 'Failed to fetch stock',
    });
  }
};

export const getOverview = (_req: Request, res: Response) => {
  try {
    const overview = getMarketOverview();

    return res.json(overview);
  } catch (error) {
    console.error('Get market overview error:', error);

    return res.status(500).json({
      message: 'Failed to fetch market overview',
    });
  }
};