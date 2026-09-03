/**
 * Vercel Serverless Function: /api/portfolio & /api/holdings
 * Returns and updates portfolio holdings
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const defaultHoldings = [
  {
    id: 'holding-1',
    symbol: 'BBCA',
    name: 'PT Bank Central Asia Tbk.',
    avgPrice: 9750,
    currentPrice: 10050,
    lots: 50,
    totalValue: 50250000,
    plAmount: 1500000,
    plPercent: 3.08,
  },
  {
    id: 'holding-2',
    symbol: 'BBRI',
    name: 'PT Bank Rakyat Indonesia Tbk.',
    avgPrice: 4900,
    currentPrice: 5175,
    lots: 100,
    totalValue: 51750000,
    plAmount: 2750000,
    plPercent: 5.61,
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // GET: Return portfolio holdings
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      holdings: defaultHoldings,
      totalHoldings: defaultHoldings.length,
      lastUpdated: new Date().toISOString(),
    });
  }

  // POST: Add or update holding
  if (req.method === 'POST') {
    try {
      const { source, timestamp, data } = req.body || {};
      
      if (!data || !data.action) {
        return res.status(400).json({ success: false, error: 'Missing required action' });
      }

      console.log('📥 Portfolio webhook received:', {
        source,
        action: data.action,
        symbol: data.holding?.symbol,
        timestamp,
      });

      return res.status(200).json({
        success: true,
        message: `Portfolio ${data.action} received successfully`,
        data: {
          action: data.action,
          holding: data.holding,
          timestamp: timestamp || new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Error handling portfolio webhook:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
