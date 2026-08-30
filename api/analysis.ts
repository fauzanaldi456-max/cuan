/**
 * Vercel Serverless Function: /api/analysis
 * Receives stock analysis webhook from n8n
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { source, timestamp, data } = req.body;
    
    // Validate required fields
    if (!data || !data.symbol) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Log webhook (in production, send to monitoring service)
    console.log('📥 Analysis webhook received:', {
      source,
      symbol: data.symbol,
      score: data.score,
      verdict: data.verdict,
      timestamp,
    });
    
    // Return success
    // Frontend will poll atau gunakan WebSocket untuk real-time update
    return res.status(200).json({
      success: true,
      message: `Analysis for ${data.symbol} received`,
      data: {
        symbol: data.symbol,
        score: data.score,
        verdict: data.verdict,
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
