import React from 'react';
import { X, Instagram, CheckCircle2, ExternalLink, Users, Sparkles } from 'lucide-react';

export default function InstagramModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOpenInsta = () => {
    window.open('https://instagram.com/zaramobiles.store', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Instagram Gradient */}
        <div className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-full bg-white p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
              <Instagram className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>

          <h3 className="text-xl font-black mt-3 text-white flex items-center justify-center gap-1.5">
            @zaramobiles.store
            <CheckCircle2 className="w-5 h-5 text-sky-300 fill-sky-300 stroke-white" />
          </h3>
          <p className="text-white/80 text-xs mt-0.5 font-medium">
            Official ZARA MOBILES Experience Store
          </p>
        </div>

        {/* Stats */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100">
            <div>
              <p className="text-base font-extrabold text-gray-900">42.8K</p>
              <p className="text-[11px] text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">1,240+</p>
              <p className="text-[11px] text-gray-500">Phones Sold</p>
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">4.9 ★</p>
              <p className="text-[11px] text-gray-500">Customer Rating</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Follow our Instagram handle for daily unboxings, flash deals, customer delivery stories, and same-day in-store pickup updates!
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleOpenInsta}
              className="w-full py-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 active:scale-98 transition-all"
            >
              <Instagram className="w-4 h-4 stroke-[2.5]" />
              Follow on Instagram
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
