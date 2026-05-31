
import type { Response } from 'express';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getPortfolio = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const portfolioResult = await pool.query(
      `SELECT *
       FROM portfolios
       WHERE user_id = $1
       LIMIT 1`,
      [req.user?.userId]
    );

    if (!portfolioResult.rowCount) {
      return res.status(404).json({
        message: 'Portfolio not found',
      });
    }

    const portfolio = portfolioResult.rows[0];

    const holdingsResult = await pool.query(
      `SELECT *
       FROM holdings
       WHERE portfolio_id = $1
       ORDER BY updated_at DESC`,
      [portfolio.id]
    );

    const transactionsResult = await pool.query(
      `SELECT *
       FROM transactions
       WHERE portfolio_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [portfolio.id]
    );

    const totalHoldingsValue = holdingsResult.rows.reduce(
  (
    sum: number,
    holding: {
      quantity: number;
      current_price: number;
    }
  ) => sum + Number(holding.quantity) * Number(holding.current_price),
  0
);

    const totalPortfolioValue =
      Number(portfolio.cash_balance) + totalHoldingsValue;

    const unrealizedPnL = holdingsResult.rows.reduce(
  (
    sum: number,
    holding: {
      unrealized_pnl: number;
    }
  ) => sum + Number(holding.unrealized_pnl),
  0
);

    return res.json({
      portfolio: {
        ...portfolio,
        totalPortfolioValue,
        unrealizedPnL,
      },
      holdings: holdingsResult.rows,
      transactions: transactionsResult.rows,
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    return res.status(500).json({
      message: 'Failed to fetch portfolio',
    });
  }
};

export const buyStock = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { symbol, companyName, quantity, price } = req.body;

    if (!symbol || !companyName || !quantity || !price) {
      return res.status(400).json({
        message: 'symbol, companyName, quantity, and price are required',
      });
    }

    const qty = Number(quantity);
    const buyPrice = Number(price);

    if (qty <= 0 || buyPrice <= 0) {
      return res.status(400).json({
        message: 'quantity and price must be positive',
      });
    }

    const portfolioResult = await pool.query(
      `SELECT *
       FROM portfolios
       WHERE user_id = $1
       LIMIT 1`,
      [req.user?.userId]
    );

    if (!portfolioResult.rowCount) {
      return res.status(404).json({
        message: 'Portfolio not found',
      });
    }

    const portfolio = portfolioResult.rows[0];
    const totalCost = qty * buyPrice;

    if (Number(portfolio.cash_balance) < totalCost) {
      return res.status(400).json({
        message: 'Insufficient cash balance',
      });
    }

    await pool.query('BEGIN');

    await pool.query(
      `UPDATE portfolios
       SET cash_balance = cash_balance - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [totalCost, portfolio.id]
    );

    const holdingResult = await pool.query(
      `SELECT *
       FROM holdings
       WHERE portfolio_id = $1 AND symbol = $2
       LIMIT 1`,
      [portfolio.id, symbol.toUpperCase()]
    );

    if (holdingResult.rowCount) {
      const holding = holdingResult.rows[0];
      const currentQty = Number(holding.quantity);
      const currentAvg = Number(holding.average_buy_price);

      const newQty = currentQty + qty;
      const newAvg =
        (currentQty * currentAvg + qty * buyPrice) / newQty;

      await pool.query(
        `UPDATE holdings
         SET quantity = $1,
             average_buy_price = $2,
             current_price = $3,
             updated_at = NOW()
         WHERE id = $4`,
        [newQty, newAvg, buyPrice, holding.id]
      );
    } else {
      await pool.query(
        `INSERT INTO holdings (
          portfolio_id,
          symbol,
          company_name,
          quantity,
          average_buy_price,
          current_price,
          unrealized_pnl
        )
        VALUES ($1, $2, $3, $4, $5, $6, 0)`,
        [
          portfolio.id,
          symbol.toUpperCase(),
          companyName,
          qty,
          buyPrice,
          buyPrice,
        ]
      );
    }

    await pool.query(
      `INSERT INTO transactions (
        portfolio_id,
        symbol,
        company_name,
        side,
        quantity,
        price,
        total_value
      )
      VALUES ($1, $2, $3, 'BUY', $4, $5, $6)`,
      [
        portfolio.id,
        symbol.toUpperCase(),
        companyName,
        qty,
        buyPrice,
        totalCost,
      ]
    );

    await pool.query('COMMIT');

    return res.status(201).json({
      message: 'Buy order executed',
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Buy stock error:', error);

    return res.status(500).json({
      message: 'Failed to execute buy order',
    });
  }
};

export const sellStock = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { symbol, companyName, quantity, price } = req.body;

    if (!symbol || !companyName || !quantity || !price) {
      return res.status(400).json({
        message: 'symbol, companyName, quantity, and price are required',
      });
    }

    const qty = Number(quantity);
    const sellPrice = Number(price);

    if (qty <= 0 || sellPrice <= 0) {
      return res.status(400).json({
        message: 'quantity and price must be positive',
      });
    }

    const portfolioResult = await pool.query(
      `SELECT *
       FROM portfolios
       WHERE user_id = $1
       LIMIT 1`,
      [req.user?.userId]
    );

    if (!portfolioResult.rowCount) {
      return res.status(404).json({
        message: 'Portfolio not found',
      });
    }

    const portfolio = portfolioResult.rows[0];

    const holdingResult = await pool.query(
      `SELECT *
       FROM holdings
       WHERE portfolio_id = $1 AND symbol = $2
       LIMIT 1`,
      [portfolio.id, symbol.toUpperCase()]
    );

    if (!holdingResult.rowCount) {
      return res.status(404).json({
        message: 'Holding not found',
      });
    }

    const holding = holdingResult.rows[0];
    const currentQty = Number(holding.quantity);

    if (currentQty < qty) {
      return res.status(400).json({
        message: 'Not enough quantity to sell',
      });
    }

    const totalValue = qty * sellPrice;

    await pool.query('BEGIN');

    await pool.query(
      `UPDATE portfolios
       SET cash_balance = cash_balance + $1,
           updated_at = NOW()
       WHERE id = $2`,
      [totalValue, portfolio.id]
    );

    const remainingQty = currentQty - qty;

    if (remainingQty === 0) {
      await pool.query(
        `DELETE FROM holdings
         WHERE id = $1`,
        [holding.id]
      );
    } else {
      await pool.query(
        `UPDATE holdings
         SET quantity = $1,
             current_price = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [remainingQty, sellPrice, holding.id]
      );
    }

    await pool.query(
      `INSERT INTO transactions (
        portfolio_id,
        symbol,
        company_name,
        side,
        quantity,
        price,
        total_value
      )
      VALUES ($1, $2, $3, 'SELL', $4, $5, $6)`,
      [
        portfolio.id,
        symbol.toUpperCase(),
        companyName,
        qty,
        sellPrice,
        totalValue,
      ]
    );

    await pool.query('COMMIT');

    return res.json({
      message: 'Sell order executed',
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Sell stock error:', error);

    return res.status(500).json({
      message: 'Failed to execute sell order',
    });
  }
};