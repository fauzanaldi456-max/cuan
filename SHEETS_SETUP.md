# Google Sheets Setup Guide

Complete guide to setup Google Sheets as your database for Cuanterus.

## 📊 Step 1: Create Google Sheets

### 1.1 Create New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create new spreadsheet
3. Rename to: **"Cuanterus Trading Database"**
4. Note the **Spreadsheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 1.2 Create Sheets (Tabs)

Create 5 sheets with these exact names:

#### **Sheet 1: Holdings**
Columns (Row 1):
```
A: id
B: symbol
C: name
D: avgPrice
E: currentPrice
F: lots
G: shares (=F*100)
H: totalValue (=E*G)
I: plAmount (=(E-D)*G)
J: plPercent (=(E-D)/D*100)
K: notes
L: createdAt
M: updatedAt
```

Sample data (Row 2):
```
1 | BBCA | Bank Central Asia Tbk | 9850 | 10200 | 5 | =F2*100 | =E2*G2 | =(E2-D2)*G2 | =(E2-D2)/D2*100 | Blue chip | 2024-01-01 | 2024-01-01
```

#### **Sheet 2: Balance**
Columns (Row 1):
```
A: userId
B: balance
C: lastUpdated
```

Sample data (Row 2):
```
demo | 45230000 | 2024-01-01 12:00:00
```

#### **Sheet 3: History**
Columns (Row 1):
```
A: id
B: symbol
C: name
D: price
E: score
F: verdict
G: status
H: analyzedAt
```

Sample data (Row 2):
```
1 | BBCA | Bank Central Asia Tbk | 10200 | 82 | BULLISH | Bullish | 2024-01-01 10:30:00
```

#### **Sheet 4: Transactions**
Columns (Row 1):
```
A: id
B: type
C: symbol
D: amount
E: price
F: lots
G: paymentMethod
H: status
I: createdAt
```

Sample data (Row 2):
```
1 | TOP_UP | | 50000000 | | | Bank Transfer | SUCCESS | 2024-01-01 09:00:00
```

#### **Sheet 5: Settings**
Columns (Row 1):
```
A: key
B: value
C: updatedAt
```

Sample data:
```
theme | dark | 2024-01-01
notificationsEnabled | true | 2024-01-01
defaultLots | 1 | 2024-01-01
```

### 1.3 Share Spreadsheet

1. Click **"Share"** button (top right)
2. Set to: **"Anyone with the link can view"**
3. Copy the link

---

## 🔑 Step 2: Google Cloud Console Setup

### 2.1 Create Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Project name: **"Cuanterus"**
4. Click **"Create"**

### 2.2 Enable Google Sheets API

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### 2.3 Enable Google Drive API (Optional but Recommended)

1. Search for **"Google Drive API"**
2. Click and press **"Enable"**

### 2.4 Create Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Service account details:
   - Name: `cuanterus-sheets`
   - ID: `cuanterus-sheets`
4. Click **"Create and Continue"**
5. Grant role: **"Editor"** (or just **"Google Sheets API"**)
6. Click **"Done"**

### 2.5 Create Service Account Key

1. Click on the service account you just created
2. Go to **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **"JSON"**
5. Click **"Create"**
6. **Save the JSON file** (it will download automatically)
7. Rename to: `google-credentials.json`

### 2.6 Share Sheet with Service Account

1. Open the JSON file you downloaded
2. Find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Copy that email
4. Go back to your Google Sheet
5. Click **"Share"**
6. Paste the service account email
7. Give **"Editor"** permission
8. Click **"Send"**

---

## 🔧 Step 3: Configure Application

### 3.1 Place Credentials File

**Option A: For Development (Easy)**
1. Copy `google-credentials.json` to project root
2. Add to `.gitignore` (already added)

**Option B: For Production (Secure)**
1. Copy entire JSON content
2. Create environment variable: `GOOGLE_SHEETS_CREDENTIALS`
3. Paste JSON as single-line string

### 3.2 Update Environment Variables

Edit `.env.local`:

```env
# Google Sheets Configuration
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_SHEETS_CREDENTIALS_PATH=./google-credentials.json

# OR for production:
# VITE_GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}

# Gemini AI (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3.3 Get Spreadsheet ID

From your Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0/edit
                                      ^^^^^^^^^^^^^^^^^^^
                                      This is your ID
```

Copy that ID and paste in `.env.local`

---

## ✅ Step 4: Verify Setup

### Test 1: Check Permissions

1. Open your Google Sheet
2. Check that service account email has **Editor** access
3. Try editing a cell manually → should work

### Test 2: Test API Access (Manual)

Use Google's OAuth Playground:
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Select **"Google Sheets API v4"**
3. Authorize and test reading your sheet

### Test 3: Run Application

```bash
npm run dev
```

Check browser console for any Google Sheets errors.

---

## 📝 Template Spreadsheet

For quick setup, you can copy this template:

**Template URL:** [Create your own using structure above]

To copy:
1. Click template link
2. File → Make a copy
3. Follow Step 2 onwards

---

## 🔒 Security Best Practices

### Development
- ✅ Store credentials in `google-credentials.json`
- ✅ Add to `.gitignore`
- ✅ Never commit credentials to Git

### Production
- ✅ Use environment variables
- ✅ Store JSON as base64 or single-line string
- ✅ Use secrets management (Vercel, Netlify, etc.)
- ✅ Rotate keys periodically

### Sheet Access
- ✅ Only share with service account
- ✅ Set to "Anyone with link can view" for public read
- ✅ Keep editor access restricted
- ✅ Enable version history

---

## 🐛 Troubleshooting

### Error: "The caller does not have permission"

**Solution:**
1. Check service account email has Editor access to sheet
2. Verify Google Sheets API is enabled
3. Check credentials file is correct

### Error: "Spreadsheet not found"

**Solution:**
1. Verify Spreadsheet ID is correct
2. Check sheet is shared with service account
3. Make sure sheet exists and is not deleted

### Error: "Invalid credentials"

**Solution:**
1. Re-download service account JSON
2. Check file path in `.env.local`
3. Verify JSON format is valid

### Error: "Cannot read from sheet"

**Solution:**
1. Check sheet name exactly matches (case-sensitive)
2. Verify columns are in correct order
3. Check row 1 has headers

---

## 📊 Sheet Formulas Reference

### Holdings Sheet

**Shares calculation (Column G):**
```
=F2*100
```

**Total Value (Column H):**
```
=E2*G2
```

**P/L Amount (Column I):**
```
=(E2-D2)*G2
```

**P/L Percent (Column J):**
```
=(E2-D2)/D2*100
```

### Summary Calculations

Add a "Summary" sheet with:

**Total Portfolio Value:**
```
=SUM(Holdings!H:H)
```

**Total P/L:**
```
=SUM(Holdings!I:I)
```

**Number of Holdings:**
```
=COUNTA(Holdings!A:A)-1
```

**Average P/L %:**
```
=AVERAGE(Holdings!J2:J)
```

---

## 🎯 Next Steps

After setup complete:
1. ✅ Test reading data from frontend
2. ✅ Test writing data to sheets
3. ✅ Setup n8n workflows
4. ✅ Configure Telegram bot
5. ✅ Deploy to production

---

## 📞 Support

If stuck:
1. Check [Google Sheets API Docs](https://developers.google.com/sheets/api)
2. Verify all steps completed
3. Check browser console for errors
4. Review troubleshooting section

## 🎉 Setup Complete!

Once you see data in your app, you're ready to go! 🚀
