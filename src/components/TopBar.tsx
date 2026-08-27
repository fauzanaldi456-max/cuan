import React, { useState, useRef, useEffect } from 'react';
import { Rocket, Search, Zap, Bell, Wallet, Sparkles, TrendingUp, Check } from 'lucide-react';
import { StockData, MarketNotification } from '../types';

interface TopBarProps {
  onSearch: (symbol: string) => void;
  onGasScan: () => void;
  notifications: MarketNotification[];
  balance: number;
  onOpenTopUp: () => void;
  availableStocks: StockData[];
  currentStock: StockData;
  activeTab: 'dashboard' | 'portfolio' | 'history';
  setActiveTab: (tab: 'dashboard' | 'portfolio' | 'history') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearch,
  onGasScan,
  notifications,
  balance,
  onOpenTopUp,
  availableStocks,
  currentStock,
  activeTab,
  setActiveTab,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [isGasScanning, setIsGasScanning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Filter tickers based on search
  const filteredStocks = availableStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      s.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim().toUpperCase());
      setShowDropdown(false);
    }
  };

  const handleSelectStock = (symbol: string) => {
    setSearchValue('');
    onSearch(symbol);
    setShowDropdown(false);
  };

  const handleGasClick = () => {
    setIsGasScanning(true);
    onGasScan();
    setTimeout(() => {
      setIsGasScanning(false);
    }, 1200);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#0b141c]/80 backdrop-blur-md border-b border-[#2d363e] sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-8 max-w-[1440px] mx-auto w-full">
      {/* Brand & Mobile Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#238636]/20 border border-[#7bdb80]/30 flex items-center justify-center text-[#7bdb80] shadow-[0_0_12px_rgba(123,219,128,0.2)]">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#7bdb80] italic">
            CuanTerus <span className="text-[#dae3ee] font-extrabold not-italic text-sm md:text-base">Bosku</span>
          </span>
        </button>

        {/* Mobile Navigation Pills */}
        <div className="flex md:hidden items-center gap-1 bg-[#141c24] p-1 rounded-xl border border-[#2d363e]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'dashboard' ? 'bg-[#238636] text-[#f9fff3]' : 'text-[#becaba]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'portfolio' ? 'bg-[#238636] text-[#f9fff3]' : 'text-[#becaba]'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'history' ? 'bg-[#238636] text-[#f9fff3]' : 'text-[#becaba]'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Center Search Bar with Dropdown */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6 relative" ref={dropdownRef}>
        <form onSubmit={handleSubmitSearch} className="w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#becaba]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Cari tiket ke bulan (Cth: BBCA, GOTO, ASII, ADRO, BREN)..."
            className="w-full bg-[#141c24] border border-[#2d363e] rounded-full py-2 pl-10 pr-10 text-sm text-[#dae3ee] focus:outline-none focus:border-[#7bdb80] focus:ring-1 focus:ring-[#7bdb80] transition-colors placeholder-[#becaba]/50"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#becaba] hover:text-[#dae3ee] bg-[#2d363e] rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </form>

        {/* Live Search Suggestion Box */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#182028] border border-[#2d363e] rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-[#2d363e]/60 text-[11px] text-[#becaba] font-bold flex justify-between uppercase tracking-wider">
              <span>Rekomendasi Saham Jamet</span>
              <span className="text-[#7bdb80]">Tekan Enter untuk scan custom</span>
            </div>

            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock.symbol)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-[#2d363e]/60 transition-colors text-left border-b border-[#2d363e]/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#141c24] border border-[#2d363e] flex items-center justify-center font-bold text-xs text-[#7bdb80]">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#dae3ee]">{stock.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2d363e] text-[#becaba]">
                          {stock.sector}
                        </span>
                      </div>
                      <span className="text-xs text-[#becaba] truncate max-w-[200px] block">
                        {stock.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[#dae3ee] block">
                      {stock.price}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        stock.isUp ? 'text-[#7bdb80]' : 'text-[#ffb4ab]'
                      }`}
                    >
                      {stock.changeStr} {stock.percentStr}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-[#becaba]">
                  Saham <strong className="text-[#7bdb80]">{searchValue.toUpperCase()}</strong> belum ada di list preset.
                </p>
                <button
                  onClick={() => handleSelectStock(searchValue.toUpperCase())}
                  className="mt-2 text-xs bg-[#238636] text-[#f9fff3] px-3 py-1.5 rounded-lg font-bold hover:bg-[#7bdb80] hover:text-[#00390e] transition-colors"
                >
                  Scan AI Jamet untuk {searchValue.toUpperCase()} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* GAS! Button */}
        <button
          onClick={handleGasClick}
          disabled={isGasScanning}
          className={`bg-[#238636] text-[#f9fff3] hover:bg-[#7bdb80] hover:text-[#00390e] transition-all duration-200 px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-[#238636]/30 active:scale-95 cursor-pointer ${
            isGasScanning ? 'animate-pulse opacity-80' : ''
          }`}
          title="Jalankan Deep Scan AI Saham Jamet"
        >
          <Zap className={`w-3.5 h-3.5 ${isGasScanning ? 'animate-bounce text-[#fabc45]' : ''}`} />
          <span>{isGasScanning ? 'SCANNING...' : 'GAS!'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="text-[#becaba] hover:text-[#dae3ee] hover:bg-[#2d363e]/60 transition-colors p-2 rounded-full relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 bg-[#ffb4ab] rounded-full absolute top-1.5 right-1.5 ring-2 ring-[#0b141c] animate-ping"></span>
            <span className="w-2 h-2 bg-[#ffb4ab] rounded-full absolute top-1.5 right-1.5 ring-2 ring-[#0b141c]"></span>
          </button>

          {/* Notif Popover */}
          {showNotifPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-[#182028] border border-[#2d363e] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-[#2d363e] flex justify-between items-center bg-[#141c24]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#fabc45]" />
                  <span className="font-bold text-xs text-[#dae3ee]">Bisikan Bandar & Bule</span>
                </div>
                <span className="text-[10px] bg-[#238636]/30 text-[#7bdb80] px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#2d363e]/40">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.symbol) onSearch(n.symbol);
                      setShowNotifPopover(false);
                    }}
                    className="p-3 hover:bg-[#2d363e]/40 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-[#dae3ee]">{n.title}</span>
                      <span className="text-[10px] text-[#becaba]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#becaba] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Quick Button */}
        <button
          onClick={onOpenTopUp}
          className="text-[#becaba] hover:text-[#7bdb80] hover:bg-[#2d363e]/60 transition-colors p-2 rounded-full flex items-center gap-1.5 cursor-pointer"
          title={`Buying Power: Rp ${balance.toLocaleString('id-ID')}`}
        >
          <Wallet className="w-5 h-5 text-[#7bdb80]" />
          <span className="hidden lg:inline text-xs font-mono font-bold text-[#7bdb80]">
            Rp {(balance / 1000000).toFixed(1)}M
          </span>
        </button>
      </div>
    </header>
  );
};
