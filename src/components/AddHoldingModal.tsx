import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { StockData, PortfolioHolding } from '../types';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (holding: Omit<PortfolioHolding, 'id'>) => void;
  availableStocks: StockData[];
  defaultStock?: StockData;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  availableStocks,
  defaultStock,
}) => {
  const [symbol, setSymbol] = useState<string>(defaultStock ? defaultStock.symbol : 'BBCA');
  const [avgPrice, setAvgPrice] = useState<string>(
    defaultStock ? defaultStock.rawPrice.toString() : '9000'
  );
  const [lots, setLots] = useState<string>('10');
  const [notes, setNotes] = useState<string>('Siap kawal sampe to the moon!');

  if (!isOpen) return null;

  const currentStock = availableStocks.find((s) => s.symbol === symbol) || defaultStock;
  const currentPrice = currentStock ? currentStock.rawPrice : parseInt(avgPrice, 10) || 1000;
  const numAvg = parseInt(avgPrice, 10) || 1;
  const numLots = parseInt(lots, 10) || 1;
  const totalModal = numAvg * numLots * 100;
  const plPercent = ((currentPrice - numAvg) / numAvg) * 100;
  const isProfit = plPercent >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || numAvg <= 0 || numLots <= 0) return;

    const name = currentStock ? currentStock.name : `PT ${symbol} Tbk.`;
    const plLabel = isProfit
      ? `+${plPercent.toFixed(1)}% (Tidur Nyenyak)`
      : `${plPercent.toFixed(1)}% (Nangis di Pojokan)`;

    onAdd({
      symbol: symbol.toUpperCase().trim(),
      name,
      avgPrice: numAvg,
      currentPrice,
      lots: numLots,
      plPercent,
      plLabel,
      isProfit,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#182028] border border-[#30363d] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#becaba] hover:text-[#dae3ee] p-1 rounded-lg hover:bg-[#2d363e]/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#238636]/20 border border-[#7bdb80]/40 flex items-center justify-center text-[#7bdb80]">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#dae3ee]">Kandangin Tiket Baru</h3>
            <p className="text-xs text-[#becaba]">Catat saham yang baru lu beli biar kepantau terus.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stock Symbol Selection */}
          <div>
            <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block mb-1.5">
              Kode Saham (Ticker)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Cth: BBCA, GOTO, TLKM"
                className="flex-1 bg-[#141c24] border border-[#2d363e] rounded-xl py-2 px-3 text-sm font-bold text-[#dae3ee] uppercase focus:outline-none focus:border-[#7bdb80]"
                required
              />
              <select
                onChange={(e) => {
                  setSymbol(e.target.value);
                  const selected = availableStocks.find((s) => s.symbol === e.target.value);
                  if (selected) setAvgPrice(selected.rawPrice.toString());
                }}
                className="bg-[#141c24] border border-[#2d363e] rounded-xl px-2 text-xs text-[#becaba] focus:outline-none focus:border-[#7bdb80]"
              >
                <option value="">Pilih Preset</option>
                {availableStocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} - {s.name.slice(0, 18)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Average Price & Lots */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block mb-1.5">
                Harga Rata-rata (Avg)
              </label>
              <input
                type="number"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                placeholder="8500"
                className="w-full bg-[#141c24] border border-[#2d363e] rounded-xl py-2 px-3 text-sm font-mono text-[#dae3ee] focus:outline-none focus:border-[#7bdb80]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block mb-1.5">
                Jumlah Lot
              </label>
              <input
                type="number"
                value={lots}
                onChange={(e) => setLots(e.target.value)}
                placeholder="10"
                className="w-full bg-[#141c24] border border-[#2d363e] rounded-xl py-2 px-3 text-sm font-mono text-[#dae3ee] focus:outline-none focus:border-[#7bdb80]"
                required
              />
            </div>
          </div>

          {/* Calculation summary */}
          <div className="bg-[#141c24] p-3 rounded-xl border border-[#2d363e] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#becaba]">Total Modal Beli:</span>
              <span className="font-mono font-bold text-[#dae3ee]">
                Rp {totalModal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#becaba]">Estimasi P/L Saat Ini:</span>
              <span
                className={`font-mono font-bold ${
                  isProfit ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                }`}
              >
                {isProfit ? '+' : ''}
                {plPercent.toFixed(1)}% {isProfit ? '🔥' : '💀'}
              </span>
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block mb-1.5">
              Catatan Jamet (Alasan Beli)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cth: Titipan mertua, jangan sampe loss"
              className="w-full bg-[#141c24] border border-[#2d363e] rounded-xl py-2 px-3 text-xs text-[#dae3ee] focus:outline-none focus:border-[#7bdb80]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#238636] hover:bg-[#7bdb80] text-[#f9fff3] hover:text-[#00390e] font-extrabold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[#238636]/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan ke Kandang Portofolio</span>
          </button>
        </form>
      </div>
    </div>
  );
};
