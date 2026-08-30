/**
 * Simple HTTP Server for Webhook Endpoints
 * This runs on localhost during development
 * For production, use Vercel/Netlify serverless functions
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handleWebhook } from './webhook';

const PORT = process.env.WEBHOOK_PORT || 3001;

/**
 * Parse JSON body from request
 */
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJSON(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow CORS
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

/**
 * Request handler
 */
async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const { method, url } = req;
  
  console.log(`${method} ${url}`);
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    sendJSON(res, 200, { ok: true });
    return;
  }
  
  // Health check
  if (url === '/health' || url === '/') {
    sendJSON(res, 200, {
      status: 'ok',
      service: 'cuanterus-webhook-server',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  // Webhook endpoints
  if (method === 'POST' && url?.startsWith('/api/webhook/')) {
    try {
      const body = await parseBody(req);
      const result = await handleWebhook(url, body);
      
      sendJSON(res, result.success ? 200 : 400, result);
    } catch (error: any) {
      console.error('Error handling webhook:', error);
      sendJSON(res, 500, {
        success: false,
        error: error.message,
      });
    }
    return;
  }
  
  // Not found
  sendJSON(res, 404, {
    success: false,
    error: 'Endpoint not found',
  });
}

/**
 * Start server
 */
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   🚀 Cuanterus Webhook Server                     ║
║                                                    ║
║   Status: ✅ Running                              ║
║   Port: ${PORT}                                      ║
║   URL: http://localhost:${PORT}                      ║
║                                                    ║
║   Endpoints:                                       ║
║   - POST /api/webhook/analysis                     ║
║   - POST /api/webhook/portfolio                    ║
║   - POST /api/webhook/balance                      ║
║   - POST /api/webhook/transaction                  ║
║                                                    ║
║   Health Check: http://localhost:${PORT}/health     ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
