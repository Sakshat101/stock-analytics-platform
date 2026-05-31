import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

type JwtUserPayload = {
  userId: string;
  email: string;
  role: string;
};

const mapUser = (row: {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  avatarUrl: row.avatar_url,
});

const signAccessToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '15m' }
  );
};

const signRefreshToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '30d' }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'fullName, email, and password are required',
      });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, role, avatar_url`,
      [fullName, email, passwordHash]
    );

    const user = userResult.rows[0];

    await pool.query(
      `INSERT INTO portfolios (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO watchlists (user_id)
       VALUES ($1)
       ON CONFLICT DO NOTHING`,
      [user.id]
    );

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await pool.query(
      `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshTokenHash]
    );

    return res.status(201).json({
      message: 'Registered successfully',
      user: mapUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      message: 'Failed to register user',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required',
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, avatar_url
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await pool.query(
      `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshTokenHash]
    );

    return res.json({
      message: 'Login successful',
      user: mapUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Failed to login',
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token is required',
      });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtUserPayload;

    const userResult = await pool.query(
      `SELECT id, email, role
       FROM users
       WHERE id = $1`,
      [payload.userId]
    );

    if (!userResult.rowCount || userResult.rowCount === 0) {
      return res.status(401).json({
        message: 'Invalid session',
      });
    }

    const user = userResult.rows[0];

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' }
    );

    return res.json({
      accessToken: newAccessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(401).json({
      message: 'Invalid refresh token',
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, avatar_url, created_at
       FROM users
       WHERE id = $1`,
      [req.user?.userId]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      user: mapUser(result.rows[0]),
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({
      message: 'Failed to fetch user',
    });
  }
};