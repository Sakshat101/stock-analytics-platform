
import type { Response } from 'express';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
        wl.id AS watchlist_id,
        wi.id,
        wi.symbol,
        wi.company_name,
        wi.created_at
      FROM watchlists wl
      LEFT JOIN watchlist_items wi
        ON wi.watchlist_id = wl.id
      WHERE wl.user_id = $1
      ORDER BY wi.created_at DESC`,
      [req.user?.userId]
    );

    return res.json({
      items: result.rows.filter((row) => row.symbol),
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    return res.status(500).json({
      message: 'Failed to fetch watchlist',
    });
  }
};

export const addToWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { symbol, companyName } = req.body;

    if (!symbol || !companyName) {
      return res.status(400).json({
        message: 'symbol and companyName are required',
      });
    }

    const watchlistResult = await pool.query(
      `SELECT id
       FROM watchlists
       WHERE user_id = $1
       LIMIT 1`,
      [req.user?.userId]
    );

    if (!watchlistResult.rowCount) {
      return res.status(404).json({
        message: 'Watchlist not found',
      });
    }

    const watchlistId = watchlistResult.rows[0].id;

    await pool.query(
      `INSERT INTO watchlist_items (watchlist_id, symbol, company_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (watchlist_id, symbol) DO NOTHING`,
      [watchlistId, symbol.toUpperCase(), companyName]
    );

    return res.status(201).json({
      message: 'Added to watchlist',
    });
  } catch (error) {
    console.error('Add watchlist error:', error);
    return res.status(500).json({
      message: 'Failed to add stock to watchlist',
    });
  }
};

export const removeFromWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { symbol } = req.params;

    const watchlistResult = await pool.query(
      `SELECT id
       FROM watchlists
       WHERE user_id = $1
       LIMIT 1`,
      [req.user?.userId]
    );

    if (!watchlistResult.rowCount) {
      return res.status(404).json({
        message: 'Watchlist not found',
      });
    }

    const watchlistId = watchlistResult.rows[0].id;

    const deleteResult = await pool.query(
      `DELETE FROM watchlist_items
       WHERE watchlist_id = $1 AND symbol = $2
       RETURNING id`,
      [watchlistId, symbol.toUpperCase()]
    );

    if (!deleteResult.rowCount) {
      return res.status(404).json({
        message: 'Stock not found in watchlist',
      });
    }

    return res.json({
      message: 'Removed from watchlist',
    });
  } catch (error) {
    console.error('Remove watchlist error:', error);
    return res.status(500).json({
      message: 'Failed to remove stock from watchlist',
    });
  }
};