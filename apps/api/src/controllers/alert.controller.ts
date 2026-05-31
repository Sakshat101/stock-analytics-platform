
import type { Response } from 'express';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const listAlerts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM alerts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user?.userId]
    );

    return res.json({
      alerts: result.rows,
    });
  } catch (error) {
    console.error('List alerts error:', error);
    return res.status(500).json({
      message: 'Failed to fetch alerts',
    });
  }
};

export const createAlert = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { symbol, condition, targetPrice } = req.body;

    if (!symbol || !condition || !targetPrice) {
      return res.status(400).json({
        message: 'symbol, condition, and targetPrice are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO alerts (
        user_id,
        symbol,
        condition,
        target_price
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        req.user?.userId,
        symbol.toUpperCase(),
        condition.toUpperCase(),
        targetPrice,
      ]
    );

    return res.status(201).json({
      alert: result.rows[0],
    });
  } catch (error) {
    console.error('Create alert error:', error);
    return res.status(500).json({
      message: 'Failed to create alert',
    });
  }
};

export const deleteAlert = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM alerts
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user?.userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        message: 'Alert not found',
      });
    }

    return res.json({
      message: 'Alert deleted',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    return res.status(500).json({
      message: 'Failed to delete alert',
    });
  }
};