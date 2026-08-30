/**
 * Vercel Serverless Function: /api/balance
 * Receives balance updates webhook from n8n
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
    if (!data || !data.action || data.amount === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Log webhook
    console.log('📥 Balance webhook received:', {
      source,
      action: data.action,
      amount: data.amount,
      timestamp,
    });
    
    // Return success
    return res.status(200).json({
      success: true,
      message: `Balance ${data.action}: Rp ${data.amount.toLocaleString('id-ID')}`,
      data: {
        action: data.action,
        amount: data.amount,
        timestamp: timestamp || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error handling balance webhook:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
