import React, { useState } from 'react';
import { X, Gift, Copy, Check, Sparkles, Tag, CreditCard, ShieldCheck } from 'lucide-react';

export default function OffersModal({ isOpen, onClose }) {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const offers = [
    {
      code: 'ZARA5000',
      title: 'Flat ₹5,000 Instant Discount',
      desc: 'Applicable on iPhone 18 Pro, iPhone 17 Pro Max, and Galaxy S24 Ultra.',
      badge: 'FLAGSHIP EXCLUSIVE',
      expiry: 'Valid till 30 Nov 2026',
    },
    {
      code: 'EXCHANGE8000',
      title: '₹8,000 Extra Exchange Bonus',
      desc: 'Upgrade your existing smartphone and receive additional guaranteed exchange credit.',
      badge: 'TRADE-IN OFFER',
      expiry: 'In-store & Online',
    },
    {
      code: 'HDFCFESTIVE',
      title: 'Instant 10% Bank Cashback',
      desc: 'Up to ₹7,500 on HDFC, ICICI & SBI Credit Cards with No-Cost EMI up to 12 months.',
      badge: 'BANK OFFER',
      expiry: 'All products above ₹20k',
    },
    {
      code: 'FREEKIT',
      title: 'Free 65W Fast Charger & Case',
      desc: 'Complimentary premium 65W GaN adapter and Spigen crystal case with every new phone.',
      badge: 'ACCESSORY COMBO',
      expiry: 'Limited stock',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Orange/Red Gradient */}
        <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <Gift className="w-6 h-6 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
              Exclusive Perks
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Zara Mobiles Offers &amp; Deals
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            Apply active promotional coupons at checkout or present in-store at any of our branches.
          </p>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-gray-100 flex-1">
          {offers.map((offer, idx) => (
            <div key={idx} className="pt-3.5 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-orange-100 text-[#ff5722] rounded-md">
                    {offer.badge}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    {offer.desc}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {offer.expiry}
                  </p>
                </div>

                {/* Coupon Code Pill */}
                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 ${
                    copiedCode === offer.code
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                      : 'bg-orange-50 hover:bg-orange-100 text-[#ff5722] border-orange-200'
                  }`}
                  title="Click to copy coupon code"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{offer.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Guaranteed Official Offers
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
