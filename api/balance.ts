/**
 * Vercel Serverless Function: /api/balance
 * Balance endpoint for n8n and Webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Default mock state for testing
let currentBalance = 45230000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // GET: Return current balance
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      balance: currentBalance,
      formatted: `Rp ${currentBalance.toLocaleString('id-ID')}`,
      lastUpdated: new Date().toISOString(),
    });
  }

  // POST: Handle topup / balance update
  if (req.method === 'POST') {
    try {
      const { source, timestamp, data } = req.body || {};
      
      if (!data || !data.action) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const amount = Number(data.amount) || 0;
      if (data.action === 'topup') {
        currentBalance += amount;
      } else if (data.action === 'withdraw') {
        currentBalance = Math.max(0, currentBalance - amount);
      } else if (data.action === 'update' && amount > 0) {
        currentBalance = amount;
      }

      console.log('📥 Balance webhook received:', {
        source,
        action: data.action,
        amount,
        newBalance: currentBalance,
        timestamp,
      });

      return res.status(200).json({
        success: true,
        message: `Balance ${data.action}: Rp ${amount.toLocaleString('id-ID')}`,
        data: {
          action: data.action,
          amount,
          balance: currentBalance,
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

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
