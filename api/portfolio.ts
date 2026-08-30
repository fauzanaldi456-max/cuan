/**
 * Vercel Serverless Function: /api/portfolio
 * Receives portfolio updates webhook from n8n
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
    if (!data || !data.action) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Log webhook
    console.log('📥 Portfolio webhook received:', {
      source,
      action: data.action,
      symbol: data.holding?.symbol,
      timestamp,
    });
    
    // Return success
    return res.status(200).json({
      success: true,
      message: `Portfolio ${data.action} received`,
      data: {
        action: data.action,
        symbol: data.holding?.symbol,
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
