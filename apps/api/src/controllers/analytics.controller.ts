
import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const getAnalytics = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    return res.json({
      sectorAllocation: [
        { sector: 'Banking', value: 35 },
        { sector: 'IT Services', value: 28 },
        { sector: 'Energy', value: 14 },
        { sector: 'FMCG', value: 12 },
        { sector: 'Telecom', value: 11 },
      ],
      riskScore: 62,
      monthlyReturn: 7.2,
      portfolioHealth: 'Good',
      exposureSummary: {
        banking: 35,
        it: 28,
        energy: 14,
        others: 23,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({
      message: 'Failed to fetch analytics',
    });
  }
};

export const getSentiment = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    return res.json({
      news: [
        {
          symbol: 'RELIANCE',
          title: 'Refining margin outlook improves after strong quarterly guidance',
          sentimentScore: 0.72,
          label: 'POSITIVE',
        },
        {
          symbol: 'TCS',
          title: 'TCS sees strong deal wins across enterprise cloud and AI work',
          sentimentScore: 0.81,
          label: 'BULLISH',
        },
        {
          symbol: 'SBIN',
          title: 'Asset quality remains stable amid steady credit growth',
          sentimentScore: 0.56,
          label: 'NEUTRAL',
        },
        {
          symbol: 'INFY',
          title: 'Global spending remains cautious but large deal pipeline supports outlook',
          sentimentScore: 0.49,
          label: 'MIXED',
        },
      ],
      marketMood: 'Moderately Positive',
    });
  } catch (error) {
    console.error('Get sentiment error:', error);
    return res.status(500).json({
      message: 'Failed to fetch sentiment data',
    });
  }
};