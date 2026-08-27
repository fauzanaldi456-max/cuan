import React, { useState } from 'react';
import { X, Settings, RotateCcw, Volume2, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  const [sarcasmLevel, setSarcasmLevel] = useState<'santai' | 'sedang' | 'savage'>('savage');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoScanOnEnter, setAutoScanOnEnter] = useState<boolean>(true);

  if (!isOpen) return null;

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
          <div className="w-10 h-10 rounded-xl bg-[#222b33] border border-[#3f4a3d] flex items-center justify-center text-[#7bdb80]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#dae3ee]">Pengaturan Jamet</h3>
            <p className="text-xs text-[#becaba]">Sesuaikan tingkat kepedasan analisa dan preferensi.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Sarcasm Level */}
          <div>
            <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#fabc45]" /> Level Sarkasme &amp; Roasting AI
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSarcasmLevel('santai')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  sarcasmLevel === 'santai'
                    ? 'bg-[#238636]/20 border-[#7bdb80] text-[#7bdb80]'
                    : 'bg-[#141c24] border-[#2d363e] text-[#becaba]'
                }`}
              >
                Santai (Sopan)
              </button>
              <button
                type="button"
                onClick={() => setSarcasmLevel('sedang')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  sarcasmLevel === 'sedang'
                    ? 'bg-[#996c00]/20 border-[#fabc45] text-[#fabc45]'
                    : 'bg-[#141c24] border-[#2d363e] text-[#becaba]'
                }`}
              >
                Sedang (Realistis)
              </button>
              <button
                type="button"
                onClick={() => setSarcasmLevel('savage')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  sarcasmLevel === 'savage'
                    ? 'bg-[#a00011]/20 border-[#ffb4ab] text-[#ffb4ab]'
                    : 'bg-[#141c24] border-[#2d363e] text-[#becaba]'
                }`}
              >
                Savage (Jamet Pol)
              </button>
            </div>
            <p className="text-[11px] text-[#becaba] mt-1.5 italic">
              {sarcasmLevel === 'savage'
                ? '🔥 Mode Jamet Pol: Kritik pedas tanpa ampun, bikin sadar sebelum nyangkut di pucuk.'
                : sarcasmLevel === 'sedang'
                ? '⚖️ Mode Sedang: Bahasa gaul pasar modal yang santai tapi tetap berbobot.'
                : '🌱 Mode Santai: Analisa formal mirip laporan sekuritas konvensional.'}
            </p>
          </div>

          {/* Sound & Features */}
          <div className="space-y-2 border-t border-[#2d363e] pt-3">
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-xs font-bold text-[#dae3ee] block">Efek Haptic &amp; Sound</span>
                <span className="text-[10px] text-[#becaba]">Suara denting cuan saat eksekusi scan</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="accent-[#7bdb80] w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-xs font-bold text-[#dae3ee] block">Auto Deep Scan on Enter</span>
                <span className="text-[10px] text-[#becaba]">Langsung scan mendalam saat mengetik ticker</span>
              </div>
              <input
                type="checkbox"
                checked={autoScanOnEnter}
                onChange={(e) => setAutoScanOnEnter(e.target.checked)}
                className="accent-[#7bdb80] w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Reset Factory */}
          <div className="border-t border-[#2d363e] pt-3">
            <button
              onClick={() => {
                if (confirm('Reset ulang seluruh data portofolio dan saldo ke pengaturan awal?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full bg-[#141c24] hover:bg-[#93000a]/20 border border-[#2d363e] hover:border-[#ffb4ab]/40 text-[#ffb4ab] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Portofolio &amp; Saldo</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#238636] hover:bg-[#7bdb80] text-[#f9fff3] hover:text-[#00390e] font-extrabold text-sm py-2.5 rounded-xl transition-all shadow-md mt-5 cursor-pointer"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
};
