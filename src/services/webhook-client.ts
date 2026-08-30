/**
 * Webhook Client
 * Listens to webhook events from n8n and updates UI
 */

import api from './data';

const WEBHOOK_SERVER_URL = import.meta.env.VITE_WEBHOOK_SERVER_URL || 'http://localhost:3001';

/**
 * Setup webhook event listeners
 * These listeners react to custom events dispatched by webhook handlers
 */
export function setupWebhookListeners() {
  // Analysis updates from TradingView → n8n → Claude AI
  window.addEventListener('cuanterus:analysis', ((event: CustomEvent) => {
    console.log('📊 New analysis received:', event.detail);
    
    // Show notification
    showNotification('New Analysis', `${event.detail.symbol} - Score: ${event.detail.score}/100`);
    
    // Refresh UI if needed
    const refreshEvent = new CustomEvent('cuanterus:refresh-history');
    window.dispatchEvent(refreshEvent);
  }) as EventListener);

  // Holding updates
  window.addEventListener('cuanterus:holding-added', ((event: CustomEvent) => {
    console.log('➕ Holding added:', event.detail);
    showNotification('Portfolio Updated', `${event.detail.symbol} added to portfolio`);
    
    const refreshEvent = new CustomEvent('cuanterus:refresh-portfolio');
    window.dispatchEvent(refreshEvent);
  }) as EventListener);

  window.addEventListener('cuanterus:holding-updated', ((event: CustomEvent) => {
    console.log('✏️ Holding updated:', event.detail);
    
    const refreshEvent = new CustomEvent('cuanterus:refresh-portfolio');
    window.dispatchEvent(refreshEvent);
  }) as EventListener);

  window.addEventListener('cuanterus:holding-deleted', ((event: CustomEvent) => {
    console.log('🗑️ Holding deleted:', event.detail);
    showNotification('Portfolio Updated', `${event.detail.symbol} removed from portfolio`);
    
    const refreshEvent = new CustomEvent('cuanterus:refresh-portfolio');
    window.dispatchEvent(refreshEvent);
  }) as EventListener);

  // Balance updates
  window.addEventListener('cuanterus:balance-updated', ((event: CustomEvent) => {
    console.log('💰 Balance updated:', event.detail);
    
    const refreshEvent = new CustomEvent('cuanterus:refresh-balance');
    window.dispatchEvent(refreshEvent);
  }) as EventListener);

  // Transaction records
  window.addEventListener('cuanterus:transaction', ((event: CustomEvent) => {
    console.log('💸 Transaction recorded:', event.detail);
  }) as EventListener);

  console.log('✅ Webhook listeners initialized');
}

/**
 * Show browser notification
 */
function showNotification(title: string, message: string) {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    return;
  }

  // Request permission if needed
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      }
    });
  }
}

/**
 * Test webhook connection
 */
export async function testWebhookConnection() {
  try {
    const response = await fetch(`${WEBHOOK_SERVER_URL}/health`);
    const data = await response.json();
    
    console.log('✅ Webhook server connected:', data);
    return { connected: true, data };
  } catch (error) {
    console.warn('⚠️ Webhook server not reachable. Running in offline mode.');
    return { connected: false, error };
  }
}

/**
 * Simulate webhook (for testing without n8n)
 */
export async function simulateWebhook(type: 'analysis' | 'portfolio' | 'balance', data: any) {
  const endpoint = `/api/webhook/${type}`;
  
  try {
    const response = await fetch(`${WEBHOOK_SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'manual',
        timestamp: new Date().toISOString(),
        data,
      }),
    });

    const result = await response.json();
    console.log(`✅ Simulated webhook ${type}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to simulate webhook ${type}:`, error);
    return { success: false, error };
  }
}

/**
 * Get webhook logs for debugging
 */
export function getWebhookLogs() {
  return api.utils.getWebhookLogs(50);
}

/**
 * Clear webhook logs
 */
export function clearWebhookLogs() {
  return api.utils.clearWebhookLogs();
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  setupWebhookListeners();
  testWebhookConnection();
}

export default {
  setupWebhookListeners,
  testWebhookConnection,
  simulateWebhook,
  getWebhookLogs,
  clearWebhookLogs,
};
