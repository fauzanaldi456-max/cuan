# 🤖 Telegram Bot Setup Guide

Complete guide to setup Telegram Bot for Cuanterus trading portfolio.

## 📋 Overview

Telegram Bot allows you to:
- 💰 Check balance via `/balance`
- 📊 View portfolio via `/portfolio`
- 📈 Analyze stocks via `/analyze BBCA`
- 💸 Top-up balance via `/topup 1000000`
- 📬 Receive automated notifications
- 🚀 Quick actions from anywhere

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Bot with BotFather

1. Open Telegram and search for **@BotFather**
2. Start chat and send: `/newbot`
3. Choose a name: `Cuanterus Trading Bot`
4. Choose a username: `cuanterus_yourname_bot` (must end with `_bot`)
5. **Save the token** you receive (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

Example conversation:
```
You: /newbot
BotFather: Alright, a new bot. How are we going to call it?

You: Cuanterus Trading Bot
BotFather: Good. Now let's choose a username for your bot.

You: cuanterus_aldi_bot
BotFather: Done! Congratulations on your new bot. 
You will find it at t.me/cuanterus_aldi_bot. 
You can now add a description...

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz

For a description of the Bot API, see this page: 
https://core.telegram.org/bots/api
```

### Step 2: Get Your Chat ID

1. Start your bot: Click the link from BotFather or search for your bot
2. Send: `/start`
3. Go to: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   (Replace `<YOUR_TOKEN>` with your actual token)
4. Look for `"chat":{"id":123456789}` - **this is your Chat ID**
5. Save both Token and Chat ID

Example response:
```json
{
  "ok": true,
  "result": [{
    "update_id": 123,
    "message": {
      "message_id": 1,
      "from": {"id": 987654321, "first_name": "Aldi"},
      "chat": {"id": 987654321, "type": "private"},
      "text": "/start"
    }
  }]
}
```

Your Chat ID is: `987654321`

### Step 3: Configure n8n

1. Open n8n
2. Go to **Credentials** → **Add Credential**
3. Select **Telegram API**
4. Paste your **Bot Token**
5. Save

---

## 🎯 Available Commands

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Initialize bot | `/start` |
| `/help` | Show all commands | `/help` |
| `/balance` | Check RDN balance | `/balance` |
| `/portfolio` | View holdings | `/portfolio` |
| `/analyze SYMBOL` | Analyze stock | `/analyze BBCA` |
| `/topup AMOUNT` | Top-up balance | `/topup 1000000` |
| `/history` | Recent analysis | `/history` |
| `/price SYMBOL` | Get current price | `/price BBRI` |

### Advanced Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/alert SYMBOL PRICE` | Set price alert | `/alert BBCA 10500` |
| `/buy SYMBOL LOTS` | Quick buy | `/buy BBCA 5` |
| `/sell SYMBOL` | Sell holding | `/sell BBCA` |
| `/report` | Daily summary | `/report` |

---

## 📝 Command Examples

### 1. Check Balance
```
You: /balance

Bot: 💰 Saldo RDN

Balance: Rp 45.230.000

Updated: 28 Aug 2024, 10:30
```

### 2. View Portfolio
```
You: /portfolio

Bot: 📊 Portfolio Holdings

1. BBCA (5 lot)
   Avg: Rp 9.850
   Now: Rp 10.200
   P/L: 📈 +3.55%

2. BBRI (10 lot)
   Avg: Rp 4.825
   Now: Rp 5.100
   P/L: 📈 +5.70%

3. TLKM (8 lot)
   Avg: Rp 3.890
   Now: Rp 3.950
   P/L: 📈 +1.54%

━━━━━━━━━━━━━━━━
Total Value: Rp 15.420.000
Total P/L: Rp +950.000

Updated: 28 Aug 2024, 10:31
```

### 3. Analyze Stock
```
You: /analyze BBCA

Bot: 🔍 Analyzing BBCA...

Bot: 📊 Analysis: BBCA

Price: Rp 10,200
Score: 82/100
Verdict: BULLISH

AI Analysis:
Bank Central Asia shows strong fundamentals with excellent P/E ratio of 24.5x. Recent quarterly results exceeded expectations with 15% YoY growth. Technical indicators show upward momentum with price above MA50 and MA200. Recommendation: HOLD/BUY for medium-term.

Key Metrics:
• P/E: 24.5x
• ROE: 18.2%
• Dividend Yield: 2.8%
• Volume: Above average

✅ Saved to history
```

### 4. Top-Up Balance
```
You: /topup 5000000

Bot: 💸 Top-Up Request

Amount: Rp 5.000.000
Current Balance: Rp 45.230.000
New Balance: Rp 50.230.000

Confirm? Reply with:
• /confirm to proceed
• /cancel to abort

Bot (after /confirm): ✅ Top-Up Berhasil!

Dana Rp 5.000.000 telah ditambahkan ke RDN.
Saldo baru: Rp 50.230.000

Transaction ID: TXN-1724832600
Time: 28 Aug 2024, 10:45
```

### 5. Set Price Alert
```
You: /alert BBCA 10500

Bot: 🔔 Price Alert Set

Stock: BBCA
Current Price: Rp 10.200
Alert Price: Rp 10.500
Condition: ABOVE

You will be notified when BBCA reaches Rp 10.500

Alert ID: ALERT-1724832700
```

---

## 🔔 Automated Notifications

### Price Alerts
```
Bot: 🚨 Price Alert Triggered!

BBCA reached Rp 10.550
Target was Rp 10.500

Current P/L: +7.1%
Recommendation: Consider taking profit

[View Details] [Sell Now]
```

### Daily Report
```
Bot: 📊 Daily Portfolio Report
28 Aug 2024

💰 Balance: Rp 50.230.000

📈 Portfolio:
• 3 holdings
• Total Value: Rp 15.420.000
• Total P/L: +6.2% (Rp +950.000)

🔥 Top Performer:
BBRI: +5.70%

📉 Underperformer:
TLKM: +1.54%

🎯 Today's Actions:
• 2 stocks analyzed
• 1 top-up: Rp 5M
• 0 trades

💡 AI Tip: Market sentiment bullish. Consider adding positions in banking sector.
```

### TradingView Alerts
```
Bot: 🚀 TradingView Alert

Signal: BULLISH BREAKOUT
Stock: BBCA
Price: Rp 10.350
Volume: 25% above average

AI Score: 85/100
Recommendation: BUY

Resistance: Rp 10.500
Support: Rp 10.200

[Analyze Now] [Add to Watchlist]
```

---

## 🛠️ Setup in n8n

### Import Workflows

1. **Telegram Commands Workflow:**
   - Import: `n8n/telegram-bot-commands.json`
   - Configure: Add your Telegram credentials
   - Activate workflow

2. **Notification Workflow:**
   - Create new workflow in n8n
   - Add Telegram node
   - Set trigger (schedule, webhook, etc.)

### Configure Environment Variables

In n8n, set:
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
GOOGLE_SHEETS_ID=your_spreadsheet_id
```

---

## 📱 Customize Bot

### Bot Profile

Edit with @BotFather:

**Description:**
```
🤖 Cuanterus Trading Bot

Your personal stock portfolio assistant.

Commands:
/balance - Check balance
/portfolio - View holdings
/analyze - Analyze stocks
/topup - Add funds
/help - Show all commands

Powered by AI 🚀
```

**About:**
```
Cuanterus Trading Bot helps you manage your stock portfolio with AI-powered analysis and real-time notifications.
```

**Profile Picture:**
- Upload a logo (512x512 px)
- Use trading/chart themed image

**Commands List:**
```
/start - Start the bot
/help - Show help
/balance - Check balance
/portfolio - View portfolio
/analyze - Analyze stock
/topup - Top-up balance
/history - Analysis history
/price - Get stock price
/alert - Set price alert
/report - Daily report
```

Send to @BotFather:
```
/setcommands

Then paste:
start - Start the bot
help - Show help message
balance - Check RDN balance
portfolio - View portfolio holdings
analyze - Analyze stock with AI
topup - Top-up balance
history - Recent analysis history
price - Get current stock price
alert - Set price alert
report - Daily portfolio report
```

---

## 🎨 Message Formatting

### Markdown Support

Telegram supports:
- `*bold*` → **bold**
- `_italic_` → *italic*
- `[link](url)` → link
- `` `code` `` → `code`
- ``` ```code block``` ``` → code block

### Emoji Reference

```
💰 Money/Balance
📊 Portfolio/Chart
📈 Profit/Up
📉 Loss/Down
🚨 Alert
🚀 Bullish/Up
⚠️ Warning
✅ Success
❌ Error
🔍 Analyze
💸 Transaction
🎯 Target
🔔 Notification
💡 Tip/Info
🔥 Hot/Trending
⏰ Time/Schedule
📬 Message
📱 Mobile
🤖 Bot
```

---

## 🔒 Security Best Practices

### 1. Keep Token Secret
- ❌ Never commit bot token to Git
- ✅ Use environment variables
- ✅ Regenerate if exposed

### 2. Verify Users
```javascript
// In n8n code node
const authorizedUsers = [123456789, 987654321]; // Your chat IDs

if (!authorizedUsers.includes($json.message.from.id)) {
  return [{
    json: {
      text: "❌ Unauthorized access. Contact admin."
    }
  }];
}
```

### 3. Rate Limiting
- Limit commands per user per minute
- Add cooldown periods
- Detect spam attempts

### 4. Input Validation
```javascript
// Validate top-up amount
const amount = parseInt($json.message.text.split(' ')[1]);

if (isNaN(amount) || amount < 100000 || amount > 100000000) {
  return [{
    json: {
      text: "❌ Invalid amount. Min: Rp 100K, Max: Rp 100M"
    }
  }];
}
```

---

## 🧪 Testing

### Test Commands Manually

1. Start bot
2. Send each command
3. Verify response
4. Check Google Sheets updated
5. Confirm notifications sent

### Test Checklist

- [ ] `/start` shows welcome message
- [ ] `/balance` returns current balance
- [ ] `/portfolio` lists all holdings
- [ ] `/analyze BBCA` performs AI analysis
- [ ] `/topup 1000000` updates balance
- [ ] Notifications received
- [ ] Data saved to Google Sheets
- [ ] Error messages are clear
- [ ] Response time < 3 seconds
- [ ] Markdown formatting works

---

## 🐛 Troubleshooting

### Bot Not Responding

**Possible causes:**
1. n8n workflow not active
2. Bot token incorrect
3. Webhook not set up

**Solutions:**
- Check n8n workflow is "Active"
- Verify token in credentials
- Restart n8n

### "Unauthorized" Error

**Fix:**
- Regenerate token with @BotFather
- Update in n8n credentials
- Test with `/getMe` API endpoint

### Commands Not Working

**Fix:**
- Check command format (lowercase, with /)
- Verify workflow has correct command matcher
- Look at n8n execution logs

### Google Sheets Not Updating

**Fix:**
- Check service account has access
- Verify sheet names match exactly
- Check n8n Google Sheets credentials

---

## 📚 Advanced Features

### 1. Inline Keyboards

Add buttons to messages:
```javascript
{
  "text": "Choose action:",
  "reply_markup": {
    "inline_keyboard": [[
      {"text": "💰 Balance", "callback_data": "/balance"},
      {"text": "📊 Portfolio", "callback_data": "/portfolio"}
    ]]
  }
}
```

### 2. Interactive Menus

Create menu with options:
```
Bot: What would you like to do?

[💰 Check Balance] [📊 View Portfolio]
[📈 Analyze Stock] [💸 Top-Up]
[📬 Notifications] [⚙️ Settings]
```

### 3. Multi-Step Conversations

Example: Guided stock purchase
```
Bot: Let's buy some stocks!

Step 1/3: Which stock? (e.g., BBCA)
You: BBCA

Bot: Step 2/3: How many lots? (1-100)
You: 5

Bot: Step 3/3: Confirm purchase?
BBCA - 5 lots @ Rp 10,200
Total: Rp 5,100,000

[✅ Confirm] [❌ Cancel]
```

---

## 🎯 Use Case Scenarios

### Scenario 1: Morning Routine
```
7:00 AM - Bot: 📊 Good morning! Daily report...
         → Check overnight changes
         → Review portfolio
         → Get AI recommendations
```

### Scenario 2: Price Alert
```
10:30 AM - Bot: 🚨 BBCA reached Rp 10,500!
          → View analysis
          → Decide: Hold or Sell
          → Execute via bot
```

### Scenario 3: Quick Analysis
```
During lunch - You: /analyze ASII
              Bot: Returns instant AI analysis
              → Make informed decision
              → Set alert if needed
```

### Scenario 4: Evening Review
```
6:00 PM - You: /report
         Bot: Full day summary
         → Total P/L
         → Top performers
         → Tomorrow's outlook
```

---

## 📞 Support

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#botfather)
- [n8n Telegram Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/)

---

## ✅ Setup Complete Checklist

- [ ] Bot created with @BotFather
- [ ] Bot token saved
- [ ] Chat ID obtained
- [ ] n8n workflows imported
- [ ] Credentials configured
- [ ] Test commands working
- [ ] Notifications enabled
- [ ] Google Sheets connected
- [ ] Bot profile customized
- [ ] Commands list set

---

**Status:** 🤖 Bot Ready | 💬 Commands Active | 🔔 Notifications On

Your Telegram Bot is now your personal trading assistant! 🚀
