import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Store,
  CreditCard,
  LineChart,
  Waves,
  Rocket,
  AlertTriangle,
  Target,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { StockData, HistoryItem } from '../types';

interface DashboardViewProps {
  stock: StockData;
  history: HistoryItem[];
  onSelectStock: (symbol: string) => void;
  onAddToPortfolio: (stock: StockData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stock,
  history,
  onSelectStock,
  onAddToPortfolio,
}) => {
  const isUp = stock.isUp;

  // Determine score color
  const getScoreColor = (val: number) => {
    if (val >= 75) return 'text-[#7bdb80] border-[#7bdb80] shadow-[0_0_15px_rgba(123,219,128,0.3)]';
    if (val >= 50) return 'text-[#fabc45] border-[#fabc45] shadow-[0_0_15px_rgba(250,188,69,0.3)]';
    return 'text-[#ffb4ab] border-[#ffb4ab] shadow-[0_0_15px_rgba(255,180,171,0.3)]';
  };

  const getMetricColor = (val: number) => {
    if (val >= 75) return 'text-[#7bdb80]';
    if (val >= 50) return 'text-[#fabc45]';
    return 'text-[#ffb4ab]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
      {/* LEFT COLUMN (col-span-4) */}
      <div className="md:col-span-4 flex flex-col gap-4 md:gap-5">
        {/* 1. Header Card */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-[#dae3ee] tracking-tight leading-none">
                {stock.symbol}
              </h1>
              <p className="text-sm text-[#becaba] mt-1 font-medium">{stock.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-2 py-0.5 bg-[#222b33] rounded text-xs font-semibold text-[#becaba] border border-[#2d363e]">
                  {stock.sector}
                </span>
                <button
                  onClick={() => onAddToPortfolio(stock)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#238636]/30 hover:bg-[#238636] text-[#7bdb80] hover:text-[#f9fff3] rounded text-xs font-bold transition-colors border border-[#7bdb80]/30"
                  title="Simpan ke Kandang Portofolio"
                >
                  <Plus className="w-3 h-3" />
                  Kandangin
                </button>
              </div>
            </div>

            {stock.logoUrl ? (
              <img
                src={stock.logoUrl}
                alt={stock.name}
                className="w-12 h-12 rounded-full border border-[#2d363e] object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border border-[#2d363e] bg-[#141c24] flex items-center justify-center font-bold text-sm text-[#7bdb80] shrink-0">
                {stock.symbol.slice(0, 3)}
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="flex items-end gap-3">
              <span className="font-mono text-3xl md:text-4xl font-extrabold text-[#dae3ee]">
                {stock.price}
              </span>
              <div className="flex flex-col items-start leading-tight">
                <span
                  className={`font-mono font-bold flex items-center text-sm ${
                    isUp ? 'ticker-text-up' : 'ticker-text-down'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-4 h-4 mr-0.5" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-0.5" />
                  )}
                  {stock.changeStr}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    isUp ? 'ticker-text-up' : 'ticker-text-down'
                  }`}
                >
                  {stock.percentStr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. "Jamet Score" ("Ramalan Mbah AI") */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-[#dae3ee]">Jamet Score</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 border ${
                stock.scores.total >= 70
                  ? 'bg-[#238636]/20 text-[#7bdb80] border-[#7bdb80]/40'
                  : stock.scores.total >= 50
                  ? 'bg-[#996c00]/20 text-[#fabc45] border-[#fabc45]/40'
                  : 'bg-[#a00011]/20 text-[#ffb4ab] border-[#ffb4ab]/40'
              }`}
            >
              {stock.scores.total >= 50 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {stock.scores.verdict}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-[#182028] shrink-0 transition-all ${getScoreColor(
                stock.scores.total
              )}`}
            >
              <span className="text-2xl font-black">{stock.scores.total}</span>
            </div>

            <div className="flex-1 w-full space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#becaba]">Fundamental (20%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.fund)}`}>
                  {stock.scores.fund}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Technical (20%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.tech)}`}>
                  {stock.scores.tech}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Valuation (15%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.val)}`}>
                  {stock.scores.val}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Momentum (15%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.mom)}`}>
                  {stock.scores.mom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Market Flow (10%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.flow)}`}>
                  {stock.scores.flow}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Sentiment (10%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.sent)}`}>
                  {stock.scores.sent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#becaba]">Catalyst (10%)</span>
                <span className={`font-mono font-bold ${getMetricColor(stock.scores.cat)}`}>
                  {stock.scores.cat}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#becaba] italic border-l-2 border-[#7bdb80] pl-3 leading-relaxed">
            {stock.insight}
          </p>
        </div>

        {/* 3. Setup & Level Penting */}
        <div className="glass-card p-5">
          <h2 className="font-bold text-lg text-[#dae3ee] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#fabc45]" /> Setup &amp; Level Penting
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1.5 border-b border-[#2d363e]/60">
              <span className="text-sm text-[#becaba]">Area Entry</span>
              <span className="font-mono text-[#dae3ee] font-bold text-sm">{stock.setup.entry}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="py-1.5 border-b border-[#2d363e]/60">
                <span className="text-xs text-[#becaba] block mb-0.5">Support Terdekat</span>
                <span className="font-mono text-[#dae3ee] font-semibold text-sm">
                  {stock.setup.supNear}
                </span>
              </div>
              <div className="py-1.5 border-b border-[#2d363e]/60">
                <span className="text-xs text-[#becaba] block mb-0.5">Resist Terdekat</span>
                <span className="font-mono text-[#dae3ee] font-semibold text-sm">
                  {stock.setup.resNear}
                </span>
              </div>
              <div className="py-1.5 border-b border-[#2d363e]/60">
                <span className="text-xs text-[#becaba] block mb-0.5">Support Kuat</span>
                <span className="font-mono text-[#ffb4ab] font-bold text-sm">
                  {stock.setup.supStrong}
                </span>
              </div>
              <div className="py-1.5 border-b border-[#2d363e]/60">
                <span className="text-xs text-[#becaba] block mb-0.5">Resist Kuat</span>
                <span className="font-mono text-[#7bdb80] font-bold text-sm">
                  {stock.setup.resStrong}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#2d363e]/60">
              <span className="text-sm text-[#becaba]">Breakout Level</span>
              <span className="font-mono text-[#7bdb80] font-bold text-sm">
                {stock.setup.breakout}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-[#becaba]">Invalidation (SL)</span>
              <span className="font-mono text-[#ffb4ab] font-bold text-sm">{stock.setup.inval}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (col-span-8) */}
      <div className="md:col-span-8 flex flex-col gap-4 md:gap-5">
        {/* 1. Dapur Perusahaan (Anti Gosip) */}
        <div className="glass-card p-5">
          <h2 className="font-bold text-lg text-[#dae3ee] mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#ffb4ac]" /> Dapur Perusahaan (Anti Gosip)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Revenue Trend */}
            <div className="bg-[#182028] p-3.5 rounded-xl border border-[#2d363e]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#becaba] font-medium">Revenue (5Y Trend)</span>
                <span className="text-[#7bdb80] font-mono text-xs font-bold">{stock.fund.revYoy}</span>
              </div>
              <div className="flex items-center justify-between text-[#dae3ee] font-mono text-xs font-semibold">
                {stock.fund.rev.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <span>{val}</span>
                    {idx < stock.fund.rev.length - 1 && (
                      <TrendingUp className="w-3 h-3 text-[#7bdb80] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Net Profit Trend */}
            <div className="bg-[#182028] p-3.5 rounded-xl border border-[#2d363e]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#becaba] font-medium">Net Profit (5Y Trend)</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    stock.fund.profitYoy.includes('+') ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {stock.fund.profitYoy}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#dae3ee] font-mono text-xs font-semibold">
                {stock.fund.profit.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <span className={val.startsWith('-') ? 'text-[#ffb4ab]' : 'text-[#dae3ee]'}>
                      {val}
                    </span>
                    {idx < stock.fund.profit.length - 1 && (
                      <TrendingUp
                        className={`w-3 h-3 shrink-0 ${
                          isUp ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Net Profit Margin */}
            <div className="bg-[#182028] p-3.5 rounded-xl border border-[#2d363e]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#becaba] font-medium">Net Profit Margin</span>
              </div>
              <div className="flex items-center gap-2 text-[#dae3ee] font-mono text-xs font-semibold">
                {stock.fund.margin.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className={
                        idx === stock.fund.margin.length - 1
                          ? 'text-[#7bdb80] font-bold'
                          : idx === 0
                          ? 'text-[#fabc45]'
                          : 'text-[#7bdb80]'
                      }
                    >
                      {val}
                    </span>
                    {idx < stock.fund.margin.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-[#becaba] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* NPL / Debt Risk */}
            <div className="bg-[#182028] p-3.5 rounded-xl border border-[#2d363e]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#becaba] font-medium">NPL / Debt Risk</span>
              </div>
              <div className="flex items-center gap-2 text-[#dae3ee] font-mono text-xs font-semibold">
                {stock.fund.risk.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className={
                        idx === 0
                          ? 'text-[#ffb4ab]'
                          : idx === stock.fund.risk.length - 1
                          ? 'text-[#7bdb80] font-bold'
                          : 'text-[#fabc45]'
                      }
                    >
                      {val}
                    </span>
                    {idx < stock.fund.risk.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-[#becaba] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#141c24] p-3.5 rounded-xl border-l-4 border-[#ffb4ac]">
            <p className="text-sm text-[#becaba] leading-relaxed">{stock.fund.desc}</p>
          </div>
        </div>

        {/* Valuation & History Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Valuation Section (col-span-8) */}
          <div className="lg:col-span-8 glass-card p-5">
            <h2 className="font-bold text-lg text-[#dae3ee] mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#fabc45]" /> Murah Apa Mahal? (Valuation)
            </h2>

            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-[#becaba] font-medium">
                  Valuation Meter (vs Peers &amp; History)
                </span>
                <span
                  className={`text-xs font-bold ${
                    stock.val.meter > 60
                      ? 'text-[#ffb4ab]'
                      : stock.val.meter > 35
                      ? 'text-[#fabc45]'
                      : 'text-[#7bdb80]'
                  }`}
                >
                  {stock.val.text}
                </span>
              </div>
              <div className="h-2.5 w-full bg-[#222b33] rounded-full overflow-hidden flex relative">
                <div className="bg-gradient-to-r from-[#7bdb80] via-[#fabc45] to-[#ffb4ab] w-full h-full opacity-40"></div>
                {/* Indicator marker */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-[#dae3ee] shadow-md rounded-full"
                  style={{ left: `calc(${stock.val.meter}% - 4px)` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-[#becaba] font-mono">
                <span>Undervalued</span>
                <span>Fair</span>
                <span>Overvalued</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#93000a]/20 p-3 rounded-xl border border-[#ffb4ab]/30">
                <span className="text-xs text-[#ffb4ab] font-bold block mb-0.5">PER</span>
                <span className="font-mono text-base font-bold text-[#dae3ee] block">
                  {stock.val.per}
                </span>
                <span className="text-[11px] text-[#becaba] mt-0.5 block">Peers: {stock.val.perPeer}</span>
              </div>

              <div className="bg-[#93000a]/20 p-3 rounded-xl border border-[#ffb4ab]/30">
                <span className="text-xs text-[#ffb4ab] font-bold block mb-0.5">PBV</span>
                <span className="font-mono text-base font-bold text-[#dae3ee] block">
                  {stock.val.pbv}
                </span>
                <span className="text-[11px] text-[#becaba] mt-0.5 block">Peers: {stock.val.pbvPeer}</span>
              </div>

              <div className="bg-[#182028] p-3 rounded-xl border border-[#2d363e]">
                <span className="text-xs text-[#becaba] font-medium block mb-0.5">Div Yield</span>
                <span className="font-mono text-base font-bold text-[#7bdb80] block">
                  {stock.val.div}
                </span>
                <span className="text-[11px] text-[#becaba] mt-0.5 block">Annualized</span>
              </div>

              <div className="bg-[#182028] p-3 rounded-xl border border-[#2d363e]">
                <span className="text-xs text-[#becaba] font-medium block mb-0.5">EV/EBITDA</span>
                <span className="font-mono text-base font-bold text-[#dae3ee] block">
                  {stock.val.ev}
                </span>
                <span className="text-[11px] text-[#becaba] mt-0.5 block">Enterprise Multiple</span>
              </div>
            </div>
          </div>

          {/* History Analisa Terakhir (col-span-4) */}
          <div className="lg:col-span-4 glass-card p-5 flex flex-col">
            <h2 className="font-bold text-sm text-[#dae3ee] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#fabc45]" /> History Analisa Terakhir
            </h2>

            <div className="space-y-2 flex-1">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectStock(item.symbol)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    item.symbol === stock.symbol
                      ? 'bg-[#238636]/20 border-[#7bdb80]/50'
                      : 'bg-[#141c24] border-[#2d363e] hover:border-[#7bdb80]/40'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-[#dae3ee] block">{item.symbol}</span>
                    <span className="text-[10px] text-[#becaba]">{item.date}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                      item.status === 'Bullish' || item.status === 'To the Moon'
                        ? 'bg-[#238636]/20 text-[#7bdb80] border-[#7bdb80]/30'
                        : item.status === 'Berdarah'
                        ? 'bg-[#a00011]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                        : 'bg-[#996c00]/20 text-[#fabc45] border-[#fabc45]/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical & Bandar Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {/* Garis Khayal (Teknikal) */}
          <div className="glass-card p-5">
            <h2 className="font-bold text-lg text-[#dae3ee] mb-3.5 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#899485]" /> Garis Khayal (Teknikal)
            </h2>

            <ul className="space-y-2">
              <li className="flex justify-between items-center bg-[#141c24] p-2.5 rounded-xl border-l-2 border-[#7bdb80]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#7bdb80]" />
                  <span className="text-xs text-[#becaba]">MA Cross (20/50)</span>
                </div>
                <span className="text-xs text-[#7bdb80] font-bold">{stock.tech.ma}</span>
              </li>

              <li className="flex justify-between items-center bg-[#141c24] p-2.5 rounded-xl border-l-2 border-[#7bdb80]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7bdb80]"></span>
                  <span className="text-xs text-[#becaba]">Ichimoku</span>
                </div>
                <span className="text-xs text-[#7bdb80] font-bold">{stock.tech.ichi}</span>
              </li>

              <li className="flex justify-between items-center bg-[#141c24] p-2.5 rounded-xl border-l-2 border-[#7bdb80]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7bdb80]"></span>
                  <span className="text-xs text-[#becaba]">MACD</span>
                </div>
                <span className="text-xs text-[#7bdb80] font-bold">{stock.tech.macd}</span>
              </li>

              <li className="flex justify-between items-center bg-[#141c24] p-2.5 rounded-xl border-l-2 border-[#fabc45]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fabc45]"></span>
                  <span className="text-xs text-[#becaba]">Volatility (ATR)</span>
                </div>
                <span className="text-xs text-[#fabc45] font-bold">{stock.tech.atr}</span>
              </li>

              <li className="flex justify-between items-center bg-[#141c24] p-2.5 rounded-xl border-l-2 border-[#fabc45]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#fabc45]" />
                  <span className="text-xs text-[#becaba]">Risk Level</span>
                </div>
                <span className="text-xs text-[#fabc45] font-bold">{stock.tech.risk}</span>
              </li>
            </ul>
          </div>

          {/* Bandar & Bule Flow */}
          <div className="glass-card p-5">
            <h2 className="font-bold text-lg text-[#dae3ee] mb-3.5 flex items-center gap-2">
              <Waves className="w-5 h-5 text-[#006e23]" /> Bandar &amp; Bule Flow
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="text-xs text-[#becaba] mb-1.5 font-medium">Broker Flow (Top 3)</h3>
                <div className="bg-[#182028] p-3 rounded-xl border border-[#7bdb80]/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-[#2d363e]/50 pb-1.5">
                    <span className="text-[11px] text-[#becaba]">Status</span>
                    <span
                      className={`text-xs font-bold ${
                        stock.flow.status.includes('Accumulation')
                          ? 'text-[#7bdb80]'
                          : 'text-[#ffb4ab]'
                      }`}
                    >
                      {stock.flow.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex gap-1.5">
                      <span className="text-[#7bdb80] font-bold">{stock.flow.buyBroker}</span>
                      <span className="text-[#becaba]">(Buy)</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[#ffb4ab] font-bold">{stock.flow.sellBroker}</span>
                      <span className="text-[#becaba]">(Sell)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs text-[#becaba] mb-1.5 font-medium">Foreign Flow (1 Month)</h3>
                <div className="bg-[#182028] p-3 rounded-xl border border-[#7bdb80]/20 flex justify-between items-center">
                  <span className="text-xs text-[#dae3ee]">Net Foreign</span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      stock.flow.foreign.includes('+') ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {stock.flow.foreign}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs text-[#becaba] mb-1.5 font-medium">
                  Price + Volume + Flow Matrix
                </h3>
                <div className="bg-[#141c24] p-2.5 rounded-xl text-center border-l-4 border-[#7bdb80]">
                  <p className="text-xs font-mono text-[#dae3ee]">
                    {stock.flow.matrix.split('=').length > 1 ? (
                      <>
                        <span>{stock.flow.matrix.split('=')[0]} = </span>
                        <strong className="text-[#7bdb80]">{stock.flow.matrix.split('=')[1]}</strong>
                      </>
                    ) : (
                      stock.flow.matrix
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalysts & Risks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {/* Catalysts */}
          <div className="glass-card p-5 border-t-4 border-t-[#7bdb80]">
            <h2 className="font-bold text-lg text-[#dae3ee] mb-3.5 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#7bdb80]" /> Kenapa bisa To the Moon? (Catalysts)
            </h2>

            <div className="space-y-2.5">
              {stock.catalysts.map((cat, idx) => (
                <div key={idx} className="bg-[#141c24] p-3 rounded-xl border border-[#2d363e]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#dae3ee]">{cat.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        cat.color === 'primary'
                          ? 'bg-[#238636]/20 text-[#7bdb80]'
                          : 'bg-[#996c00]/20 text-[#fabc45]'
                      }`}
                    >
                      {cat.impact}
                    </span>
                  </div>
                  <p className="text-xs text-[#becaba] leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="glass-card p-5 border-t-4 border-t-[#ffb4ab]">
            <h2 className="font-bold text-lg text-[#dae3ee] mb-3.5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" /> Kenapa bisa Ambyar? (Risks)
            </h2>

            <div className="space-y-2.5">
              {stock.risks.map((risk, idx) => (
                <div key={idx} className="bg-[#141c24] p-3 rounded-xl border border-[#2d363e]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#dae3ee]">{risk.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        risk.color === 'error'
                          ? 'bg-[#a00011]/20 text-[#ffb4ab]'
                          : 'bg-[#996c00]/20 text-[#fabc45]'
                      }`}
                    >
                      {risk.impact}
                    </span>
                  </div>
                  <p className="text-xs text-[#becaba] leading-relaxed">{risk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
