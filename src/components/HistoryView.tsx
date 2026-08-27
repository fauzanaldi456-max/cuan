import React, { useState } from 'react';
import { History, Search, ArrowUpRight, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectStock: (symbol: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectStock }) => {
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    const matchesText =
      item.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
      item.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesText && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#dae3ee] tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-[#7bdb80]" />
            History Analisa Jamet
          </h2>
          <p className="text-sm text-[#becaba] mt-1">
            Rekam jejak saham yang pernah lu kepoin dan ramal.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#becaba]" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Cari di history..."
              className="w-full bg-[#141c24] border border-[#2d363e] rounded-xl py-1.5 pl-8 pr-3 text-xs text-[#dae3ee] focus:outline-none focus:border-[#7bdb80]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#141c24] border border-[#2d363e] rounded-xl py-1.5 px-3 text-xs text-[#dae3ee] focus:outline-none focus:border-[#7bdb80]"
          >
            <option value="all">Semua Status</option>
            <option value="bullish">Bullish</option>
            <option value="to the moon">To the Moon</option>
            <option value="sideways">Sideways</option>
            <option value="berdarah">Berdarah</option>
          </select>
        </div>
      </div>

      {/* History Table / Card List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#30363d]">
        <div className="divide-y divide-[#2d363e]/60">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectStock(item.symbol)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#1c2128] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#141c24] border border-[#2d363e] flex items-center justify-center font-bold text-sm text-[#7bdb80] shadow-sm">
                    {item.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-[#dae3ee] group-hover:text-[#7bdb80] transition-colors">
                        {item.symbol}
                      </h4>
                      <span className="text-xs text-[#becaba] font-medium hidden sm:inline">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#becaba] font-mono mt-0.5 block">
                      Harga saat scan: <strong className="text-[#dae3ee]">{item.price}</strong> • {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] text-[#becaba] block">Jamet Score</span>
                    <span className="font-mono text-sm font-black text-[#7bdb80]">
                      {item.score}/100
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      item.status === 'Bullish' || item.status === 'To the Moon'
                        ? 'bg-[#238636]/20 text-[#7bdb80] border-[#7bdb80]/30'
                        : item.status === 'Berdarah'
                        ? 'bg-[#a00011]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                        : 'bg-[#996c00]/20 text-[#fabc45] border-[#fabc45]/30'
                    }`}
                  >
                    {item.status}
                  </span>

                  <ArrowUpRight className="w-4 h-4 text-[#becaba] group-hover:text-[#7bdb80] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#becaba]">
              <p className="text-sm">Tidak ada riwayat analisa yang cocok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
