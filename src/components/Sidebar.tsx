import React from 'react';
import { LayoutDashboard, Wallet, History, Settings, LogOut, Sparkles, PlusCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'portfolio' | 'history';
  setActiveTab: (tab: 'dashboard' | 'portfolio' | 'history') => void;
  onOpenTopUp: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  balance: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTopUp,
  onOpenSettings,
  onLogout,
  balance,
}) => {
  return (
    <aside className="bg-[#182028] fixed left-0 top-0 h-full w-64 z-40 border-r border-[#3f4a3d]/30 shadow-2xl flex flex-col p-4 gap-4 hidden md:flex transition-all duration-200 ease-in-out">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-4 mt-2 text-center">
        <div className="relative group cursor-pointer mb-3">
          <img
            alt="Jamet Investor Premium"
            className="w-16 h-16 rounded-full border-2 border-[#7bdb80] object-cover shadow-[0_0_15px_rgba(123,219,128,0.25)] transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMXNDumLUiOaikxBflON4OOeSufeJlXmslyHX75RFYcu0hmBS6K0agB2Vr3UlPBOZ8OmSpfrpbKTro-jI5ymiUNN60j7vV3cTpZ5Iqf02XirOUhmtJu2tRDDcj_0UGS-6jxh6XI6yRFPFyw6uCirEBiYRC3xJ0zJrCW_DazSVCCfudTUaxyU4bnvTjGdnmicxFDvt7srdHHktJXKGySaJosz9PIVeuHrEWYc4xXAYHHw8x-Z1zcxrT"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#238636] text-[#f9fff3] p-1 rounded-full text-[10px] flex items-center justify-center border border-[#0b141c]">
            <Sparkles className="w-3 h-3 text-[#fabc45]" />
          </div>
        </div>
        <h1 className="font-bold text-2xl tracking-tight text-[#7bdb80] leading-none">CuanTerus</h1>
        <p className="text-xs text-[#becaba] mt-1 flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7bdb80] animate-pulse"></span>
          Saham Jamet Member
        </p>

        {/* Quick Buying Power Box */}
        <div className="w-full mt-4 bg-[#141c24] border border-[#2d363e] rounded-xl p-3 text-left">
          <span className="text-[11px] text-[#becaba] uppercase font-bold tracking-wider block">Buying Power</span>
          <span className="font-mono text-sm font-bold text-[#7bdb80] block mt-0.5">
            Rp {balance.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex flex-col gap-1.5 flex-grow">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-left ${
            activeTab === 'dashboard'
              ? 'bg-[#238636] text-[#f9fff3] shadow-lg shadow-[#238636]/30 font-bold'
              : 'text-[#becaba] hover:text-[#dae3ee] hover:bg-[#2d363e]/50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="text-sm">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-left ${
            activeTab === 'portfolio'
              ? 'bg-[#238636] text-[#f9fff3] shadow-lg shadow-[#238636]/30 font-bold'
              : 'text-[#becaba] hover:text-[#dae3ee] hover:bg-[#2d363e]/50'
          }`}
        >
          <Wallet className="w-5 h-5 shrink-0" />
          <span className="text-sm">Portfolio</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-left ${
            activeTab === 'history'
              ? 'bg-[#238636] text-[#f9fff3] shadow-lg shadow-[#238636]/30 font-bold'
              : 'text-[#becaba] hover:text-[#dae3ee] hover:bg-[#2d363e]/50'
          }`}
        >
          <History className="w-5 h-5 shrink-0" />
          <span className="text-sm">History</span>
        </button>
      </div>

      {/* Top Up Modal Button */}
      <button
        onClick={onOpenTopUp}
        className="w-full bg-[#238636] text-[#f9fff3] font-bold text-sm py-3 rounded-xl hover:bg-[#7bdb80] hover:text-[#00390e] transition-all shadow-md shadow-[#238636]/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        Top Up Modal
      </button>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-1 border-t border-[#3f4a3d]/30 pt-3">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-[#becaba] hover:text-[#dae3ee] hover:bg-[#2d363e]/40 transition-colors text-sm font-medium text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors text-sm font-medium text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
