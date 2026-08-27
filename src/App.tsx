import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { PortfolioView } from './components/PortfolioView';
import { HistoryView } from './components/HistoryView';
import { TopUpModal } from './components/TopUpModal';
import { AddHoldingModal } from './components/AddHoldingModal';
import { SettingsModal } from './components/SettingsModal';
import {
  INITIAL_STOCKS,
  INITIAL_HOLDINGS,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS,
  generateJametStock,
} from './data/stocks';
import { StockData, PortfolioHolding, HistoryItem, MarketNotification } from './types';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'history'>('dashboard');
  const [stocksMap, setStocksMap] = useState<Record<string, StockData>>(INITIAL_STOCKS);
  const [currentSymbol, setCurrentSymbol] = useState<string>('BBCA');
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('cuanterus_holdings');
    return saved ? JSON.parse(saved) : INITIAL_HOLDINGS;
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('cuanterus_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('cuanterus_balance');
    return saved ? JSON.parse(saved) : 45230000;
  });
  const [notifications, setNotifications] = useState<MarketNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'cuan' | 'info' | 'gas' } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('cuanterus_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('cuanterus_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('cuanterus_balance', JSON.stringify(balance));
  }, [balance]);

  // Show auto-dismiss toast
  const showToast = (title: string, desc: string, type: 'cuan' | 'info' | 'gas' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Get current stock
  const currentStock = stocksMap[currentSymbol] || generateJametStock(currentSymbol);

  // Handle Search / Select Stock
  const handleSelectStock = (symbol: string) => {
    const cleanSym = symbol.toUpperCase().trim();
    if (!cleanSym) return;

    if (!stocksMap[cleanSym]) {
      const generated = generateJametStock(cleanSym);
      setStocksMap((prev) => ({ ...prev, [cleanSym]: generated }));
    }

    setCurrentSymbol(cleanSym);
    setActiveTab('dashboard');

    // Add to history if not existing recently
    const targetStock = stocksMap[cleanSym] || generateJametStock(cleanSym);
    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      symbol: cleanSym,
      name: targetStock.name,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      price: targetStock.price,
      score: targetStock.scores.total,
      status: targetStock.scores.verdict === 'BULLISH' ? 'Bullish' : targetStock.scores.verdict === 'TO THE MOON' ? 'To the Moon' : targetStock.scores.verdict === 'BERDARAH' ? 'Berdarah' : 'Sideways',
      color: targetStock.scores.total >= 70 ? 'primary' : targetStock.scores.total >= 50 ? 'tertiary' : 'error',
    };

    setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.symbol !== cleanSym)]);
  };

  // Handle GAS! AI Scan
  const handleGasScan = () => {
    showToast(
      `🚀 GAS! Deep AI Scan: ${currentStock.symbol}`,
      `Jamet Score ${currentStock.scores.total}/100 (${currentStock.scores.verdict}). ${currentStock.insight.slice(0, 80)}...`,
      'gas'
    );
  };

  // Handle Top Up
  const handleTopUpSuccess = (amount: number, method: string) => {
    setBalance((prev) => prev + amount);
    showToast(
      '💰 Top Up Sukses Bosku!',
      `Saldo RDN bertambah +Rp ${amount.toLocaleString('id-ID')} via ${method}. Siap serok bawah!`,
      'cuan'
    );

    // Add notification
    const newNotif: MarketNotification = {
      id: `notif-${Date.now()}`,
      time: 'Baru saja',
      title: 'Top Up Berhasil',
      message: `Dana masuk Rp ${amount.toLocaleString('id-ID')} siap dipakai belanja saham.`,
      type: 'cuan',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle Add Holding
  const handleAddHolding = (holdingData: Omit<PortfolioHolding, 'id'>) => {
    const newHolding: PortfolioHolding = {
      ...holdingData,
      id: `hold-${Date.now()}`,
    };
    setHoldings((prev) => [newHolding, ...prev]);
    showToast(
      `📥 ${newHolding.symbol} Masuk Kandang!`,
      `Berhasil mencatat ${newHolding.lots} lot pada harga avg ${newHolding.avgPrice.toLocaleString('id-ID')}.`,
      'cuan'
    );
  };

  // Handle Remove Holding
  const handleRemoveHolding = (id: string) => {
    const target = holdings.find((h) => h.id === id);
    setHoldings((prev) => prev.filter((h) => h.id !== id));
    if (target) {
      showToast(
        `🗑️ Tiket ${target.symbol} Dilepas`,
        `Saham ${target.symbol} dikeluarkan dari kandang portofolio.`,
        'info'
      );
    }
  };

  // Reset Data
  const handleResetData = () => {
    setHoldings(INITIAL_HOLDINGS);
    setHistory(INITIAL_HISTORY);
    setBalance(45230000);
    setStocksMap(INITIAL_STOCKS);
    setCurrentSymbol('BBCA');
    showToast('🔄 Reset Sukses', 'Semua data telah dikembalikan ke kondisi default pabrik.', 'info');
  };

  const availableStocksList = Object.values(stocksMap);

  return (
    <div className="bg-[#0b141c] text-[#dae3ee] min-h-screen flex antialiased selection:bg-[#238636] selection:text-[#f9fff3]">
      {/* Left Sidebar for Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={() => {
          showToast('👋 Sesi Ditutup', 'Sampai jumpa di pasar modal besok pagi bosku!', 'info');
        }}
        balance={balance}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Sticky Top Header */}
        <TopBar
          onSearch={handleSelectStock}
          onGasScan={handleGasScan}
          notifications={notifications}
          balance={balance}
          onOpenTopUp={() => setIsTopUpOpen(true)}
          availableStocks={availableStocksList}
          currentStock={currentStock}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8 pb-24">
          {activeTab === 'dashboard' && (
            <DashboardView
              stock={currentStock}
              history={history}
              onSelectStock={handleSelectStock}
              onAddToPortfolio={(stock) => {
                setIsAddHoldingOpen(true);
              }}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView
              holdings={holdings}
              balance={balance}
              onOpenAddHolding={() => setIsAddHoldingOpen(true)}
              onSelectStock={handleSelectStock}
              onRemoveHolding={handleRemoveHolding}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={history}
              onSelectStock={handleSelectStock}
            />
          )}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#182028] border border-[#7bdb80]/50 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-slide-up flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              toastMessage.type === 'cuan'
                ? 'bg-[#238636]/20 text-[#7bdb80]'
                : toastMessage.type === 'gas'
                ? 'bg-[#996c00]/20 text-[#fabc45]'
                : 'bg-[#222b33] text-[#dae3ee]'
            }`}
          >
            {toastMessage.type === 'cuan' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : toastMessage.type === 'gas' ? (
              <Zap className="w-5 h-5 text-[#fabc45]" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#7bdb80]" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#dae3ee]">{toastMessage.title}</h4>
            <p className="text-xs text-[#becaba] mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#becaba] hover:text-[#dae3ee] text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modals */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
      />

      <AddHoldingModal
        isOpen={isAddHoldingOpen}
        onClose={() => setIsAddHoldingOpen(false)}
        onAdd={handleAddHolding}
        availableStocks={availableStocksList}
        defaultStock={currentStock}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
      />
    </div>
  );
}
