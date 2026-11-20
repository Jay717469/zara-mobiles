import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function Footer() {
  const ui = useUI();

  const handleOpenWA = (number) => {
    const message = encodeURIComponent("Hello ZARA MOBILES, I have an inquiry regarding smartphone availability.");
    window.open(`https://wa.me/91${number}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#101827] text-gray-300 pt-12 pb-16 md:pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5722] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Fast Delivery</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Express insured dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5722] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Store Pickup</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Ready in 2 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5722] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">100% Genuine</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Official Brand Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5722] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Easy Exchange</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Up to ₹8,000 extra bonus</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ff5722] flex items-center justify-center text-white">
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ZARA<span className="text-[#ff5722] ml-1">MOBILES</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              India's premier smartphone destination. We deliver the newest flagship smartphones, verified demo units, and authentic mobile accessories with express home delivery or instant physical pickup at our 4 retail branches.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff5722]" /> 
                <a href="tel:+916379367629" className="hover:text-white font-bold">+91 63793 67629</a> / 
                <a href="tel:+916385533138" className="hover:text-white font-bold ml-1">+91 63855 33138</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff5722]" /> support@zaramobiles.com
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#ff5722]" /> Mon - Sun: 10:00 AM - 09:30 PM
              </p>
            </div>
          </div>

          {/* Brands & Categories */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Popular Brands</h5>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><button onClick={() => { ui.setSelectedBrand('Apple'); ui.setActiveCategoryTab('apple'); }} className="hover:text-white transition-colors">Apple iPhones</button></li>
              <li><button onClick={() => { ui.setSelectedBrand('Samsung'); ui.setActiveCategoryTab('samsung'); }} className="hover:text-white transition-colors">Samsung Galaxy</button></li>
              <li><button onClick={() => { ui.setSelectedBrand('OnePlus'); ui.setActiveCategoryTab('oneplus'); }} className="hover:text-white transition-colors">OnePlus 5G</button></li>
              <li><button onClick={() => { ui.setSelectedBrand('Redmi'); ui.setActiveCategoryTab('redmi'); }} className="hover:text-white transition-colors">Redmi &amp; Xiaomi</button></li>
              <li><button onClick={() => { ui.setSelectedBrand('Realme'); ui.setActiveCategoryTab('realme'); }} className="hover:text-white transition-colors">Realme GT Series</button></li>
              <li><button onClick={() => { ui.setSelectedCategory('accessories'); ui.setActiveCategoryTab('accessories'); }} className="hover:text-white transition-colors">Earbuds &amp; Chargers</button></li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Customer Service</h5>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li><button onClick={() => ui.setIsExchangeOpen(true)} className="hover:text-white transition-colors">Exchange Old Phone</button></li>
              <li><button onClick={() => ui.setIsOffersOpen(true)} className="hover:text-white transition-colors">Coupons &amp; Offers</button></li>
              <li><button onClick={() => ui.setIsFaqsOpen(true)} className="hover:text-white transition-colors">Warranty &amp; FAQs</button></li>
              <li><button onClick={() => ui.setIsContactOpen(true)} className="hover:text-white transition-colors">Physical Store Branches</button></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">WhatsApp &amp; Social</h5>
            <div className="space-y-2">
              <button
                onClick={() => handleOpenWA('6379367629')}
                className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span>WhatsApp 1</span>
                </div>
                <span className="text-[11px] font-semibold text-white/90">+91 63793 67629</span>
              </button>

              <button
                onClick={() => handleOpenWA('6385533138')}
                className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span>WhatsApp 2</span>
                </div>
                <span className="text-[11px] font-semibold text-white/90">+91 63855 33138</span>
              </button>

              <button
                onClick={() => ui.setIsInstagramOpen(true)}
                className="w-full py-2 px-3 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity pt-2.5"
              >
                <Instagram className="w-3.5 h-3.5 stroke-[2.5]" />
                @zaramobiles.store
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 leading-snug">
              Official WhatsApp Helplines: +91 63793 67629 &amp; +91 63855 33138
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 ZARA MOBILES Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Official WhatsApp Customer Support Available 24/7
          </p>
        </div>

      </div>
    </footer>
  );
}
