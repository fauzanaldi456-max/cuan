export interface StockScore {
  total: number;
  fund: number;
  tech: number;
  val: number;
  mom: number;
  flow: number;
  sent: number;
  cat: number;
  buyPct: number;
  holdPct: number;
  sellPct: number;
  verdict: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' | 'BERDARAH' | 'TO THE MOON';
}

export interface StockSetup {
  entry: string;
  supNear: string;
  resNear: string;
  supStrong: string;
  resStrong: string;
  breakout: string;
  inval: string;
  tp?: string;
}

export interface StockFundamentals {
  desc: string;
  rev: string[];
  revYoy: string;
  profit: string[];
  profitYoy: string;
  margin: string[];
  risk: string[];
  roa?: string;
  roe?: string;
}

export interface StockValuation {
  meter: number; // 0 to 100
  text: string;
  per: string;
  perPeer: string;
  pbv: string;
  pbvPeer: string;
  div: string;
  ev: string;
}

export interface StockTechnical {
  ma: string;
  ichi: string;
  macd: string;
  atr: string;
  risk: 'Low' | 'Medium' | 'High' | 'Sangat Barbar';
  rsiDesc?: string;
  volumeDesc?: string;
}

export interface StockFlow {
  status: string;
  buyBroker: string;
  sellBroker: string;
  foreign: string;
  matrix: string;
  retailSentiment?: string;
}

export interface CatalystItem {
  title: string;
  impact: string;
  color: 'primary' | 'tertiary' | 'error';
  desc: string;
}

export interface RiskItem {
  title: string;
  impact: string;
  color: 'primary' | 'tertiary' | 'error';
  desc: string;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: string;
  rawPrice: number;
  changeStr: string;
  percentStr: string;
  isUp: boolean;
  logoUrl?: string;
  scores: StockScore;
  insight: string;
  setup: StockSetup;
  fund: StockFundamentals;
  val: StockValuation;
  tech: StockTechnical;
  flow: StockFlow;
  catalysts: CatalystItem[];
  risks: RiskItem[];
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  avgPrice: number;
  currentPrice: number;
  lots: number;
  plPercent: number;
  plLabel: string;
  isProfit: boolean;
  notes?: string;
}

export interface HistoryItem {
  id: string;
  symbol: string;
  name: string;
  date: string;
  price: string;
  score: number;
  status: 'Bullish' | 'Berdarah' | 'Sideways' | 'To the Moon' | 'Hati-Hati';
  color: 'primary' | 'error' | 'tertiary';
}

export interface MarketNotification {
  id: string;
  time: string;
  title: string;
  message: string;
  type: 'cuan' | 'danger' | 'info' | 'bule';
  symbol?: string;
}
