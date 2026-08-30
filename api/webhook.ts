/**
 * Webhook API Endpoint
 * Receives data from n8n workflows and updates localStorage
 * 
 * Endpoints:
 * - POST /api/webhook/analysis - Stock analysis from TradingView → Claude AI
 * - POST /api/webhook/portfolio - Portfolio updates
 * - POST /api/webhook/balance - Balance updates
 * - POST /api/webhook/transaction - Transaction records
 */

export interface WebhookRequest {
  source: 'n8n' | 'tradingview' | 'telegram' | 'manual';
  timestamp: string;
  data: any;
}

export interface AnalysisWebhook {
  symbol: string;
  name: string;
  price: number;
  score: number;
  verdict: 'BULLISH' | 'BEARISH' | 'TO THE MOON' | 'BERDARAH' | 'SIDEWAYS';
  status: string;
  fundamental_score: number;
  technical_score: number;
  momentum_score: number;
  sentiment_score: number;
  risk_score: number;
  insight: string;
  recommendation: string;
  analyzed_at: string;
}

export interface PortfolioWebhook {
  action: 'add' | 'update' | 'delete';
  holding: {
    id?: string;
    symbol: string;
    name: string;
    avgPrice: number;
    currentPrice: number;
    lots: number;
    notes?: string;
  };
}

export interface BalanceWebhook {
  action: 'topup' | 'withdraw' | 'update';
  amount: number;
  method?: string;
  notes?: string;
}

export interface TransactionWebhook {
  type: 'BUY' | 'SELL' | 'TOP_UP' | 'WITHDRAW';
  symbol?: string;
  amount: number;
  price?: number;
  lots?: number;
  method?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
  HOLDINGS: 'cuanterus_holdings',
  BALANCE: 'cuanterus_balance',
  HISTORY: 'cuanterus_history',
  TRANSACTIONS: 'cuanterus_transactions',
  WEBHOOK_LOG: 'cuanterus_webhook_log',
};

/**
 * Log webhook untuk debugging
 */
function logWebhook(endpoint: string, data: any) {
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEBHOOK_LOG) || '[]');
  logs.unshift({
    endpoint,
    timestamp: new Date().toISOString(),
    data,
  });
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.length = 100;
  }
  
  localStorage.setItem(STORAGE_KEYS.WEBHOOK_LOG, JSON.stringify(logs));
}

/**
 * Handle Analysis Webhook
 * From: TradingView → n8n → Claude AI → Frontend
 */
export function handleAnalysisWebhook(webhook: WebhookRequest<AnalysisWebhook>) {
  try {
    const { data } = webhook;
    
    // Get current history
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    
    // Add new analysis
    const newAnalysis = {
      id: Date.now().toString(),
      symbol: data.symbol,
      name: data.name,
      price: data.price,
      score: data.score,
      verdict: data.verdict,
      status: data.status,
      fundamental_score: data.fundamental_score,
      technical_score: data.technical_score,
      momentum_score: data.momentum_score,
      sentiment_score: data.sentiment_score,
      risk_score: data.risk_score,
      insight: data.insight,
      recommendation: data.recommendation,
      analyzedAt: data.analyzed_at || new Date().toISOString(),
    };
    
    history.unshift(newAnalysis);
    
    // Keep only last 100 analyses
    if (history.length > 100) {
      history.length = 100;
    }
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    logWebhook('/api/webhook/analysis', data);
    
    // Trigger custom event untuk update UI
    window.dispatchEvent(new CustomEvent('cuanterus:analysis', { detail: newAnalysis }));
    
    return {
      success: true,
      message: 'Analysis recorded successfully',
      data: newAnalysis,
    };
  } catch (error: any) {
    console.error('Error handling analysis webhook:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handle Portfolio Webhook
 * From: n8n → Frontend (add/update/delete holding)
 */
export function handlePortfolioWebhook(webhook: WebhookRequest<PortfolioWebhook>) {
  try {
    const { data } = webhook;
    const holdings = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDINGS) || '[]');
    
    if (data.action === 'add') {
      const newHolding = {
        id: Date.now().toString(),
        symbol: data.holding.symbol,
        name: data.holding.name,
        avgPrice: data.holding.avgPrice,
        currentPrice: data.holding.currentPrice,
        lots: data.holding.lots,
        shares: data.holding.lots * 100,
        totalValue: data.holding.currentPrice * (data.holding.lots * 100),
        plAmount: (data.holding.currentPrice - data.holding.avgPrice) * (data.holding.lots * 100),
        plPercent: ((data.holding.currentPrice - data.holding.avgPrice) / data.holding.avgPrice) * 100,
        notes: data.holding.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      holdings.push(newHolding);
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
      
      window.dispatchEvent(new CustomEvent('cuanterus:holding-added', { detail: newHolding }));
      
      return {
        success: true,
        message: `Added ${data.holding.symbol} to portfolio`,
        data: newHolding,
      };
    }
    
    if (data.action === 'update' && data.holding.id) {
      const index = holdings.findIndex((h: any) => h.id === data.holding.id);
      if (index === -1) {
        return { success: false, error: 'Holding not found' };
      }
      
      const holding = holdings[index];
      const newPrice = data.holding.currentPrice ?? holding.currentPrice;
      const newLots = data.holding.lots ?? holding.lots;
      
      holdings[index] = {
        ...holding,
        currentPrice: newPrice,
        lots: newLots,
        shares: newLots * 100,
        totalValue: newPrice * (newLots * 100),
        plAmount: (newPrice - holding.avgPrice) * (newLots * 100),
        plPercent: ((newPrice - holding.avgPrice) / holding.avgPrice) * 100,
        notes: data.holding.notes ?? holding.notes,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
      
      window.dispatchEvent(new CustomEvent('cuanterus:holding-updated', { detail: holdings[index] }));
      
      return {
        success: true,
        message: `Updated ${holding.symbol}`,
        data: holdings[index],
      };
    }
    
    if (data.action === 'delete' && data.holding.id) {
      const holding = holdings.find((h: any) => h.id === data.holding.id);
      if (!holding) {
        return { success: false, error: 'Holding not found' };
      }
      
      const filtered = holdings.filter((h: any) => h.id !== data.holding.id);
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(filtered));
      
      window.dispatchEvent(new CustomEvent('cuanterus:holding-deleted', { detail: holding }));
      
      return {
        success: true,
        message: `Deleted ${holding.symbol}`,
        data: holding,
      };
    }
    
    return { success: false, error: 'Invalid action' };
  } catch (error: any) {
    console.error('Error handling portfolio webhook:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handle Balance Webhook
 * From: n8n → Frontend (topup/withdraw/update)
 */
export function handleBalanceWebhook(webhook: WebhookRequest<BalanceWebhook>) {
  try {
    const { data } = webhook;
    const balanceData = JSON.parse(localStorage.getItem(STORAGE_KEYS.BALANCE) || '{"balance":0}');
    
    let newBalance = balanceData.balance;
    
    if (data.action === 'topup') {
      newBalance += data.amount;
    } else if (data.action === 'withdraw') {
      newBalance -= data.amount;
    } else if (data.action === 'update') {
      newBalance = data.amount;
    }
    
    const updated = {
      balance: newBalance,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(updated));
    
    // Record transaction
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    transactions.unshift({
      id: Date.now().toString(),
      type: data.action === 'topup' ? 'TOP_UP' : data.action === 'withdraw' ? 'WITHDRAW' : 'UPDATE',
      amount: data.amount,
      method: data.method || 'n8n webhook',
      notes: data.notes || '',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    });
    
    if (transactions.length > 200) {
      transactions.length = 200;
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    window.dispatchEvent(new CustomEvent('cuanterus:balance-updated', { detail: updated }));
    
    logWebhook('/api/webhook/balance', data);
    
    return {
      success: true,
      message: `Balance ${data.action}: ${data.amount.toLocaleString('id-ID')}`,
      data: updated,
    };
  } catch (error: any) {
    console.error('Error handling balance webhook:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Handle Transaction Webhook
 * From: n8n → Frontend (record transaction)
 */
export function handleTransactionWebhook(webhook: WebhookRequest<TransactionWebhook>) {
  try {
    const { data } = webhook;
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    
    const newTransaction = {
      id: Date.now().toString(),
      type: data.type,
      symbol: data.symbol || '',
      amount: data.amount,
      price: data.price || 0,
      lots: data.lots || 0,
      method: data.method || 'n8n webhook',
      status: data.status,
      timestamp: new Date().toISOString(),
    };
    
    transactions.unshift(newTransaction);
    
    if (transactions.length > 200) {
      transactions.length = 200;
    }
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    window.dispatchEvent(new CustomEvent('cuanterus:transaction', { detail: newTransaction }));
    
    logWebhook('/api/webhook/transaction', data);
    
    return {
      success: true,
      message: 'Transaction recorded',
      data: newTransaction,
    };
  } catch (error: any) {
    console.error('Error handling transaction webhook:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Main webhook router
 */
export async function handleWebhook(endpoint: string, request: WebhookRequest) {
  console.log(`📥 Webhook received: ${endpoint}`, request);
  
  switch (endpoint) {
    case '/api/webhook/analysis':
      return handleAnalysisWebhook(request);
    
    case '/api/webhook/portfolio':
      return handlePortfolioWebhook(request);
    
    case '/api/webhook/balance':
      return handleBalanceWebhook(request);
    
    case '/api/webhook/transaction':
      return handleTransactionWebhook(request);
    
    default:
      return {
        success: false,
        error: `Unknown webhook endpoint: ${endpoint}`,
      };
  }
}

/**
 * Get webhook logs (for debugging)
 */
export function getWebhookLogs(limit: number = 50) {
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEBHOOK_LOG) || '[]');
  return logs.slice(0, limit);
}

/**
 * Clear webhook logs
 */
export function clearWebhookLogs() {
  localStorage.removeItem(STORAGE_KEYS.WEBHOOK_LOG);
}
