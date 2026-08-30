# 🏗️ Cuanterus Architecture

**Version:** 2.1 - Webhook-Based Serverless  
**Last Updated:** 27 Agustus 2026

## 🎯 Vision Bang Ilham

> "Ini cuma kayak kita input data via bot telegram, masukin ke sheet. Tradingview connect ke claude, trus connect ke web pake n8n. Webhook itu gantiin sheet."

Arsitektur **super simple**, **zero cost**, **no database server**.

---

## 📊 Architecture Overview

```
┌─────────────────┐
│  TradingView    │
│   (Alerts)      │
└────────┬────────┘
         │ Webhook
         ↓
┌─────────────────────────────────────────┐
│         n8n (Sumopos - FREE)            │
│  ┌──────────────────────────────────┐   │
│  │  1. Receive TradingView Alert   │   │
│  │  2. Send to Claude AI / Gemini  │   │
│  │  3. Parse AI Response            │   │
│  │  4. Send Webhook to Frontend     │   │
│  │  5. Send Notification to Telegram│   │
│  └──────────────────────────────────┘   │
└────────┬────────────────────┬───────────┘
         │                    │
         │ Webhook            │ Telegram
         ↓                    ↓
┌─────────────────┐   ┌──────────────┐
│   Frontend      │   │  Telegram    │
│   React App     │   │     Bot      │
│ (Vercel/Local)  │   │ (Commands)   │
└────────┬────────┘   └──────────────┘
         │
         │ localStorage
         ↓
┌─────────────────┐
│  Browser        │
│  localStorage   │
│  (Data Storage) │
└─────────────────┘
```

---

## 🔥 Key Principles

### 1. **No Traditional Database**
- ❌ NO PostgreSQL
- ❌ NO MySQL
- ❌ NO Supabase
- ✅ localStorage di browser
- ✅ Webhook untuk sync data

### 2. **n8n as Central Hub**
- ✅ n8n handle semua logic
- ✅ n8n terima dari TradingView
- ✅ n8n kirim ke Claude AI
- ✅ n8n push ke Frontend
- ✅ n8n notif via Telegram

### 3. **Frontend = Display Only**
- ✅ Terima webhook dari n8n
- ✅ Display data di UI
- ✅ localStorage untuk persistence
- ❌ NO direct database access

### 4. **100% Free Tier**
- ✅ n8n di Sumopos: FREE
- ✅ Gemini AI: FREE (60 req/min)
- ✅ Telegram Bot: FREE
- ✅ Vercel Hosting: FREE
- ✅ Total Cost: Rp 0/bulan

---

## 🔄 Data Flow

### Flow 1: TradingView Alert → Analysis

```
1. TradingView chart condition met (e.g., Price > MA200)
   ↓
2. TradingView sends webhook to n8n
   {
     "symbol": "BBCA",
     "price": 9850,
     "volume": 125000000
   }
   ↓
3. n8n receives webhook
   ↓
4. n8n sends to Gemini AI for analysis
   "Analisis saham BBCA harga 9850..."
   ↓
5. Gemini AI returns analysis
   {
     "verdict": "BULLISH",
     "score": 82,
     "insight": "Momentum kuat...",
     ...
   }
   ↓
6. n8n sends webhook to Frontend
   POST /api/webhook/analysis
   ↓
7. Frontend receives webhook
   - Updates localStorage
   - Triggers UI update
   - Shows notification
   ↓
8. n8n sends Telegram notification
   "📊 Analisis Baru: BBCA - Score 82/100"
```

### Flow 2: Telegram Bot Command

```
1. User sends Telegram command
   "/balance"
   ↓
2. n8n receives command via Telegram trigger
   ↓
3. n8n calls Frontend API
   GET /api/balance
   ↓
4. Frontend reads from localStorage
   { balance: 45230000 }
   ↓
5. n8n formats response
   "💰 Saldo: Rp 45,230,000"
   ↓
6. n8n sends reply to Telegram
```

### Flow 3: Manual Action (Top-up)

```
1. User clicks "Top Up" di Frontend
   ↓
2. Frontend updates localStorage directly
   balance += amount
   ↓
3. Frontend dispatches custom event
   window.dispatchEvent('cuanterus:balance-updated')
   ↓
4. UI auto-refreshes
```

---

## 🗂️ Project Structure

```
cuanterus-bosku/
│
├── api/                          # Webhook endpoints (Vercel Serverless)
│   ├── analysis.ts              # POST /api/analysis
│   ├── balance.ts               # POST /api/balance
│   ├── portfolio.ts             # POST /api/portfolio
│   ├── server.ts                # Dev webhook server (localhost:3001)
│   └── webhook.ts               # Webhook handlers & localStorage logic
│
├── n8n/                         # n8n Workflows
│   ├── 1-tradingview-claude-frontend.json
│   ├── 2-telegram-bot-commands.json
│   └── README.md                # Setup guide for Sumopos
│
├── src/
│   ├── components/              # React components
│   ├── services/
│   │   ├── data.ts             # localStorage CRUD (ex-sheets.ts)
│   │   ├── webhook-client.ts   # Webhook event listeners
│   │   └── gemini.ts           # Gemini AI service (optional)
│   └── App.tsx                 # Main app
│
├── .env.local                   # Environment variables
├── .env.example                 # Example env file
├── vercel.json                  # Vercel config for serverless functions
├── package.json                 # Dependencies & scripts
└── README.md                    # Main documentation
```

---

## 🔌 API Endpoints

### Webhook Endpoints (Receive from n8n)

#### POST `/api/webhook/analysis`
Receive stock analysis from n8n.

**Request:**
```json
{
  "source": "n8n",
  "timestamp": "2026-08-27T10:00:00Z",
  "data": {
    "symbol": "BBCA",
    "name": "PT Bank Central Asia Tbk.",
    "price": 9850,
    "score": 82,
    "verdict": "BULLISH",
    "fundamental_score": 90,
    "technical_score": 85,
    "momentum_score": 80,
    "sentiment_score": 85,
    "risk_score": 30,
    "insight": "Momentum kuat, fundamental solid...",
    "recommendation": "BUY - Target 10,500",
    "analyzed_at": "2026-08-27T10:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis recorded successfully",
  "data": { ... }
}
```

#### POST `/api/webhook/balance`
Update balance from n8n (e.g., from Telegram bot top-up).

**Request:**
```json
{
  "source": "telegram",
  "timestamp": "2026-08-27T10:00:00Z",
  "data": {
    "action": "topup",
    "amount": 5000000,
    "method": "Telegram Bot"
  }
}
```

#### POST `/api/webhook/portfolio`
Add/update/delete holdings.

**Request:**
```json
{
  "source": "n8n",
  "timestamp": "2026-08-27T10:00:00Z",
  "data": {
    "action": "add",
    "holding": {
      "symbol": "BBCA",
      "name": "Bank Central Asia",
      "avgPrice": 9500,
      "currentPrice": 9850,
      "lots": 10
    }
  }
}
```

### Frontend API (Called by n8n)

#### GET `/api/balance`
Get current balance (for Telegram bot).

**Response:**
```json
{
  "success": true,
  "balance": 45230000
}
```

#### GET `/api/holdings`
Get all portfolio holdings (for Telegram bot).

**Response:**
```json
{
  "success": true,
  "holdings": [
    {
      "symbol": "BBCA",
      "avgPrice": 9500,
      "currentPrice": 9850,
      "lots": 10,
      "plAmount": 35000,
      "plPercent": 3.68
    }
  ]
}
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **localStorage** - Data persistence

### Backend / Automation
- **n8n** (Sumopos) - Workflow automation
- **Vercel Serverless Functions** - Webhook endpoints
- **Node.js** - Runtime

### AI & Services
- **Gemini AI / Claude** - Stock analysis
- **Telegram Bot API** - Notifications & commands
- **TradingView** - Alert triggers

---

## 🚀 Deployment

### Development

```bash
# Terminal 1: Frontend
npm run dev
# → http://localhost:3000

# Terminal 2: Webhook server
npm run webhook
# → http://localhost:3001

# Or run both:
npm run dev:all
```

### Production

**Frontend (Vercel):**
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# → https://your-app.vercel.app
```

**n8n (Sumopos):**
1. Sign up at https://sumopos.com
2. Import workflows from `n8n/` folder
3. Set environment variables
4. Activate workflows

**Environment Variables (Vercel):**
```env
VITE_WEBHOOK_SERVER_URL=https://your-app.vercel.app
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Environment Variables (n8n):**
```env
FRONTEND_WEBHOOK_URL=https://your-app.vercel.app
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## 🔐 Security

### ✅ What's Secure:
- No database credentials exposed
- API keys in environment variables only
- Telegram bot token server-side (n8n)
- CORS enabled only for n8n domain
- localStorage = client-side only (no sensitive data)

### ⚠️ What to Watch:
- Don't commit `.env.local` to Git
- Don't expose Gemini API key in frontend code
- Validate webhook payloads in production
- Add authentication for production webhooks

---

## 📈 Scalability

### Current Architecture (Prototype):
- ✅ Single user: Perfect
- ✅ ~100 analyses/day: No problem
- ✅ Telegram bot: Instant replies
- ⚠️ Multiple users: Need to add user auth

### To Scale (Future):
1. Add user authentication (Supabase Auth)
2. Move from localStorage to Supabase database
3. Add user_id to all webhook payloads
4. Scale n8n executions (paid tier if needed)

**But for prototype:** Current architecture PERFECT! ✅

---

## 🆓 Cost Breakdown

| Service | Plan | Limit | Cost |
|---------|------|-------|------|
| n8n (Sumopos) | Free | 5000 exec/month | **Rp 0** |
| Gemini AI | Free | 60 req/min | **Rp 0** |
| Telegram Bot | Free | Unlimited | **Rp 0** |
| Vercel Hosting | Hobby | 100GB bandwidth | **Rp 0** |
| TradingView | Free | 1 alert | **Rp 0** |
| **TOTAL** | | | **Rp 0/bulan** 🎉 |

---

## 🎓 Learning Resources

- **n8n Docs:** https://docs.n8n.io
- **Gemini AI:** https://ai.google.dev/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Vercel Docs:** https://vercel.com/docs
- **TradingView Alerts:** https://www.tradingview.com/support/solutions/43000529348

---

## 🤝 Contributing

Arsitektur ini sesuai vision Bang Ilham:
- Simple
- Free
- No database server
- Webhook-based
- n8n central hub

Kalau mau improve, fokus ke:
1. Better error handling di n8n
2. More Telegram bot commands
3. UI/UX improvements
4. Real-time stock price API

---

**Status:** ✅ Production Ready (Prototype)  
**Architecture:** Webhook-Based Serverless  
**Database:** localStorage (Browser)  
**Cost:** Rp 0/bulan
