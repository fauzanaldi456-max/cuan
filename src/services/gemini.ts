/**
 * Gemini AI Service
 * Handles stock analysis using Google Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Check if API key is configured
const USE_MOCK = !GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE';

if (USE_MOCK) {
  console.warn('⚠️ Gemini API key not configured. Using mock analysis. Set VITE_GEMINI_API_KEY in .env.local');
}

interface AnalysisResult {
  verdict: 'BULLISH' | 'BEARISH' | 'TO THE MOON' | 'BERDARAH' | 'SIDEWAYS';
  score: number;
  fundamental: number;
  technical: number;
  momentum: number;
  sentiment: number;
  risk: number;
  insight: string;
  recommendation: string;
}

/**
 * Analyze stock using Gemini AI
 */
export async function analyzeStock(
  symbol: string,
  name: string,
  price: number,
  volume?: number,
  marketCap?: number
): Promise<AnalysisResult> {
  // Use mock analysis if API key not configured
  if (USE_MOCK) {
    return generateMockAnalysis(symbol, name, price);
  }

  try {
    const prompt = `
Analisis saham Indonesia berikut dengan gaya bahasa santai tapi profesional (gaya "Jamet Stock Analyst"):

Simbol: ${symbol}
Nama: ${name}
Harga Saat Ini: Rp ${price.toLocaleString('id-ID')}
${volume ? `Volume: ${volume.toLocaleString('id-ID')}` : ''}
${marketCap ? `Market Cap: Rp ${marketCap.toLocaleString('id-ID')}` : ''}

Berikan analisis dalam format berikut:

VERDICT: [BULLISH / BEARISH / TO THE MOON / BERDARAH / SIDEWAYS]
SCORE: [0-100]
FUNDAMENTAL: [0-100]
TECHNICAL: [0-100]
MOMENTUM: [0-100]
SENTIMENT: [0-100]
RISK: [0-100]

INSIGHT:
[1-2 kalimat singkat, padat, gaya santai tentang kondisi saham]

RECOMMENDATION:
[1 kalimat rekomendasi: BUY / HOLD / SELL dengan alasan singkat]

Gunakan bahasa santai seperti: "cuan", "gas", "serok bawah", "ATH", "cut loss", dll.
Jadilah spesifik dan realistis berdasarkan data yang ada.
`;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Parse the response
    return parseGeminiResponse(text, symbol);
  } catch (error) {
    console.error('Error analyzing stock with Gemini:', error);
    // Fallback to mock if API fails
    return generateMockAnalysis(symbol, name, price);
  }
}

/**
 * Parse Gemini API response
 */
function parseGeminiResponse(text: string, symbol: string): AnalysisResult {
  try {
    // Extract verdict
    const verdictMatch = text.match(/VERDICT:\s*(BULLISH|BEARISH|TO THE MOON|BERDARAH|SIDEWAYS)/i);
    const verdict = (verdictMatch?.[1]?.toUpperCase() as AnalysisResult['verdict']) || 'SIDEWAYS';

    // Extract scores
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const fundamentalMatch = text.match(/FUNDAMENTAL:\s*(\d+)/);
    const technicalMatch = text.match(/TECHNICAL:\s*(\d+)/);
    const momentumMatch = text.match(/MOMENTUM:\s*(\d+)/);
    const sentimentMatch = text.match(/SENTIMENT:\s*(\d+)/);
    const riskMatch = text.match(/RISK:\s*(\d+)/);

    const score = parseInt(scoreMatch?.[1] || '50');
    const fundamental = parseInt(fundamentalMatch?.[1] || '50');
    const technical = parseInt(technicalMatch?.[1] || '50');
    const momentum = parseInt(momentumMatch?.[1] || '50');
    const sentiment = parseInt(sentimentMatch?.[1] || '50');
    const risk = parseInt(riskMatch?.[1] || '50');

    // Extract insight
    const insightMatch = text.match(/INSIGHT:\s*\n([\s\S]*?)\n\nRECOMMENDATION:/);
    const insight = insightMatch?.[1]?.trim() || `Analisis untuk ${symbol} menunjukkan kondisi yang menarik untuk diperhatikan.`;

    // Extract recommendation
    const recommendationMatch = text.match(/RECOMMENDATION:\s*\n([\s\S]*?)$/);
    const recommendation = recommendationMatch?.[1]?.trim() || 'HOLD - Tunggu sinyal lebih jelas sebelum masuk posisi.';

    return {
      verdict,
      score,
      fundamental,
      technical,
      momentum,
      sentiment,
      risk,
      insight,
      recommendation,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return generateMockAnalysis(symbol, '', 0);
  }
}

/**
 * Generate mock analysis (fallback)
 */
function generateMockAnalysis(symbol: string, name: string, price: number): AnalysisResult {
  // Generate consistent random based on symbol
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed % 100) / 100;

  const score = Math.floor(40 + random * 50); // 40-90
  const fundamental = Math.floor(40 + (random * 30 + seed % 30));
  const technical = Math.floor(40 + ((1 - random) * 30 + seed % 30));
  const momentum = Math.floor(30 + random * 60);
  const sentiment = Math.floor(35 + random * 55);
  const risk = Math.floor(30 + (1 - random) * 60);

  let verdict: AnalysisResult['verdict'];
  let insight: string;
  let recommendation: string;

  if (score >= 80) {
    verdict = 'TO THE MOON';
    insight = `${symbol} lagi on fire bosku! 🚀 Fundamental solid, momentum kenceng, ini kandidat cuan gede. Tapi jangan FOMO, tetep pake SL ya.`;
    recommendation = 'BUY - Gas terus tapi jangan all-in, alokasi 30-40% portfolio aja. Target profit 20-30%, SL di 5%.';
  } else if (score >= 65) {
    verdict = 'BULLISH';
    insight = `${symbol} showing positive signs nih. Trend naik, volume oke, fundamentalnya lumayan. Cocok buat yang mau serok bertahap.`;
    recommendation = 'BUY - Masuk bertahap (DCA), target 15-20% profit. Pasang SL di support terdekat.';
  } else if (score >= 45) {
    verdict = 'SIDEWAYS';
    insight = `${symbol} lagi consolidation bosku. Belum ada konfirmasi arah yang jelas. Better tunggu breakout dulu sebelum entry.`;
    recommendation = 'HOLD - Kalau udah punya, hold aja. Kalau belum, wait & see. Pantau support-resistance.';
  } else if (score >= 30) {
    verdict = 'BEARISH';
    insight = `${symbol} tekanan jual lumayan. Trend weakness, momentum turun. Kurang ideal buat entry, kecuali lu cari reversal play.`;
    recommendation = 'HOLD/SELL - Kalau profit, consider take profit. Kalau rugi, tunggu rebound atau cut loss kalau breakdown support.';
  } else {
    verdict = 'BERDARAH';
    insight = `${symbol} lagi berdarah parah! 🩸 High risk, sentiment negatif. Hindari dulu kecuali lu expert trader yang mau bottom fishing.`;
    recommendation = 'SELL - Avoid atau cut loss kalau masih pegang. Tunggu sampai kondisi membaik dan konfirmasi reversal.';
  }

  return {
    verdict,
    score,
    fundamental,
    technical,
    momentum,
    sentiment,
    risk,
    insight,
    recommendation,
  };
}

/**
 * Batch analyze multiple stocks
 */
export async function analyzeStocksBatch(
  stocks: Array<{ symbol: string; name: string; price: number }>
): Promise<Map<string, AnalysisResult>> {
  const results = new Map<string, AnalysisResult>();

  // Analyze sequentially to avoid rate limits
  for (const stock of stocks) {
    try {
      const result = await analyzeStock(stock.symbol, stock.name, stock.price);
      results.set(stock.symbol, result);
      
      // Add small delay to avoid rate limiting
      if (!USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error analyzing ${stock.symbol}:`, error);
    }
  }

  return results;
}

export default {
  analyzeStock,
  analyzeStocksBatch,
};
