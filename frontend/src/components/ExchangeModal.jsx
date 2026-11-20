import React, { useState } from 'react';
import { X, ArrowLeftRight, CheckCircle2, Smartphone, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

export default function ExchangeModal({ isOpen, onClose }) {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 13');
  const [storage, setStorage] = useState('128GB');
  const [condition, setCondition] = useState('Flawless');

  if (!isOpen) return null;

  // Base valuation matrix
  const brandModels = {
    Apple: ['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12', 'iPhone 11'],
    Samsung: ['Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S21 FE', 'Galaxy A54', 'Galaxy Note 20 Ultra'],
    OnePlus: ['OnePlus 11 5G', 'OnePlus 10 Pro', 'OnePlus 9 Pro', 'OnePlus Nord 3', 'OnePlus 11R'],
    Xiaomi: ['Xiaomi 13 Pro', 'Redmi Note 12 Pro+', 'Redmi Note 11 Pro', 'Xiaomi 12 Pro'],
  };

  const calculateEstimate = () => {
    let base = 20000;
    if (brand === 'Apple') {
      if (model.includes('14 Pro')) base = 52000;
      else if (model.includes('14')) base = 38000;
      else if (model.includes('13 Pro')) base = 42000;
      else if (model.includes('13')) base = 28000;
      else if (model.includes('12')) base = 20000;
      else base = 14000;
    } else if (brand === 'Samsung') {
      if (model.includes('S23 Ultra')) base = 54000;
      else if (model.includes('S23')) base = 34000;
      else if (model.includes('S22')) base = 26000;
      else base = 16000;
    } else if (brand === 'OnePlus') {
      if (model.includes('11 5G')) base = 30000;
      else if (model.includes('11R')) base = 22000;
      else base = 15000;
    } else {
      base = 12000;
    }

    if (storage === '256GB') base += 2500;
    if (storage === '512GB') base += 5000;

    if (condition === 'Flawless') base *= 1.0;
    else if (condition === 'Good') base *= 0.85;
    else base *= 0.65;

    return Math.round(base);
  };

  const estimatedValue = calculateEstimate();
  const bonus = 4000;
  const totalValue = estimatedValue + bonus;

  const handleWhatsAppExchange = (num = '6379367629') => {
    const text = encodeURIComponent(
      `Hi Zara Mobiles! I want to exchange my old phone:\n- Brand: ${brand}\n- Model: ${model}\n- Storage: ${storage}\n- Condition: ${condition}\nEstimated Value with Bonus: ₹${totalValue.toLocaleString('en-IN')}.\nPlease guide me with the trade-in process.`
    );
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Orange/Red Gradient */}
        <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
              Instant Valuation
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Upgrade with Zara Mobiles Exchange
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Trade in your old phone for instant store credit or door-step pickup.
          </p>
        </div>

        {/* Calculator Form */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Brand Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Your Old Device Brand
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Apple', 'Samsung', 'OnePlus', 'Xiaomi'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setModel(brandModels[b][0]);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    brand === b
                      ? 'bg-orange-50 border-[#ff5722] text-[#ff5722] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
            >
              {(brandModels[brand] || []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Capacity */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Storage Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['64GB', '128GB', '256GB', '512GB'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStorage(s)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                    storage === s
                      ? 'bg-orange-50 border-[#ff5722] text-[#ff5722]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Device Condition */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Device Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Flawless', sub: 'Zero scratches' },
                { label: 'Good', sub: 'Minor wear' },
                { label: 'Fair', sub: 'Visible marks' },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCondition(c.label)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    condition === c.label
                      ? 'bg-orange-50 border-[#ff5722] text-[#ff5722]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-xs font-bold">{c.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{c.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Valuation Result Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/80">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-medium text-gray-600">Base Device Quote:</span>
              <span className="text-sm font-bold text-gray-800">₹{estimatedValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-baseline mt-1 text-[#ff5722]">
              <span className="text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Zara Exchange Bonus:
              </span>
              <span className="text-sm font-extrabold">+₹{bonus.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-orange-200 my-2 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-gray-900">Total Exchange Value:</span>
              <span className="text-xl font-black text-[#ff5722]">
                ₹{totalValue.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              * Final value determined following rapid physical inspection at our stores or home pickup.
            </p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleWhatsAppExchange('6379367629')}
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              Claim via WhatsApp 1
            </button>
            <button
              onClick={() => handleWhatsAppExchange('6385533138')}
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              Claim via WhatsApp 2
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
