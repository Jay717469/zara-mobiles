import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Store, 
  Check, 
  Clock, 
  RotateCcw,
  MessageCircle,
  Sparkles,
  ChevronRight,
  BatteryMedium,
  Cpu,
  MapPin
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          productService.getProductById(id),
          productService.getReviews(id),
        ]);

        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setProduct(p);
          setSelectedImage(p.primaryImageUrl || (p.images && p.images[0]?.imageUrl));
          if (p.variants && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
          }
        }

        if (revRes.success) {
          setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loading text="Loading smartphone specifications..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-200 text-center shadow-sm">
        <h2 className="text-xl font-black text-gray-900">Phone Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The smartphone you requested does not exist or has been relocated.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-[#ff5722] text-white text-xs font-bold rounded-xl shadow-md">
          Back to Showroom
        </Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0 && product.isActive !== false;
  const isFavorited = isInWishlist(product.id);

  // Calculated price with selected variant adjustment
  let currentFinalPrice = Number(product.finalPrice || product.price);
  if (selectedVariant && selectedVariant.priceAdjustment) {
    currentFinalPrice += Number(selectedVariant.priceAdjustment);
  }

  const formatPrice = (val) => Number(val).toLocaleString('en-IN');

  const originalPrice = product.price && product.discountPercentage > 0
    ? (product.finalPrice ? product.price : Math.round(product.price * (1 + product.discountPercentage / 100)))
    : (product.finalPrice && product.discountPercentage > 0 
        ? Math.round(product.finalPrice / (1 - product.discountPercentage / 100))
        : null);

  const discountPercent = product.discountPercentage > 0 
    ? Math.round(product.discountPercentage) 
    : (originalPrice && originalPrice > currentFinalPrice 
        ? Math.round(((originalPrice - currentFinalPrice) / originalPrice) * 100) 
        : 0);

  // Condition & Badge
  const isDemo = (product.name && product.name.toLowerCase().includes('demo')) ||
                 (product.description && product.description.toLowerCase().includes('demo')) ||
                 (product.warrantyDetails && product.warrantyDetails.toLowerCase().includes('store'));

  const badgeLabel = isDemo 
    ? 'DEMO' 
    : (product.warrantyDetails && product.warrantyDetails.toLowerCase().includes('apple') 
        ? 'WARRANTY' 
        : 'BRAND NEW');

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ success: false, msg: 'Enter valid 6-digit PIN' });
      return;
    }
    setPincodeStatus({ 
      success: true, 
      msg: `Express Delivery Available to ${pincode}! Delivered within 24-48 hours.` 
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!inStock || addingToCart) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedVariant?.id || null);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!inStock) return;

    try {
      await addToCart(product.id, quantity, selectedVariant?.id || null);
      navigate('/checkout');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to initiate checkout');
    }
  };

  const handleWhatsAppOrder = (num = '6379367629') => {
    const text = encodeURIComponent(
      `Hello ZARA MOBILES! I want to purchase:\n- Model: *${product.name}*\n- Storage: ${product.storage || 'Standard'}\n- Color: ${product.color || 'Standard'}\n- Price: ₹${formatPrice(currentFinalPrice)}\n- Warranty: ${product.warrantyDetails || 'Standard'}\nPlease confirm availability for home delivery or store pickup.`
    );
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await productService.addReview(product.id, {
        rating: reviewRating,
        headline: reviewHeadline.trim(),
        comment: reviewComment.trim(),
      });
      if (res.success) {
        setShowReviewModal(false);
        setReviewHeadline('');
        setReviewComment('');
        const updated = await productService.getReviews(product.id);
        if (updated.success) setReviews(updated.data || []);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link to="/" className="hover:text-[#ff5722]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-[#ff5722]">Phones</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Details Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative pt-[100%] bg-[#F9FAFB] rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-black rounded-lg shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-xs ${
                isFavorited ? 'bg-rose-50 text-rose-500' : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 p-1 bg-white transition-all ${
                    selectedImage === img.imageUrl ? 'border-[#ff5722] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Brand & Condition Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase text-[#ff5722] bg-orange-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
              badgeLabel === 'DEMO'
                ? 'bg-amber-100 text-amber-800'
                : (badgeLabel === 'WARRANTY'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-emerald-100 text-emerald-800')
            }`}>
              {badgeLabel}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {product.name}
          </h1>

          {/* Specs Highlights */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            {product.storage && (
              <span className="flex items-center gap-1">
                <Cpu className="w-4 h-4 text-[#ff5722]" />
                {product.storage}
              </span>
            )}
            {product.color && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-gray-300 bg-gray-400 inline-block" />
                {product.color}
              </span>
            )}
            {product.battery && (
              <span className="flex items-center gap-1">
                <BatteryMedium className="w-4 h-4 text-emerald-600" />
                {product.battery}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-500 font-semibold ml-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {product.warrantyDetails || 'Official Warranty'}
            </span>
          </div>

          {/* Pricing Box */}
          <div className="bg-gradient-to-r from-orange-50/60 to-amber-50/60 p-4 rounded-2xl border border-orange-200/60 flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">
              ₹{formatPrice(currentFinalPrice)}
            </span>
            {originalPrice && originalPrice > currentFinalPrice && (
              <>
                <span className="text-base text-gray-400 line-through font-semibold">
                  ₹{formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span className="ml-auto text-[11px] text-gray-500 font-medium">Inclusive of all taxes</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Quantity selector */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-white px-2 py-1.5 shadow-2xs sm:w-28 flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-sm"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xs font-black text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-sm"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>

              {/* Buy Now Button (Instant checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 py-3 px-5 bg-[#ff5722] hover:bg-[#e64a19] active:scale-98 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                Buy Now
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                className={`py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                  justAdded
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-900 hover:bg-black text-white border-gray-900'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp Direct Buy Now Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleWhatsAppOrder('6379367629')}
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                WhatsApp: +91 63793 67629
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppOrder('6385533138')}
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                WhatsApp: +91 63855 33138
              </button>
            </div>
          </div>

          {/* Delivery & Physical Store Pickup Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
            {/* Home Delivery PIN checker */}
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Truck className="w-4 h-4 text-[#ff5722]" />
                Home Delivery Availability
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#ff5722]"
                />
                <button type="submit" className="px-3 py-1.5 bg-gray-900 text-white font-bold rounded-lg text-[11px]">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-[10px] font-semibold ${pincodeStatus.success ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pincodeStatus.msg}
                </p>
              )}
            </div>

            {/* Store Pickup */}
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Store className="w-4 h-4 text-[#ff5722]" />
                Physical Store Pickup
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Collect today from Indiranagar (Bengaluru), Bandra West (Mumbai), Connaught Place (Delhi), or T. Nagar (Chennai).
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Ready in 2 Hours
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Technical Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          {[
            { label: 'Processor', val: product.processor },
            { label: 'RAM', val: product.ram },
            { label: 'Storage', val: product.storage },
            { label: 'Display', val: product.display },
            { label: 'Battery Health / Capacity', val: product.battery },
            { label: 'Rear & Front Camera', val: product.camera },
            { label: 'Color Variant', val: product.color },
            { label: 'Warranty Coverage', val: product.warrantyDetails },
          ].map((spec, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-semibold text-gray-500">{spec.label}</span>
              <span className="font-bold text-gray-900 text-right">{spec.val || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-gray-500">Verified buyer ratings &amp; feedback</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) navigate('/login');
              else setShowReviewModal(true);
            }}
            className="px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Write a Review
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3 divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">Verified Buyer</span>
                </div>
                <h4 className="font-bold text-xs text-gray-900 mt-1">{rev.headline}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-gray-400 mt-1">Reviewed by {rev.userName || 'Customer'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No reviews yet. Be the first to review this phone!</p>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-base font-black text-gray-900 mb-1">Write a Review</h3>
            <p className="text-xs text-gray-500 mb-4">{product.name}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent battery life and display"
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  placeholder="Share your experience with this phone..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  required
                />
              </div>

              {reviewError && (
                <p className="text-xs text-red-500 font-bold">{reviewError}</p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2.5 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
