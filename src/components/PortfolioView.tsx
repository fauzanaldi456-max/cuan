import React from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowUp, ArrowDown, LineChart, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { PortfolioHolding } from '../types';

interface PortfolioViewProps {
  holdings: PortfolioHolding[];
  balance: number;
  onOpenAddHolding: () => void;
  onSelectStock: (symbol: string) => void;
  onRemoveHolding: (id: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  holdings,
  balance,
  onOpenAddHolding,
  onSelectStock,
  onRemoveHolding,
}) => {
  // Calculate total portfolio value and P/L
  const totalStockValue = holdings.reduce(
    (acc, h) => acc + h.currentPrice * h.lots * 100,
    0
  );
  const totalCostBasis = holdings.reduce(
    (acc, h) => acc + h.avgPrice * h.lots * 100,
    0
  );
  const totalPlAmount = totalStockValue - totalCostBasis;
  const totalPlPercent = totalCostBasis > 0 ? (totalPlAmount / totalCostBasis) * 100 : 0;
  const totalPortfolioAndCash = totalStockValue + balance;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#dae3ee] tracking-tight">
            Kandang Portofolio (Biar Gak Lepas)
          </h2>
          <p className="text-sm text-[#becaba] mt-1">
            Pantau terus duit lu, mumpung belum nyangkut di pucuk.
          </p>
        </div>

        <button
          onClick={onOpenAddHolding}
          className="bg-[#238636] text-[#f9fff3] hover:bg-[#7bdb80] hover:text-[#00390e] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#238636]/30 flex items-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Tiket Cuan</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border border-[#30363d]/80">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <TrendingUp className="w-32 h-32 text-[#7bdb80]" />
        </div>

        <p className="text-xs font-bold text-[#becaba] uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>Total Cuan / Bonyok</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#182028] text-[#7bdb80] border border-[#2d363e]">
            {holdings.length} Tiket Aktif
          </span>
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          <h3 className="text-3xl md:text-5xl font-black text-[#7bdb80] font-mono tracking-tight drop-shadow-[0_0_15px_rgba(123,219,128,0.3)]">
            Rp {totalStockValue.toLocaleString('id-ID')}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-bold flex items-center gap-1 px-3 py-1 rounded-lg border font-mono ${
                totalPlPercent >= 0
                  ? 'bg-[#238636]/20 text-[#7bdb80] border-[#7bdb80]/30'
                  : 'bg-[#a00011]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
              }`}
            >
              {totalPlPercent >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {totalPlPercent >= 0 ? '+' : ''}
              {totalPlPercent.toFixed(1)}% {totalPlPercent >= 15 ? '(Auto Sultan)' : totalPlPercent >= 0 ? '(Cuan Tipis)' : '(Bonyok Parah)'}
            </span>

            <span className="text-xs text-[#becaba] font-medium hidden md:inline">
              (Total Aset + Cash: Rp {totalPortfolioAndCash.toLocaleString('id-ID')})
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {holdings.map((holding) => {
          const isProfit = holding.currentPrice >= holding.avgPrice;
          const plVal = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
          const totalValue = holding.currentPrice * holding.lots * 100;

          return (
            <div
              key={holding.id}
              className={`glass-panel rounded-2xl p-5 flex flex-col hover:bg-[#1c2128]/70 transition-all border-l-4 ${
                isProfit ? 'border-l-[#7bdb80]' : 'border-l-[#ffb4ab]'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl md:text-2xl font-black text-[#dae3ee] tracking-tight">
                      {holding.symbol}
                    </h4>
                    <span className="text-xs text-[#becaba] font-mono">
                      ({holding.lots} Lot)
                    </span>
                  </div>
                  <p className="text-xs text-[#becaba] mt-0.5">{holding.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#222b33] text-[#dae3ee] px-3 py-1 rounded-full text-xs font-mono font-semibold border border-[#3f4a3d]/50">
                    Avg: {holding.avgPrice.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => onRemoveHolding(holding.id)}
                    className="text-[#becaba] hover:text-[#ffb4ab] p-1 rounded hover:bg-[#93000a]/20 transition-colors"
                    title="Jual / Hapus Tiket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Price & P/L Row */}
              <div className="flex justify-between items-end mb-5">
                <div>
                  <p className="text-xs text-[#becaba] mb-0.5">Current Price</p>
                  <p className="text-xl font-extrabold font-mono text-[#dae3ee]">
                    {holding.currentPrice.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-[#becaba] font-mono mt-0.5">
                    Nilai: Rp {totalValue.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#becaba] mb-0.5">P/L</p>
                  <p
                    className={`text-base md:text-lg font-bold font-mono ${
                      isProfit ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                    }`}
                  >
                    {holding.plLabel || `${isProfit ? '+' : ''}${plVal.toFixed(1)}%`}
                  </p>
                </div>
              </div>

              {/* Notes if any */}
              {holding.notes && (
                <div className="mb-4 text-xs text-[#becaba] italic bg-[#141c24] p-2.5 rounded-lg border border-[#2d363e]">
                  "{holding.notes}"
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onSelectStock(holding.symbol)}
                className="mt-auto w-full bg-transparent border border-[#3f4a3d] text-[#dae3ee] hover:text-[#7bdb80] hover:border-[#7bdb80] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#182028] transition-all flex justify-center items-center gap-2 group cursor-pointer"
              >
                <span>Analisa Sekarang</span>
                <LineChart className="w-4 h-4 text-[#7bdb80] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}

        {/* Empty Slot Card */}
        <div
          onClick={onOpenAddHolding}
          className="glass-panel rounded-2xl p-6 flex flex-col justify-center items-center border-dashed border-2 border-[#3f4a3d]/60 hover:border-[#7bdb80] transition-all cursor-pointer min-h-[220px] group opacity-75 hover:opacity-100 text-center"
        >
          <div className="bg-[#222b33] p-4 rounded-full mb-3 group-hover:bg-[#238636]/20 transition-colors">
            <Plus className="w-7 h-7 text-[#becaba] group-hover:text-[#7bdb80] transition-colors" />
          </div>
          <p className="font-bold text-base text-[#dae3ee]">Masih Ada Slot</p>
          <p className="text-xs text-[#becaba] mt-1 max-w-xs">
            Jangan biarkan modal nganggur bosku. Tambah tiket baru buat nyerok cuan.
          </p>
        </div>
      </div>
    </div>
  );
};
