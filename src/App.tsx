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
  INITIAL_NOTIFICATIONS,
  generateJametStock,
} from './data/stocks';
import { StockData, PortfolioHolding, HistoryItem, MarketNotification } from './types';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';
import api from './services/data';
import './services/webhook-client'; // Initialize webhook listeners

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'history'>('dashboard');
  const [stocksMap, setStocksMap] = useState<Record<string, StockData>>(INITIAL_STOCKS);
  const [currentSymbol, setCurrentSymbol] = useState<string>('BBCA');
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [notifications, setNotifications] = useState<MarketNotification[]>(INITIAL_NOTIFICATIONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'cuan' | 'info' | 'gas' } | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load balance
      const balanceRes = await api.balance.get();
      if (balanceRes.success && balanceRes.data) {
        setBalance(balanceRes.data.balance);
      }

      // Load holdings
      const holdingsRes = await api.holdings.getAll();
      if (holdingsRes.success && holdingsRes.data) {
        setHoldings(holdingsRes.data);
      }

      // Load history
      const historyRes = await api.history.getAll();
      if (historyRes.success && historyRes.data) {
        setHistory(historyRes.data);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Failed to load data from server');
      setLoading(false);
      showToast(
        '⚠️ Connection Error',
        'Could not connect to backend. Using offline mode.',
        'info'
      );
    }
  };

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
  const handleSelectStock = async (symbol: string) => {
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
    
    try {
      const response = await api.history.create({
        symbol: cleanSym,
        name: targetStock.name,
        price: targetStock.rawPrice,
        score: targetStock.scores.total,
        verdict: targetStock.scores.verdict,
        status: targetStock.scores.verdict === 'BULLISH' ? 'Bullish' : targetStock.scores.verdict === 'TO THE MOON' ? 'To the Moon' : targetStock.scores.verdict === 'BERDARAH' ? 'Berdarah' : 'Sideways',
      });

      if (response.success && response.data) {
        // Reload history from API
        const historyRes = await api.history.getAll();
        if (historyRes.success && historyRes.data) {
          setHistory(historyRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to add to history:', err);
    }
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
  const handleTopUpSuccess = async (amount: number, method: string) => {
    try {
      const response = await api.balance.topUp(amount, method);
      
      if (response.success && response.data) {
        setBalance(response.data.newBalance);
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
      }
    } catch (err: any) {
      showToast(
        '❌ Top Up Gagal',
        err.message || 'Terjadi kesalahan saat top up',
        'info'
      );
    }
  };

  // Handle Add Holding
  const handleAddHolding = async (holdingData: Omit<PortfolioHolding, 'id'>) => {
    try {
      const response = await api.holdings.create({
        symbol: holdingData.symbol,
        name: holdingData.name,
        avgPrice: holdingData.avgPrice,
        currentPrice: holdingData.currentPrice,
        lots: holdingData.lots,
        notes: holdingData.notes,
      });

      if (response.success && response.data) {
        // Reload holdings from API
        const holdingsRes = await api.holdings.getAll();
        if (holdingsRes.success && holdingsRes.data) {
          setHoldings(holdingsRes.data);
        }

        showToast(
          `📥 ${holdingData.symbol} Masuk Kandang!`,
          `Berhasil mencatat ${holdingData.lots} lot pada harga avg ${holdingData.avgPrice.toLocaleString('id-ID')}.`,
          'cuan'
        );
      }
    } catch (err: any) {
      showToast(
        '❌ Gagal Menambahkan',
        err.message || 'Terjadi kesalahan saat menambahkan holding',
        'info'
      );
    }
  };

  // Handle Remove Holding
  const handleRemoveHolding = async (id: string) => {
    const target = holdings.find((h) => h.id === id);
    
    try {
      const response = await api.holdings.delete(id);
      
      if (response.success) {
        // Reload holdings from API
        const holdingsRes = await api.holdings.getAll();
        if (holdingsRes.success && holdingsRes.data) {
          setHoldings(holdingsRes.data);
        }

        if (target) {
          showToast(
            `🗑️ Tiket ${target.symbol} Dilepas`,
            `Saham ${target.symbol} dikeluarkan dari kandang portofolio.`,
            'info'
          );
        }
      }
    } catch (err: any) {
      showToast(
        '❌ Gagal Menghapus',
        err.message || 'Terjadi kesalahan saat menghapus holding',
        'info'
      );
    }
  };

  // Reset Data
  const handleResetData = async () => {
    try {
      const response = await api.settings.reset();
      
      if (response.success) {
        // Reload all data
        await loadInitialData();
        
        showToast('🔄 Reset Sukses', 'Semua data telah dikembalikan ke kondisi default pabrik.', 'info');
      }
    } catch (err: any) {
      showToast(
        '❌ Reset Gagal',
        err.message || 'Terjadi kesalahan saat reset data',
        'info'
      );
    }
  };

  const availableStocksList = Object.values(stocksMap);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-[#0b141c] text-[#dae3ee] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7bdb80] mx-auto mb-4"></div>
          <p className="text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

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
