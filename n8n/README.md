# n8n Workflows untuk Cuanterus

Folder ini berisi workflow n8n yang siap diimport ke **n8n di Sumopos** (GRATIS!)

## 🎯 Arsitektur Workflow

```
TradingView Alert
    ↓
n8n (Sumopos - FREE)
    ↓
Claude AI Analysis
    ↓
Frontend Webhook + Telegram Notification
```

## 📦 Workflows

### 1. TradingView → Claude AI → Frontend (`1-tradingview-claude-frontend.json`)

**Fungsi:** Analisis otomatis dari TradingView alerts

**Flow:**
1. **Webhook Trigger** - Terima alert dari TradingView
2. **Parse Data** - Extract symbol, price, volume, timeframe
3. **Claude AI Analysis** - Kirim ke Gemini/Claude untuk analisis
4. **Parse AI Response** - Format hasil analisis
5. **Send to Frontend** - Kirim webhook ke frontend (localhost/Vercel)
6. **Send Telegram** - Notifikasi ke Telegram Bot
7. **Response** - Return success ke TradingView

**Environment Variables Required:**
- `FRONTEND_WEBHOOK_URL` - URL frontend (http://localhost:3001 atau https://your-app.vercel.app)
- `TELEGRAM_BOT_TOKEN` - Token dari @BotFather
- `TELEGRAM_CHAT_ID` - Your Telegram chat ID

**Credentials Required:**
- Gemini API Key (untuk Claude AI analysis)

---

### 2. Telegram Bot Commands (`2-telegram-bot-commands.json`)

**Fungsi:** Bot Telegram untuk manage portfolio

**Commands:**
- `/start` - Welcome message
- `/help` - List semua commands
- `/balance` - Cek saldo RDN
- `/portfolio` - Lihat holdings
- `/analyze BBCA` - Analisis saham
- `/topup 1000000` - Top-up saldo

**Flow:**
1. **Telegram Trigger** - Listen ke bot messages
2. **Filter Commands** - Hanya proses commands (/)
3. **Parse Command** - Extract command & arguments
4. **Route Command** - Switch ke handler yang sesuai
5. **Execute** - Get data dari frontend API atau kirim webhook
6. **Send Reply** - Reply ke Telegram dengan hasil

**Environment Variables Required:**
- `FRONTEND_WEBHOOK_URL` - URL frontend API
- `TELEGRAM_BOT_TOKEN` - Token dari @BotFather

---

## 🚀 Setup di Sumopos (n8n GRATIS!)

### Step 1: Sign Up di Sumopos

1. Buka https://sumopos.com (atau platform n8n gratis lainnya)
2. Create account (GRATIS!)
3. Login ke dashboard n8n

### Step 2: Import Workflows

1. Di n8n dashboard, klik **"+"** → **"Import from File"**
2. Upload `1-tradingview-claude-frontend.json`
3. Ulangi untuk `2-telegram-bot-commands.json`

### Step 3: Setup Credentials

#### Gemini API Key:
1. Buka https://makersuite.google.com/app/apikey
2. Create API key (GRATIS 60 req/min!)
3. Di n8n: **Credentials** → **Add** → **Generic Credential Type** → **HTTP Query Auth**
4. Name: `geminiApiKey`
5. Value: [your API key]

#### Telegram Bot:
1. Chat dengan @BotFather di Telegram
2. Kirim `/newbot`
3. Follow instruksi, dapat token
4. Di n8n: **Credentials** → **Add** → **Telegram**
5. Paste token

### Step 4: Set Environment Variables

Di n8n Settings → Environment Variables:

```env
FRONTEND_WEBHOOK_URL=https://your-app.vercel.app
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...
TELEGRAM_CHAT_ID=123456789
```

**Get Telegram Chat ID:**
1. Chat dengan bot Anda
2. Kirim pesan apa saja
3. Buka: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Cari `"chat":{"id": 123456789}`

### Step 5: Activate Workflows

1. Buka workflow yang sudah diimport
2. Klik **"Active"** toggle di kanan atas
3. Test dengan kirim `/start` ke Telegram bot

---

## 📋 TradingView Alert Setup

### Create Alert di TradingView:

1. Buka chart saham (contoh: BBCA)
2. Klik **Alert** (icon bell)
3. Condition: Pilih sesuai strategy (contoh: Price > MA200)
4. Alert actions: **Webhook URL**
5. URL: `https://your-sumopos-n8n-url/webhook/tradingview-alert`
6. Message:

```json
{
  "symbol": "{{ticker}}",
  "price": {{close}},
  "volume": {{volume}},
  "timeframe": "{{interval}}",
  "timestamp": "{{timenow}}"
}
```

7. Save alert

---

## 🧪 Testing Workflows

### Test Workflow 1 (TradingView → Claude AI):

**Manual Test via cURL:**
```bash
curl -X POST https://your-sumopos-n8n-url/webhook/tradingview-alert \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BBCA",
    "price": 9850,
    "volume": 125000000,
    "timeframe": "1D"
  }'
```

**Expected Result:**
- ✅ Analysis muncul di frontend
- ✅ Notifikasi Telegram terkirim
- ✅ Data tersimpan di localStorage

### Test Workflow 2 (Telegram Bot):

1. Buka Telegram, chat dengan bot Anda
2. Kirim: `/start`
3. Expected: Welcome message
4. Kirim: `/balance`
5. Expected: Saldo RDN Anda
6. Kirim: `/analyze BBCA`
7. Expected: Analisis saham BBCA

---

## 🔧 Troubleshooting

### Webhook tidak terima data:

1. **Check webhook URL di TradingView/n8n**
   - Pastikan URL benar dan HTTPS
   - Test dengan cURL manual

2. **Check logs di n8n**
   - Buka workflow → Executions tab
   - Lihat error message

3. **Check environment variables**
   - `FRONTEND_WEBHOOK_URL` benar?
   - Token valid?

### Telegram bot tidak reply:

1. **Check bot token**
   - Token masih valid?
   - Paste ulang di n8n credentials

2. **Check workflow active**
   - Toggle "Active" di workflow

3. **Check chat ID**
   - Chat ID benar?
   - Update di environment variables

### Frontend tidak update:

1. **Check webhook server running**
   - Development: `npm run webhook` (port 3001)
   - Production: Vercel auto-handle

2. **Check CORS**
   - Webhook server allow CORS dari n8n domain

3. **Check localStorage**
   - Open DevTools → Application → Local Storage
   - Data ada tapi UI tidak update?

---

## 💡 Tips & Best Practices

### Performance:

- ✅ Set timeout di HTTP Request nodes (30 detik cukup)
- ✅ Use error handling nodes untuk catch failures
- ✅ Enable retry untuk HTTP requests (max 3x)

### Security:

- ✅ Jangan commit API keys ke Git!
- ✅ Use environment variables untuk secrets
- ✅ Validate input data di webhook

### Monitoring:

- ✅ Check n8n Executions tab regularly
- ✅ Setup Telegram notification untuk errors
- ✅ Monitor webhook logs di frontend

---

## 🆓 Free Tier Limits

### Sumopos n8n (atau alternatif):
- ✅ Unlimited workflows
- ✅ 5000 executions/month (cukup untuk 100+ alerts/hari)
- ✅ 1 concurrent execution

### Gemini API:
- ✅ 60 requests/minute
- ✅ 1500 requests/day
- ✅ FREE tier (cukup untuk 50+ analyses/hari)

### Telegram Bot:
- ✅ Unlimited messages
- ✅ 100% FREE forever

---

## 📞 Support

Kalau ada masalah, check:
1. n8n Execution logs
2. Browser DevTools console
3. Webhook server logs (`npm run webhook`)

Happy automating! 🚀
