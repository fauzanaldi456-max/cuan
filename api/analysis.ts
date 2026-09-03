/**
 * Vercel Serverless Function: /api/analysis
 * Receives stock analysis webhook from n8n
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      status: 'ready',
      message: 'Analysis endpoint active',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === 'POST') {
    try {
      const { source, timestamp, data } = req.body || {};
      
      if (!data || !data.symbol) {
        return res.status(400).json({ success: false, error: 'Missing required data.symbol' });
      }
      
      console.log('📥 Analysis webhook received:', {
        source: source || 'n8n',
        symbol: data.symbol,
        score: data.score,
        verdict: data.verdict,
        timestamp: timestamp || new Date().toISOString(),
      });
      
      return res.status(200).json({
        success: true,
        message: `Analysis for ${data.symbol} received successfully`,
        data: {
          symbol: data.symbol,
          score: data.score || 75,
          verdict: data.verdict || 'BULLISH',
          insight: data.insight || 'Analysis received',
          recommendation: data.recommendation || 'BUY',
          timestamp: timestamp || new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error('Error handling analysis webhook:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
