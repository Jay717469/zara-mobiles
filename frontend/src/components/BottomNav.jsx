import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, ArrowLeftRight, HelpCircle, PhoneCall, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNav({ onOpenExchange, onOpenFaqs, onOpenContact }) {
  const { cartCount } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 py-1.5 px-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? 'text-[#ff5722] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Store className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff5722] rounded-full animate-ping"></span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">Home</span>
            </>
          )}
        </NavLink>

        {/* Exchange */}
        <button
          type="button"
          onClick={onOpenExchange}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-[#ff5722] font-medium transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Exchange</span>
        </button>

        {/* FAQs */}
        <button
          type="button"
          onClick={onOpenFaqs}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-[#ff5722] font-medium transition-colors"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">FAQs</span>
        </button>

        {/* Contact */}
        <button
          type="button"
          onClick={onOpenContact}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-[#ff5722] font-medium transition-colors"
        >
          <PhoneCall className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Contact</span>
        </button>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
              isActive ? 'text-[#ff5722] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#ff5722] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">Cart</span>
        </NavLink>
      </div>
    </div>
  );
}
