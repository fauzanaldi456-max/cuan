# 🚀 Deployment Guide

Complete guide to deploy Cuanterus to production.

## 📋 Overview

Cuanterus is a **frontend-only application** that can be deployed to:
- ✅ **Vercel** (Recommended)
- ✅ **Netlify**
- ✅ **GitHub Pages**
- ✅ **Cloudflare Pages**
- ✅ Any static hosting service

**No backend server needed!** Just deploy the React app.

---

## 🎯 Quick Deploy

### Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fauzanaldi456-max/cuan)

**1-Click Deploy:**
1. Click button above
2. Connect GitHub account
3. Configure environment variables
4. Deploy!

**Manual Deploy:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Follow prompts
```

**That's it!** Your app is live at: `https://your-project.vercel.app`

---

### Option 2: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fauzanaldi456-max/cuan)

**1-Click Deploy:**
1. Click button above
2. Connect GitHub account
3. Configure build settings
4. Deploy!

**Manual Deploy:**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build
npm run build

# 4. Deploy
netlify deploy --prod
```

**Live at:** `https://your-app.netlify.app`

---

## 🔧 Deployment Steps (Detailed)

### Step 1: Prepare for Production

#### 1.1 Update Environment Variables

Create `.env.production`:

```env
# Google Sheets Configuration
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id
VITE_GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"..."}

# Gemini AI API Key
VITE_GEMINI_API_KEY=your_actual_api_key
```

**Important:** Don't use `CREDENTIALS_PATH` in production. Use full JSON string.

#### 1.2 Convert Credentials to Environment Variable

```bash
# Windows PowerShell
$json = Get-Content google-credentials.json | Out-String
$json = $json -replace "`n", "" -replace "`r", ""
echo "VITE_GOOGLE_SHEETS_CREDENTIALS=$json"

# Linux/Mac
cat google-credentials.json | jq -c . | xargs -0 echo "VITE_GOOGLE_SHEETS_CREDENTIALS="
```

Copy the output and paste in deployment platform.

#### 1.3 Test Production Build Locally

```bash
# Build
npm run build

# Preview
npm run preview

# Test at http://localhost:4173
```

Verify:
- [ ] App loads without errors
- [ ] Google Sheets data appears
- [ ] All features work
- [ ] No console errors

---

### Step 2: Deploy to Vercel

#### Via Vercel Dashboard

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import Git Repository:**
   - Connect GitHub
   - Select repository: `fauzanaldi456-max/cuan`
   - Click "Import"

3. **Configure Project:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: bun install
   ```

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_GOOGLE_SHEETS_SPREADSHEET_ID
     VITE_GOOGLE_SHEETS_CREDENTIALS
     VITE_GEMINI_API_KEY
     ```
   - Paste values (use Production tab)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get URL: `https://cuanterus.vercel.app`

#### Via Vercel CLI

```bash
# 1. Install CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Add secrets
vercel env add VITE_GOOGLE_SHEETS_SPREADSHEET_ID
# Paste your spreadsheet ID

vercel env add VITE_GOOGLE_SHEETS_CREDENTIALS
# Paste JSON (single line)

vercel env add VITE_GEMINI_API_KEY
# Paste API key

# 5. Deploy to production
vercel --prod
```

#### Configure Custom Domain (Optional)

1. Go to project settings
2. Click "Domains"
3. Add your domain: `cuanterus.com`
4. Follow DNS instructions
5. SSL auto-configured

---

### Step 3: Deploy to Netlify

#### Via Netlify Dashboard

1. **Go to [app.netlify.com](https://app.netlify.com)**

2. **New Site from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select repository

3. **Build Settings:**
   ```
   Branch: main
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables:**
   - Go to "Site settings" → "Environment variables"
   - Add variables:
     ```
     VITE_GOOGLE_SHEETS_SPREADSHEET_ID
     VITE_GOOGLE_SHEETS_CREDENTIALS
     VITE_GEMINI_API_KEY
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build
   - Get URL: `https://cuanterus.netlify.app`

#### Via Netlify CLI

```bash
# 1. Install CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize
netlify init

# 4. Configure
# Select: Create & configure a new site

# 5. Build
npm run build

# 6. Set env vars (in netlify.toml or dashboard)

# 7. Deploy
netlify deploy --prod --dir=dist
```

#### netlify.toml Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Step 4: Configure Google Sheets for Production

#### Update Service Account Permissions

1. Open your Google Sheet
2. Click "Share"
3. Verify service account email has "Editor" access
4. Check "Notify people" is OFF (to avoid spam)

#### Test API Access

```bash
# Test with production credentials
curl -X POST https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values:batchGet \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json"
```

---

### Step 5: Setup n8n for Production

#### n8n Cloud (Recommended)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for account
3. Import workflows from `n8n/` folder
4. Configure credentials:
   - Google Sheets
   - Telegram Bot
   - Gemini API
5. Update webhook URLs in TradingView
6. Activate all workflows

#### Self-Hosted n8n

```bash
# Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your_password \
  -e WEBHOOK_URL=https://your-domain.com/ \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at: http://your-server:5678
```

---

### Step 6: Configure Telegram Bot

Update bot with production URLs:

```
# Talk to @BotFather
/setcommands

# Paste:
start - Start the bot
balance - Check balance
portfolio - View portfolio
analyze - Analyze stock
topup - Top-up balance
```

Test bot:
1. Send `/start`
2. Verify it connects to production Google Sheets
3. Test all commands

---

## 🔒 Production Security Checklist

### Environment Variables

- [ ] All secrets in environment variables
- [ ] No credentials in code
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets separate from dev

### Google Sheets

- [ ] Service account has minimal permissions
- [ ] Sheet not publicly accessible
- [ ] Version history enabled
- [ ] Regular backups

### API Keys

- [ ] Gemini API key secured
- [ ] Key rotation policy
- [ ] Usage monitoring enabled
- [ ] Rate limiting configured

### Telegram Bot

- [ ] Bot token secured
- [ ] User whitelist implemented
- [ ] Rate limiting active
- [ ] Webhook over HTTPS

### Frontend

- [ ] HTTPS enabled (auto by Vercel/Netlify)
- [ ] CSP headers configured
- [ ] No sensitive data in localStorage
- [ ] Error messages don't leak info

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable in project settings:
- Real User Monitoring
- Web Vitals
- Traffic analytics

### Google Sheets Version History

Monitor changes:
1. File → Version history
2. See all changes
3. Restore if needed

### n8n Execution Logs

Check workflow runs:
1. Go to Executions tab
2. Review success/failure
3. Debug errors

### Telegram Bot Logs

Monitor via @BotFather:
- Message count
- User count
- Error rate

---

## 🐛 Troubleshooting Production Issues

### Issue: App Shows "Connection Error"

**Cause:** Can't reach Google Sheets API

**Fix:**
1. Check environment variables set correctly
2. Verify service account JSON is valid
3. Check Google Sheets API quota
4. Test credentials locally first

### Issue: "The caller does not have permission"

**Cause:** Service account can't access sheet

**Fix:**
1. Re-share sheet with service account email
2. Give "Editor" permission
3. Check sheet ID is correct
4. Verify API is enabled in Google Cloud Console

### Issue: Build Fails on Vercel/Netlify

**Cause:** Missing dependencies or build errors

**Fix:**
```bash
# Test build locally first
npm run build

# Check for errors
# Fix TypeScript errors
npm run lint

# Check package.json scripts
```

### Issue: Telegram Bot Not Responding

**Cause:** n8n workflow not active or webhook issue

**Fix:**
1. Check n8n workflow is "Active"
2. Verify webhook URL is correct
3. Test with `/getMe` API endpoint
4. Check bot token is valid

### Issue: Slow Performance

**Cause:** Too many API calls or large sheets

**Fix:**
1. Implement caching in frontend
2. Reduce API call frequency
3. Optimize sheet formulas
4. Use batch operations

---

## 🚀 Performance Optimization

### Frontend Optimization

```typescript
// Implement caching
const CACHE_DURATION = 30000; // 30 seconds
let lastFetch = 0;
let cachedData = null;

async function getData() {
  const now = Date.now();
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    return cachedData;
  }
  
  cachedData = await api.getData();
  lastFetch = now;
  return cachedData;
}
```

### Google Sheets Optimization

- Use `ARRAYFORMULA` for calculations
- Minimize volatile functions (`NOW()`, `RAND()`)
- Batch read/write operations
- Archive old data to separate sheets

### n8n Optimization

- Use "Execute Once" nodes
- Implement error handling
- Set proper timeouts
- Use caching nodes

---

## 📈 Scaling Production

### Current Limits (Free Tier)

| Service | Limit | When to Upgrade |
|---------|-------|-----------------|
| Vercel | 100GB bandwidth | 1M+ page views |
| Google Sheets | 10M cells | 100K+ records |
| Gemini AI | 1500 req/day | 50+ analyses/day |
| n8n Cloud | 5K executions/month | 150+ exec/day |

### Upgrade Path

**Level 1 (1-100 users):**
- Current setup sufficient
- All free tiers adequate

**Level 2 (100-1,000 users):**
- Vercel Pro ($20/mo)
- Multiple Google Sheets (sharding)
- Gemini AI paid tier

**Level 3 (1,000+ users):**
- Migrate to Supabase (PostgreSQL)
- Dedicated backend server
- Enterprise n8n
- Load balancing

---

## ✅ Post-Deployment Checklist

### Functionality

- [ ] App loads on production URL
- [ ] Google Sheets data displays
- [ ] Top-up works
- [ ] Add/remove holdings works
- [ ] Analysis history saves
- [ ] Telegram bot responds
- [ ] n8n workflows execute

### Performance

- [ ] Page load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All features work on mobile

### Security

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] Service account permissions minimal
- [ ] Bot access restricted

### Monitoring

- [ ] Analytics enabled
- [ ] Error tracking setup
- [ ] Uptime monitoring
- [ ] Backup strategy in place

---

## 🎯 Going Live Checklist

### Pre-Launch

- [ ] Test all features thoroughly
- [ ] Check mobile responsiveness
- [ ] Verify all integrations
- [ ] Setup monitoring
- [ ] Document known issues
- [ ] Prepare rollback plan

### Launch

- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Test critical paths
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Launch

- [ ] Monitor first 24 hours
- [ ] Collect user feedback
- [ ] Fix urgent bugs
- [ ] Document issues
- [ ] Plan next iteration

---

## 📞 Support & Resources

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [n8n Docs](https://docs.n8n.io)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### Community

- [Vercel Discord](https://vercel.com/discord)
- [n8n Community](https://community.n8n.io)
- [Telegram Bot Developers](https://t.me/BotDevelopment)

---

## 🎉 Congratulations!

Your Cuanterus app is now live in production! 🚀

**Next Steps:**
1. Share with users
2. Collect feedback
3. Monitor performance
4. Iterate and improve

**Your Production URLs:**
- Frontend: `https://cuanterus.vercel.app`
- n8n: `https://your-n8n.cloud`
- Telegram: `@your_cuanterus_bot`

---

**Deployment Status:** ✅ Production Ready | 🌍 Live | 📊 Monitored | 🔒 Secured
