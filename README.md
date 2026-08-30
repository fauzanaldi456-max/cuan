# Cuanterus - AI Trading Portfolio App

<div align="center">

**Sistem trading portfolio dengan AI analysis & automation**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)](https://n8n.io/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?logo=telegram)](https://core.telegram.org/bots)
[![Free](https://img.shields.io/badge/Cost-Rp%200%2Fbulan-brightgreen)](https://github.com)

</div>

---

## 🎯 Vision

> **"Sesimple screenshot TradingView, kirim ke AI Claude, masukin ke web pake n8n. Webhook gantiin sheet."**  
> — Bang Ilham

Aplikasi trading portfolio **super simple**, **zero cost**, **no database server**.

---

## ✨ Features

### 📊 **AI Stock Analysis**
- TradingView alerts → n8n → Claude AI/Gemini
- Automatic analysis dengan "Jamet style" 
- Score: Fundamental, Technical, Momentum, Sentiment, Risk
- Verdict: BULLISH, BEARISH, TO THE MOON, BERDARAH, SIDEWAYS

### 💼 **Portfolio Management**
- Track holdings dengan real-time P/L
- Add, edit, delete positions
- Portfolio summary & analytics
- Data tersimpan di browser (localStorage)

### 🤖 **Telegram Bot**
- `/balance` - Cek saldo RDN
- `/portfolio` - Lihat holdings
- `/analyze BBCA` - Analisis saham
- `/topup 5000000` - Top-up saldo
- Real-time notifications

### 📈 **Dashboard**
- Lihat analisis saham lengkap
- History tracking
- Search stocks
- Responsive design (mobile & desktop)

---

## 🏗️ Architecture

```
TradingView Alert
    ↓ webhook
n8n (Sumopos - FREE)
    ├─→ Claude AI (Gemini)
    ├─→ Frontend (webhook)
    └─→ Telegram Bot
        ↓
Frontend React App
    ↓ localStorage
Browser Storage (No Database!)
```

**Key Points:**
- ✅ No traditional database (PostgreSQL, MySQL, etc.)
- ✅ localStorage di browser untuk data
- ✅ n8n sebagai central hub
- ✅ Webhook untuk sync data
- ✅ 100% free tier services

**Detail:** Lihat [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🚀 Quick Start (5 Menit!)

### Prerequisites
- Node.js 18+ & Bun/npm
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/cuanterus.git
cd cuanterus
bun install  # atau npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_WEBHOOK_SERVER_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_api_key  # (optional)
```

### 3. Run Application

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Webhook server
npm run webhook

# Atau run sekaligus:
npm run dev:all
```

Open: http://localhost:3000

**That's it!** 🎉 Aplikasi sudah jalan dengan localStorage.

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & data flow |
| [n8n/README.md](./n8n/README.md) | n8n workflow setup (Sumopos) |
| [TELEGRAM_BOT.md](./TELEGRAM_BOT.md) | Telegram bot configuration |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to Vercel |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## 🤖 Setup n8n + Telegram Bot

### n8n (Automation Hub)

1. **Sign up di Sumopos** (FREE!)
   - https://sumopos.com

2. **Import workflows**
   - `n8n/1-tradingview-claude-frontend.json`
   - `n8n/2-telegram-bot-commands.json`

3. **Set environment variables**
   ```env
   FRONTEND_WEBHOOK_URL=https://your-app.vercel.app
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```

4. **Activate workflows**

**Detail:** Lihat [n8n/README.md](./n8n/README.md)

### Telegram Bot

1. **Create bot via @BotFather**
   ```
   /newbot
   [follow instructions]
   ```

2. **Get chat ID**
   - Chat dengan bot Anda
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Copy chat ID

3. **Configure di n8n**
   - Paste token & chat ID

**Detail:** Lihat [TELEGRAM_BOT.md](./TELEGRAM_BOT.md)

---

## 🎨 Screenshots

### Dashboard
<img src="https://via.placeholder.com/800x450?text=Dashboard+View" alt="Dashboard" width="600">

### Portfolio
<img src="https://via.placeholder.com/800x450?text=Portfolio+View" alt="Portfolio" width="600">

### Telegram Bot
<img src="https://via.placeholder.com/400x600?text=Telegram+Bot+Commands" alt="Telegram" width="300">

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS 4** - Styling
- **Lucide React** - Icons

### Automation & Backend
- **n8n** (Sumopos) - Workflow automation
- **Vercel Serverless** - Webhook endpoints
- **Gemini AI / Claude** - Stock analysis
- **Telegram Bot API** - Bot interface

### Data Storage
- **localStorage** - Browser storage (no database server!)

---

## 📦 Project Structure

```
cuanterus-bosku/
├── api/                    # Webhook endpoints (Vercel Serverless)
│   ├── analysis.ts
│   ├── balance.ts
│   ├── portfolio.ts
│   ├── server.ts          # Dev webhook server
│   └── webhook.ts         # Webhook handlers
│
├── n8n/                   # n8n Workflows
│   ├── 1-tradingview-claude-frontend.json
│   ├── 2-telegram-bot-commands.json
│   └── README.md
│
├── src/
│   ├── components/        # React components
│   ├── services/
│   │   ├── data.ts       # localStorage CRUD
│   │   ├── webhook-client.ts
│   │   └── gemini.ts     # AI service
│   └── App.tsx
│
├── .env.local            # Environment variables
├── vercel.json           # Vercel config
└── package.json
```

---

## 🚢 Deployment

### Deploy to Vercel (1-Click!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cuanterus)

**Manual:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

**Detail:** Lihat [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💰 Cost Breakdown

| Service | Limit | Cost |
|---------|-------|------|
| **n8n** (Sumopos) | 5000 exec/month | **Rp 0** |
| **Gemini AI** | 60 req/min, 1500/day | **Rp 0** |
| **Telegram Bot** | Unlimited | **Rp 0** |
| **Vercel** | 100GB bandwidth | **Rp 0** |
| **TOTAL** | | **Rp 0/bulan** 🎉 |

Semua services pakai **FREE TIER**!

---

## 🎓 How It Works

### 1. TradingView Alert Triggered
```json
{
  "symbol": "BBCA",
  "price": 9850,
  "volume": 125000000
}
```

### 2. n8n Receives & Processes
- Parse TradingView data
- Send to Gemini AI for analysis
- Parse AI response

### 3. n8n Sends to Frontend
```http
POST /api/webhook/analysis
{
  "symbol": "BBCA",
  "score": 82,
  "verdict": "BULLISH",
  "insight": "Momentum kuat..."
}
```

### 4. Frontend Updates UI
- Receive webhook
- Update localStorage
- Dispatch custom event → UI refresh
- Show notification

### 5. Telegram Notification
```
📊 Analisis Baru: BBCA
💰 Score: 82/100
🎯 Verdict: BULLISH
💡 Momentum kuat, fundamental solid!
```

---

## 🔧 Development

### Commands

```bash
# Development (frontend only)
npm run dev

# Development (frontend + webhook server)
npm run dev:all

# Webhook server only
npm run webhook

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

### Environment Variables

**Development (`.env.local`):**
```env
VITE_WEBHOOK_SERVER_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Production (Vercel):**
```env
VITE_WEBHOOK_SERVER_URL=https://your-app.vercel.app
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## 🐛 Troubleshooting

### Webhook tidak terima data?

**Check:**
1. Webhook server running? (`npm run webhook`)
2. URL di n8n benar?
3. CORS enabled?
4. Check browser console & network tab

### Telegram bot tidak reply?

**Check:**
1. Bot token valid?
2. n8n workflow active?
3. Chat ID benar?
4. Check n8n execution logs

### UI tidak update setelah webhook?

**Check:**
1. DevTools → Application → Local Storage
2. Data ada tapi UI tidak refresh?
3. Check custom events di console
4. Reload browser

**More:** Lihat [n8n/README.md](./n8n/README.md#troubleshooting)

---

## 🤝 Contributing

Contributions welcome! Please follow:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

---

## 🙏 Acknowledgments

- **Bang Ilham** - Vision & architecture guidance
- **n8n** - Amazing workflow automation
- **Gemini AI** - Free AI analysis API
- **Telegram** - Free bot platform
- **Vercel** - Free hosting

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/cuanterus/issues)
- **Docs:** [Architecture](./ARCHITECTURE.md) | [n8n Setup](./n8n/README.md)
- **Telegram:** @your_telegram (optional)

---

<div align="center">

**Made with ❤️ for Indonesian Traders**

**Zero Cost • Zero Database • Maximum Automation**

[⭐ Star this repo](https://github.com/your-username/cuanterus) if you find it useful!

</div>
