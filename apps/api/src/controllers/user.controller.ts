import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        avatar_url,
        role,
        created_at
      FROM users
      WHERE id = $1`,
      [req.user?.userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to fetch profile',
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { fullName, avatarUrl } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET
         full_name = COALESCE($1, full_name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
       WHERE id = $3
       RETURNING
         id,
         full_name,
         email,
         avatar_url,
         role`,
      [
        fullName ?? null,
        avatarUrl ?? null,
        req.user?.userId,
      ]
    );

    return res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to update profile',
    });
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userResult = await pool.query(
      `SELECT password_hash
       FROM users
       WHERE id = $1`,
      [req.user?.userId]
    );

    if (!userResult.rowCount) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    const newHash = await bcrypt.hash(
      newPassword,
      12
    );

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [
        newHash,
        req.user?.userId,
      ]
    );

    return res.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to update password',
    });
  }
};