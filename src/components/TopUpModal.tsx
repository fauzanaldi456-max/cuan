import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Wallet, Sparkles, CreditCard, Banknote } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, method: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(10000000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('bca');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const presets = [
    { label: 'Uang Jajan', amount: 1000000, desc: 'Buat scalping saham receh' },
    { label: 'Nyerok Bawah', amount: 5000000, desc: 'Amunisi pas market koreksi' },
    { label: 'Paket Sultan', amount: 10000000, desc: 'Siap borong bluechip' },
    { label: 'Bandar Mode', amount: 50000000, desc: 'Goyang saham lapis tiga' },
  ];

  const methods = [
    { id: 'bca', name: 'Transfer BCA Sultan', fee: 'Gratis', icon: '🏦' },
    { id: 'gopay', name: 'GoPay / QRIS Kilat', fee: 'Gratis', icon: '⚡' },
    { id: 'ginjal', name: 'Jual Ginjal Online (Instan)', fee: 'Rugi Jiwa', icon: '🫘' },
    { id: 'ngemis', name: 'Ngemis di Grup Telegram Saham', fee: 'Harga Diri 0%', icon: '🙏' },
  ];

  const handleConfirm = () => {
    const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) || selectedAmount : selectedAmount;
    if (finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(finalAmount, methods.find((m) => m.id === selectedMethod)?.name || 'Transfer');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#182028] border border-[#30363d] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#becaba] hover:text-[#dae3ee] p-1 rounded-lg hover:bg-[#2d363e]/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#238636]/20 border border-[#7bdb80]/40 flex items-center justify-center text-[#7bdb80]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#dae3ee]">Top Up Modal Nyerok</h3>
            <p className="text-xs text-[#becaba]">Isi saldo RDN biar gak kalah cepet ama bandar.</p>
          </div>
        </div>

        {/* Amount Presets */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block">
            Pilih Nominal Amunisi
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map((p) => (
              <button
                key={p.amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(p.amount);
                  setCustomAmount('');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedAmount === p.amount && !customAmount
                    ? 'bg-[#238636]/20 border-[#7bdb80] text-[#7bdb80] shadow-md'
                    : 'bg-[#141c24] border-[#2d363e] text-[#dae3ee] hover:border-[#7bdb80]/40'
                }`}
              >
                <span className="font-bold text-xs block">{p.label}</span>
                <span className="font-mono text-sm font-extrabold block mt-0.5">
                  Rp {(p.amount / 1000000).toFixed(0)} Juta
                </span>
                <span className="text-[10px] text-[#becaba] block mt-0.5">{p.desc}</span>
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Atau ketik nominal custom..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-[#141c24] border border-[#2d363e] rounded-xl py-2 px-3 text-xs text-[#dae3ee] focus:outline-none focus:border-[#7bdb80] font-mono"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-[#becaba] uppercase tracking-wider block">
            Metode Top Up
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {methods.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === m.id
                    ? 'bg-[#238636]/20 border-[#7bdb80] text-[#dae3ee]'
                    : 'bg-[#141c24] border-[#2d363e] text-[#becaba] hover:border-[#7bdb80]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-xs font-semibold text-[#dae3ee]">{m.name}</span>
                </div>
                <span className="text-[10px] font-mono text-[#7bdb80]">{m.fee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full bg-[#238636] hover:bg-[#7bdb80] text-[#f9fff3] hover:text-[#00390e] font-extrabold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[#238636]/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-[#fabc45]" />
              <span>Memproses Duit Gaib...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Gas Top Up Sekarang!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
