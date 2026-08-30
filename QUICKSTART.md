# ⚡ Quick Start Guide - Cuanterus

Get up and running in **5 minutes**!

---

## 🎯 What You'll Get

- ✅ Trading portfolio app running locally
- ✅ Stock analysis dashboard
- ✅ Portfolio tracking
- ✅ localStorage data storage
- ✅ Ready to connect to n8n & Telegram

---

## 📋 Prerequisites

- **Node.js 18+** (check: `node --version`)
- **Bun** or **npm** (check: `bun --version` or `npm --version`)
- **Git** (check: `git --version`)

Don't have these? Install:
- Node.js: https://nodejs.org
- Bun: https://bun.sh
- Git: https://git-scm.com

---

## 🚀 Step 1: Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/your-username/cuanterus.git
cd cuanterus

# Install dependencies
bun install
# atau: npm install
```

**What's installed:**
- React 19, TypeScript, Vite
- TailwindCSS, Lucide icons
- Vercel serverless packages

---

## ⚙️ Step 2: Setup Environment (1 min)

```bash
# Copy example env file
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Webhook server URL (default: localhost)
VITE_WEBHOOK_SERVER_URL=http://localhost:3001

# Gemini API key (optional - untuk AI analysis)
VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Notes:**
- Webhook server runs on port 3001 (auto-started)
- Gemini API key optional (uses mock analysis jika kosong)
- Get free Gemini key: https://makersuite.google.com/app/apikey

---

## 🎮 Step 3: Run Application (30 seconds)

### Option A: Run Everything (Recommended)

```bash
npm run dev:all
```

This starts:
- Frontend (port 3000)
- Webhook server (port 3001)

### Option B: Run Separately

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Webhook server
npm run webhook
```

---

## ✅ Step 4: Test App (1 min)

Open browser: **http://localhost:3000**

You should see:
- ✅ Dashboard with stock analysis
- ✅ Portfolio view
- ✅ History view
- ✅ Top bar with search

**Try these:**
1. Search for stock: BBCA, BBRI, TLKM
2. Click "Add to Portfolio"
3. Top-up balance
4. Check history

**Data persists** in localStorage (tidak hilang saat refresh!)

---

## 🎉 You're Done!

App is running locally with localStorage. No database needed!

---

## 🚀 Next Steps (Optional)

### 1. Setup Gemini AI (5 min)

Get real AI analysis instead of mock data:

1. Get API key: https://makersuite.google.com/app/apikey
2. Copy key
3. Update `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```
4. Restart app: `npm run dev:all`

**Free Tier:**
- 60 requests/minute
- 1500 requests/day
- More than enough!

### 2. Setup n8n Automation (15 min)

Connect TradingView alerts & Telegram bot:

1. Sign up: https://sumopos.com (FREE!)
2. Import workflows from `n8n/` folder
3. Configure environment variables
4. Activate workflows

**Guide:** [n8n/README.md](./n8n/README.md)

### 3. Setup Telegram Bot (10 min)

Get mobile notifications & commands:

1. Create bot via @BotFather
2. Get bot token
3. Configure in n8n
4. Test commands: `/balance`, `/portfolio`

**Guide:** [TELEGRAM_BOT.md](./TELEGRAM_BOT.md)

### 4. Deploy to Production (5 min)

Deploy frontend to Vercel for free:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

Or use GitHub integration (1-click deploy).

**Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📁 Project Structure

```
cuanterus-bosku/
│
├── api/                    # Webhook endpoints
│   ├── analysis.ts        # Receive analysis from n8n
│   ├── balance.ts         # Balance updates
│   └── server.ts          # Dev webhook server
│
├── n8n/                   # n8n workflow files
│   ├── 1-tradingview-claude-frontend.json
│   └── 2-telegram-bot-commands.json
│
├── src/
│   ├── components/        # React components
│   ├── services/
│   │   ├── data.ts       # localStorage CRUD
│   │   └── webhook-client.ts  # Webhook listeners
│   └── App.tsx           # Main app
│
├── .env.local            # Your environment variables
└── package.json          # Dependencies
```

---

## 🛠️ Common Commands

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

# Type check
npm run lint
```

---

## 🐛 Troubleshooting

### Port already in use?

**Frontend (3000):**
```bash
# Change port in package.json
"dev": "vite --port=3005 --host=0.0.0.0"
```

**Webhook server (3001):**
```bash
# Set environment variable
export WEBHOOK_PORT=3002
npm run webhook
```

### App shows blank page?

1. **Check browser console** (F12)
2. Look for errors
3. Common issues:
   - JavaScript disabled
   - Ad blocker blocking scripts
   - Browser too old (use Chrome/Edge)

### Data not saving?

1. **Check localStorage enabled**
   - Open DevTools → Application → Local Storage
   - Should see items like `cuanterus_holdings`

2. **Private/Incognito mode?**
   - localStorage might be disabled
   - Try normal browser window

### Webhook server not receiving data?

1. **Check server running:** http://localhost:3001/health
2. **Check CORS:** n8n domain allowed?
3. **Check logs:** Terminal should show requests

---

## 📖 Learn More

- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **n8n Setup:** [n8n/README.md](./n8n/README.md)
- **Telegram Bot:** [TELEGRAM_BOT.md](./TELEGRAM_BOT.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💬 Need Help?

- **GitHub Issues:** https://github.com/your-username/cuanterus/issues
- **Documentation:** Check MD files in repo
- **n8n Community:** https://community.n8n.io

---

## 🎯 Quick Tips

✅ **Development:**
- Use `npm run dev:all` untuk run semua sekaligus
- Hot reload enabled (auto-refresh saat edit code)
- Check console untuk debug

✅ **Data Management:**
- Data tersimpan di localStorage browser
- Tidak hilang saat refresh
- Reset via Settings → Reset Data

✅ **Testing:**
- Test webhook: `curl http://localhost:3001/health`
- Test analysis: Search stock di UI
- Test portfolio: Add holdings manually

---

**Happy Trading! 📈🚀**

[⬅️ Back to README](./README.md)
