/**
 * Data Service - Webhook + localStorage
 * 
 * Architecture: TradingView → n8n → Claude AI → Frontend (via webhook)
 * 
 * Data Flow:
 * 1. n8n sends webhook to /api/webhook/* endpoints
 * 2. Frontend receives webhook and updates localStorage
 * 3. Custom events trigger UI updates
 * 4. No direct database access from frontend
 * 
 * localStorage is used for:
 * - Client-side data persistence
 * - Offline mode support
 * - Fast read operations
 */

const STORAGE_KEYS = {
  HOLDINGS: 'cuanterus_holdings',
  BALANCE: 'cuanterus_balance',
  HISTORY: 'cuanterus_history',
  TRANSACTIONS: 'cuanterus_transactions',
  SETTINGS: 'cuanterus_settings',
  WEBHOOK_LOG: 'cuanterus_webhook_log',
};

// ============================================
// INITIALIZATION
// ============================================

function initData() {
  if (!localStorage.getItem(STORAGE_KEYS.BALANCE)) {
    localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify({ 
      balance: 45230000, 
      lastUpdated: new Date().toISOString() 
    }));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOLDINGS)) {
    localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({}));
  }
}

// Initialize on load
initData();
console.log('📦 Data service initialized with localStorage');

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// WEBHOOK LISTENERS
// ============================================

// Listen for webhook events and update localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('cuanterus:analysis', ((event: CustomEvent) => {
    console.log('🔔 Analysis update received:', event.detail);
    // Data already updated by webhook handler
  }) as EventListener);

  window.addEventListener('cuanterus:holding-added', ((event: CustomEvent) => {
    console.log('🔔 Holding added:', event.detail);
  }) as EventListener);

  window.addEventListener('cuanterus:holding-updated', ((event: CustomEvent) => {
    console.log('🔔 Holding updated:', event.detail);
  }) as EventListener);

  window.addEventListener('cuanterus:holding-deleted', ((event: CustomEvent) => {
    console.log('🔔 Holding deleted:', event.detail);
  }) as EventListener);

  window.addEventListener('cuanterus:balance-updated', ((event: CustomEvent) => {
    console.log('🔔 Balance updated:', event.detail);
  }) as EventListener);

  window.addEventListener('cuanterus:transaction', ((event: CustomEvent) => {
    console.log('🔔 Transaction recorded:', event.detail);
  }) as EventListener);
}

// ============================================
// HOLDINGS API
// ============================================

export const holdingsAPI = {
  /**
   * Get all holdings from localStorage
   */
  async getAll() {
    await delay(200); // Simulate network delay
    
    try {
      const holdings = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDINGS) || '[]');
      
      return {
        success: true,
        data: holdings.map((holding: any) => ({
          ...holding,
          plLabel: holding.plAmount > 0 
            ? `+Rp ${Math.abs(holding.plAmount).toLocaleString('id-ID')}` 
            : `Rp ${holding.plAmount.toLocaleString('id-ID')}`,
          isProfit: holding.plAmount > 0,
        })),
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add new holding
   * In webhook architecture, this creates a local holding
   * Real sync happens via n8n webhook
   */
  async create(holding: {
    symbol: string;
    name: string;
    avgPrice: number;
    currentPrice: number;
    lots: number;
    notes?: string;
  }) {
    await delay(300);
    
    try {
      const holdings = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDINGS) || '[]');
      const id = Date.now().toString();
      const now = new Date().toISOString();
      const shares = holding.lots * 100;
      const totalValue = holding.currentPrice * shares;
      const plAmount = (holding.currentPrice - holding.avgPrice) * shares;
      const plPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

      const newHolding = {
        id,
        symbol: holding.symbol,
        name: holding.name,
        avgPrice: holding.avgPrice,
        currentPrice: holding.currentPrice,
        lots: holding.lots,
        shares,
        totalValue,
        plAmount,
        plPercent,
        notes: holding.notes || '',
        createdAt: now,
        updatedAt: now,
      };

      holdings.push(newHolding);
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));

      // Record transaction
      const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
      transactions.push({
        id: Date.now().toString(),
        type: 'BUY',
        symbol: holding.symbol,
        amount: holding.avgPrice * shares,
        price: holding.avgPrice,
        lots: holding.lots,
        paymentMethod: 'Manual Entry',
        status: 'SUCCESS',
        timestamp: now,
      });
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

      // Dispatch event for UI update
      window.dispatchEvent(new CustomEvent('cuanterus:holding-added', { detail: newHolding }));

      return {
        success: true,
        message: `Successfully added ${holding.symbol} to portfolio`,
        data: newHolding,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update holding
   */
  async update(id: string, updates: { currentPrice?: number; lots?: number; notes?: string }) {
    await delay(300);
    
    try {
      const holdings = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDINGS) || '[]');
      const index = holdings.findIndex((h: any) => h.id === id);

      if (index === -1) {
        return { success: false, error: 'Holding not found' };
      }

      const holding = holdings[index];
      const newPrice = updates.currentPrice ?? holding.currentPrice;
      const newLots = updates.lots ?? holding.lots;
      const newNotes = updates.notes ?? holding.notes;
      
      const shares = newLots * 100;
      const totalValue = newPrice * shares;
      const plAmount = (newPrice - holding.avgPrice) * shares;
      const plPercent = ((newPrice - holding.avgPrice) / holding.avgPrice) * 100;

      holdings[index] = {
        ...holding,
        currentPrice: newPrice,
        lots: newLots,
        shares,
        totalValue,
        plAmount,
        plPercent,
        notes: newNotes,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));

      window.dispatchEvent(new CustomEvent('cuanterus:holding-updated', { detail: holdings[index] }));

      return {
        success: true,
        message: 'Holding updated successfully',
        data: holdings[index],
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete holding
   */
  async delete(id: string) {
    await delay(300);
    
    try {
      const holdings = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLDINGS) || '[]');
      const holding = holdings.find((h: any) => h.id === id);

      if (!holding) {
        return { success: false, error: 'Holding not found' };
      }

      const filtered = holdings.filter((h: any) => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(filtered));

      window.dispatchEvent(new CustomEvent('cuanterus:holding-deleted', { detail: holding }));

      return {
        success: true,
        message: `Successfully removed ${holding.symbol} from portfolio`,
        data: { symbol: holding.symbol, name: holding.name },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// BALANCE API
// ============================================

export const balanceAPI = {
  /**
   * Get current balance
   */
  async get() {
    await delay(200);
    
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.BALANCE) || '{"balance":0}');
      
      return {
        success: true,
        data: {
          balance: data.balance,
          formatted: `Rp ${data.balance.toLocaleString('id-ID')}`,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Top up balance
   */
  async topUp(amount: number, paymentMethod: string, notes?: string) {
    await delay(300);
    
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.BALANCE) || '{"balance":0}');
      const newBalance = data.balance + amount;
      const now = new Date().toISOString();

      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify({ 
        balance: newBalance, 
        lastUpdated: now 
      }));

      // Record transaction
      const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
      transactions.push({
        id: Date.now().toString(),
        type: 'TOP_UP',
        symbol: '',
        amount,
        price: '',
        lots: '',
        paymentMethod,
        status: 'SUCCESS',
        timestamp: now,
      });
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

      window.dispatchEvent(new CustomEvent('cuanterus:balance-updated', { 
        detail: { balance: newBalance, lastUpdated: now } 
      }));

      return {
        success: true,
        message: `Successfully topped up Rp ${amount.toLocaleString('id-ID')}`,
        data: {
          transactionId: Date.now().toString(),
          amount,
          paymentMethod,
          newBalance,
          timestamp: now,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// HISTORY API
// ============================================

export const historyAPI = {
  /**
   * Get analysis history
   */
  async getAll(limit: number = 50, offset: number = 0) {
    await delay(200);
    
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      
      const sliced = history
        .slice(offset, offset + limit)
        .map((item: any) => ({
          ...item,
          date: new Date(item.analyzedAt).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          price: typeof item.price === 'number' 
            ? item.price.toLocaleString('id-ID') 
            : item.price,
          color: item.score >= 70 ? 'primary' : item.score >= 50 ? 'tertiary' : 'error',
        }));

      return {
        success: true,
        count: sliced.length,
        total: history.length,
        limit,
        offset,
        data: sliced,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add analysis to history
   */
  async create(analysis: {
    symbol: string;
    name: string;
    price: number;
    score: number;
    verdict: string;
    status: string;
  }) {
    await delay(300);
    
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      
      // Check if already exists (within last 5 seconds)
      const now = Date.now();
      const recentExists = history.some((item: any) => 
        item.symbol === analysis.symbol && 
        (now - new Date(item.analyzedAt).getTime()) < 5000
      );

      if (recentExists) {
        return {
          success: true,
          message: `Analysis for ${analysis.symbol} already in recent history`,
          data: null,
        };
      }

      const id = Date.now().toString();
      const timestamp = new Date().toISOString();

      const newItem = {
        id,
        symbol: analysis.symbol,
        name: analysis.name,
        price: analysis.price,
        score: analysis.score,
        verdict: analysis.verdict,
        status: analysis.status,
        analyzedAt: timestamp,
      };

      history.unshift(newItem); // Add to beginning
      
      // Keep only last 100 items
      if (history.length > 100) {
        history.length = 100;
      }

      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

      window.dispatchEvent(new CustomEvent('cuanterus:analysis', { detail: newItem }));

      return {
        success: true,
        message: `Analysis for ${analysis.symbol} added to history`,
        data: newItem,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// SETTINGS API
// ============================================

export const settingsAPI = {
  /**
   * Get settings
   */
  async get() {
    await delay(200);
    
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');

      return {
        success: true,
        data: settings,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update settings
   */
  async update(settings: Record<string, any>) {
    await delay(300);
    
    try {
      const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
      const newSettings = { ...currentSettings, ...settings };
      
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));

      return {
        success: true,
        message: 'Settings updated successfully',
        data: newSettings,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset all data
   */
  async reset() {
    await delay(300);
    
    try {
      // Reset all to initial state
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify({ 
        balance: 45230000, 
        lastUpdated: new Date().toISOString() 
      }));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({}));

      return {
        success: true,
        message: 'All data has been reset to default successfully',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// WEBHOOK UTILITIES
// ============================================

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

// ============================================
// EXPORT DEFAULT API
// ============================================

export default {
  holdings: holdingsAPI,
  balance: balanceAPI,
  history: historyAPI,
  settings: settingsAPI,
  utils: {
    getWebhookLogs,
    clearWebhookLogs,
  },
};
