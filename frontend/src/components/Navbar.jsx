import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Instagram, 
  Gift, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function Navbar(props) {
  const ui = useUI();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Prefer props if passed, otherwise use UIContext
  const onOpenOffers = props.onOpenOffers || (() => ui.setIsOffersOpen(true));
  const onOpenInstagram = props.onOpenInstagram || (() => ui.setIsInstagramOpen(true));
  const onOpenFilter = props.onOpenFilter || (() => ui.setIsFilterOpen(true));
  const searchQuery = props.searchQuery !== undefined ? props.searchQuery : ui.searchQuery;
  const onSearchChange = props.onSearchChange || ((val) => ui.setSearchQuery(val));

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (props.onSearchSubmit) {
      props.onSearchSubmit(e);
    } else {
      // If not on home or products page, navigate to home/products with search
      if (window.location.pathname !== '/' && window.location.pathname !== '/products') {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* 1. TOP HEADER: ORANGE/RED GRADIENT (Brand, Instagram Follow, Offers, User Actions) */}
      <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white px-3 sm:px-6 py-2.5 sm:py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Store Name */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-[#ff5722] flex items-center justify-center shadow-md shadow-black/10 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center drop-shadow-xs">
                ZARA<span className="text-amber-200 ml-1">MOBILES</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-white/80 font-bold -mt-1">
                Smartphone Store
              </span>
            </div>
          </Link>

          {/* Right Header Controls (Instagram Follow, Offers, Shopping Badges, Account) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Instagram Follow Button (From Reference Screenshot) */}
            <button
              type="button"
              onClick={onOpenInstagram}
              className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Follow Zara Mobiles on Instagram"
            >
              <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Follow</span>
            </button>

            {/* Offers Button (From Reference Screenshot) */}
            <button
              type="button"
              onClick={onOpenOffers}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/25 backdrop-blur-xs active:scale-95 transition-all"
              title="View Active Offers & Coupons"
            >
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              <span>Offers</span>
            </button>

            {/* Desktop Quick Nav: Wishlist, Cart & Profile */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/20">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#ff5722] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors relative"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#ff5722] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin Panel Badge */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-1.5 bg-black/25 hover:bg-black/35 text-amber-200 text-xs font-bold rounded-full flex items-center gap-1 border border-amber-200/30 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {/* User Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user?.fullName?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 text-gray-800 z-50 animate-in fade-in zoom-in-95"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/my-orders" className="block px-4 py-2 text-xs font-semibold hover:bg-orange-50 hover:text-[#ff5722]">
                        My Orders
                      </Link>
                      <Link to="/profile" className="block px-4 py-2 text-xs font-semibold hover:bg-orange-50 hover:text-[#ff5722]">
                        Profile &amp; Addresses
                      </Link>
                      {isAdmin && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 border-t border-gray-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 bg-white text-[#ff5722] hover:bg-orange-50 font-bold text-xs rounded-full shadow-sm transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. SUB-HEADER: SEARCH BAR & FILTER BUTTON (From Reference Screenshot) */}
      <div className="bg-white px-3 sm:px-6 py-2.5 max-w-7xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search phones by model or brand..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs sm:text-sm text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filter Button (Prominent Orange Rounded Square with Sliders Icon) */}
          <button
            type="button"
            onClick={onOpenFilter}
            aria-label="Filter Phones"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#ff5722] hover:bg-[#e64a19] active:scale-95 text-white flex items-center justify-center shadow-sm shadow-orange-500/25 transition-all flex-shrink-0"
            title="Open Product Filters"
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
          </button>
        </form>
      </div>
    </header>
  );
}
