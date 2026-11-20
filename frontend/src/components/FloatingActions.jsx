import React, { useState } from 'react';
import { MessageCircle, Instagram, X, PhoneCall } from 'lucide-react';

export default function FloatingActions({ onOpenInstagram, onOpenWhatsApp }) {
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);

  const phone1 = "6379367629";
  const phone2 = "6385533138";

  const handleOpenWA = (number) => {
    const message = encodeURIComponent("Hello ZARA MOBILES, I would like to inquire about smartphone availability, offers, and delivery.");
    window.open(`https://wa.me/91${number}?text=${message}`, '_blank');
    setShowWhatsAppMenu(false);
  };

  return (
    <div className="fixed right-3.5 bottom-20 md:bottom-6 flex flex-col gap-2.5 z-40 items-center">
      {/* WhatsApp Numbers Popup Menu */}
      {showWhatsAppMenu && (
        <div 
          className="absolute right-0 bottom-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
              Select WhatsApp Line
            </span>
            <button 
              onClick={() => setShowWhatsAppMenu(false)}
              className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {/* WhatsApp Line 1 */}
            <button
              onClick={() => handleOpenWA(phone1)}
              className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Line 1: +91 63793 67629</span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                Chat
              </span>
            </button>

            {/* WhatsApp Line 2 */}
            <button
              onClick={() => handleOpenWA(phone2)}
              className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Line 2: +91 63855 33138</span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                Chat
              </span>
            </button>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
            Direct 24/7 Zara Mobiles WhatsApp Support
          </p>
        </div>
      )}

      {/* Instagram Floating Button */}
      <button
        onClick={onOpenInstagram}
        aria-label="Follow on Instagram"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg hover:shadow-pink-500/30 hover:scale-110 active:scale-95 transition-all duration-200 group"
        title="Follow Zara Mobiles on Instagram"
      >
        <Instagram className="w-6 h-6 stroke-[2.2] group-hover:rotate-6 transition-transform" />
      </button>

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-200 group relative"
        title="Chat with Zara Mobiles on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-none group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>
    </div>
  );
}
