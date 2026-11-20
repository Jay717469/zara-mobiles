import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Cpu, 
  BatteryMedium, 
  MessageCircle, 
  ShoppingBag, 
  Check, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const inStock = product.stockQuantity > 0 && product.isActive !== false;

  // Format currency in Indian standard
  const formatPrice = (val) => {
    if (!val && val !== 0) return '0';
    return Number(val).toLocaleString('en-IN');
  };

  // Determine original vs selling price
  const sellingPrice = product.finalPrice || product.price || 0;
  const originalPrice = product.price && product.discountPercentage > 0
    ? (product.finalPrice ? product.price : Math.round(product.price * (1 + product.discountPercentage / 100)))
    : (product.finalPrice && product.discountPercentage > 0 
        ? Math.round(product.finalPrice / (1 - product.discountPercentage / 100))
        : null);

  const discountPercent = product.discountPercentage > 0 
    ? Math.round(product.discountPercentage) 
    : (originalPrice && originalPrice > sellingPrice 
        ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) 
        : 0);

  // Determine condition & badge
  const isDemo = (product.name && product.name.toLowerCase().includes('demo')) ||
                 (product.description && product.description.toLowerCase().includes('demo')) ||
                 (product.warrantyDetails && product.warrantyDetails.toLowerCase().includes('store'));

  const isNew = product.condition === 'New' || (!isDemo && product.stockQuantity > 20);

  // Badge label
  const badgeLabel = isDemo 
    ? 'DEMO' 
    : (product.warrantyDetails && product.warrantyDetails.toLowerCase().includes('apple') 
        ? 'WARRANTY' 
        : (isNew ? 'NEW' : 'VERIFIED'));

  // Color Swatch Mapping
  const getColorHex = (colorName) => {
    if (!colorName) return '#94a3b8';
    const c = colorName.toLowerCase();
    if (c.includes('desert') || c.includes('orange') || c.includes('gold')) return '#ea580c';
    if (c.includes('pink') || c.includes('coral') || c.includes('rose')) return '#f472b6';
    if (c.includes('titanium') || c.includes('silver') || c.includes('white')) return '#e2e8f0';
    if (c.includes('black') || c.includes('dark') || c.includes('space') || c.includes('prism')) return '#1e293b';
    if (c.includes('blue') || c.includes('navy')) return '#3b82f6';
    if (c.includes('purple')) return '#a855f7';
    if (c.includes('green')) return '#10b981';
    return '#cbd5e1';
  };

  const colorHex = getColorHex(product.color);

  // Battery info formatting (e.g. 100%CC-28, 95%, 77%, 5000 mAh)
  const getBatteryDisplay = () => {
    if (!product.battery || product.battery === 'N/A') return null;
    const b = product.battery;
    if (b.includes('100%')) return '100%CC-28';
    if (b.includes('%')) {
      const match = b.match(/(\d+)%/);
      return match ? `${match[1]}%` : b;
    }
    if (b.includes('mAh')) {
      const match = b.match(/(\d+)\s*mAh/);
      return match ? `${match[1]} mAh` : b;
    }
    return b;
  };

  const batteryDisplay = getBatteryDisplay();

  // Storage display
  const storageDisplay = product.storage && product.storage !== 'N/A' 
    ? product.storage.replace(/\s+/g, '') 
    : (product.ram && product.ram !== 'N/A' ? product.ram : '256GB');

  // Warranty display
  const warrantyDisplay = product.warrantyDetails || '1 Year Official Warranty';

  // Primary image
  const displayImage = product.primaryImageUrl || 
    (product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=600&q=80');

  // WhatsApp Buy Now handler
  const handleWhatsAppBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const message = encodeURIComponent(
      `Hi ZARA MOBILES! I want to buy the *${product.name}* (${storageDisplay}, ${product.color || 'Standard'}).\nPrice: ₹${formatPrice(sellingPrice)}.\nWarranty: ${warrantyDisplay}.\nIs this available for instant delivery or store pickup?`
    );
    window.open(`https://wa.me/916379367629?text=${message}`, '_blank');
  };

  // Add to cart handler
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!inStock || adding) return;

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  // Wishlist toggle
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/products/${product.id}`)}
      className="group bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 transition-all duration-200 cursor-pointer flex flex-row items-center gap-3.5 sm:gap-4 relative overflow-hidden"
    >
      {/* 1. Left: Product Image Box */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-[#F9FAFB] rounded-xl p-2 flex items-center justify-center relative border border-gray-100 group-hover:bg-orange-50/30 transition-colors">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Wishlist Heart Icon Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist toggle"
          className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-500 shadow-xs'
              : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 shadow-xs'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* 2. Right: Content & Specs */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        
        {/* Row 1: Title and Badge */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold uppercase text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#ff5722] transition-colors">
              {product.name}
            </h3>

            {/* Condition / Warranty Badge */}
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 ${
              badgeLabel === 'DEMO'
                ? 'bg-amber-100 text-amber-700'
                : (badgeLabel === 'WARRANTY' 
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-emerald-100 text-emerald-700')
            }`}>
              {badgeLabel}
            </span>
          </div>

          {/* Row 2: Specs with Icons (Storage, Color Dot, Battery) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-1.5 text-xs text-gray-600 font-medium">
            {/* Storage */}
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-gray-400 stroke-[2]" />
              <span>{storageDisplay}</span>
            </span>

            {/* Color Swatch Dot */}
            <span 
              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs inline-block"
              style={{ backgroundColor: colorHex }}
              title={product.color || 'Color'}
            />

            {/* Battery Indicator */}
            {batteryDisplay && (
              <span className="flex items-center gap-1 text-gray-600">
                <BatteryMedium className="w-3.5 h-3.5 text-gray-400 stroke-[2]" />
                <span>{batteryDisplay}</span>
              </span>
            )}
          </div>

          {/* Row 3: Warranty Details with Shield */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500 font-medium uppercase truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{warrantyDisplay}</span>
          </div>
        </div>

        {/* Row 4: Pricing and Buy Now Action */}
        <div className="flex items-end justify-between gap-2 mt-2 pt-1">
          {/* Price & Discount */}
          <div>
            <div className="flex items-baseline">
              <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                ₹{formatPrice(sellingPrice)}
              </span>
              {originalPrice && originalPrice > sellingPrice && (
                <span className="text-xs text-gray-400 line-through font-normal ml-1.5">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Red Discount Badge */}
            {discountPercent > 0 && (
              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-red-500 text-white font-extrabold text-[10px] sm:text-xs rounded tracking-wide">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons: Add To Cart + WhatsApp Buy Now */}
          <div className="flex items-center gap-1.5">
            {/* Quick Add To Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                justAdded 
                  ? 'bg-emerald-500 text-white border-emerald-500' 
                  : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#ff5722] border-gray-200 hover:border-orange-200'
              }`}
              title="Add to Cart"
            >
              {justAdded ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>

            {/* WhatsApp Buy Now Green Button */}
            <button
              type="button"
              onClick={handleWhatsAppBuyNow}
              className="bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0"
              title="Buy Now via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
