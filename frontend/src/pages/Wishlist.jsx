import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function Wishlist() {
  const { wishlist, loading, toggleWishlist, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-card">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view your wishlist</h2>
        <p className="text-xs text-slate-500 mt-2">Save your dream smartphones and compare them anytime.</p>
        <Link
          to="/login"
          className="inline-block mt-6 px-6 py-2.5 bg-[#ff5722] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#e64a19]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading text="Loading saved items..." />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-card">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your wishlist is empty</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Tap the heart icon on any smartphone to save it for later or track price drops.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-[#ff5722] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#e64a19]"
        >
          Browse Smartphones <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Wishlist</h1>
        <p className="text-xs text-slate-500 mt-1">You have {wishlist.length} item(s) saved</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative pt-[85%] bg-slate-50">
              <Link to={`/products/${item.productId}`}>
                <img
                  src={item.primaryImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=400&q=80'}
                  alt={item.productName}
                  className="absolute inset-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(item.productId)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-rose-500 hover:bg-white shadow-sm"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#ff5722] uppercase tracking-wider">{item.productBrand}</span>
                <Link
                  to={`/products/${item.productId}`}
                  className="text-xs font-bold text-slate-900 hover:text-[#ff5722] line-clamp-1 block mt-0.5"
                >
                  {item.productName}
                </Link>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{Number(item.finalPrice || item.price).toLocaleString('en-IN')}
                  </span>
                  {item.discountPercentage > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    await addToCart(item.productId, 1);
                    await toggleWishlist(item.productId);
                    navigate('/cart');
                  }}
                  disabled={!item.inStock}
                  className="w-full py-2 px-3 bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
