import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ShieldCheck, Truck, RefreshCw, CreditCard, Store } from 'lucide-react';

export default function FaqsModal({ isOpen, onClose }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Are all smartphones sold on ZARA MOBILES 100% genuine?',
      a: 'Yes, absolutely. Every device in our catalog is guaranteed 100% authentic. Brand New units are factory-sealed with official manufacturer warranties, while Certified Demo units undergo our rigorous 45-point hardware and battery health inspection.',
      icon: ShieldCheck,
    },
    {
      q: 'What does "DEMO" condition mean and what is the battery health?',
      a: 'Demo units are showroom-grade, unboxed or display devices in flawless physical condition. Every demo unit clearly displays its certified battery health percentage (typically 90% to 100%) and includes our 3-Month Store Warranty with replacement guarantee.',
      icon: RefreshCw,
    },
    {
      q: 'How does Physical Store Pickup work?',
      a: 'You can choose "Store Pickup" at checkout, select your nearest Zara Mobiles branch (Indiranagar Bengaluru, Bandra West Mumbai, Connaught Place Delhi, or T. Nagar Chennai), and collect your order within 2 hours with free unboxing and data transfer support.',
      icon: Store,
    },
    {
      q: 'What payment methods are supported?',
      a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Netbanking, and No-Cost EMI up to 12 months powered securely via Razorpay.',
      icon: CreditCard,
    },
    {
      q: 'What is the delivery timeline for Home Delivery orders?',
      a: 'Metro areas receive same-day or next-day express delivery. Other PIN codes across India are fulfilled within 2 to 4 business days via insured express courier partners with live order tracking.',
      icon: Truck,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
              <HelpCircle className="w-5 h-5 text-white" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
              Customer Helpdesk
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Everything you need to know about warranties, demo units, store pickup &amp; delivery.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {faqs.map((faq, idx) => {
            const Icon = faq.icon;
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-orange-50 text-[#ff5722] flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#ff5722]' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Have more questions? WhatsApp us 24/7.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
