import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading text="Loading your shopping cart..." />
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 sm:p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 text-[#ff5722] flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">
          Explore our smartphone catalog for the newest flagship releases and verified demo units.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Explore Phones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-gray-500">Review selected phones and delivery options</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <Link
                  to={`/products/${item.productId}`}
                  className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden p-2 flex-shrink-0 border border-gray-100 flex items-center justify-center"
                >
                  <img
                    src={item.primaryImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=400&q=80'}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#ff5722] uppercase tracking-wider">{item.productBrand}</span>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-xs sm:text-sm font-extrabold text-gray-900 hover:text-[#ff5722] line-clamp-1 block transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {item.productSku}</p>
                  {item.variantDescription && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600">
                      {item.variantDescription}
                    </span>
                  )}
                </div>
              </div>

              {/* Price, Quantity & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-black text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stockAvailable}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm sm:text-base font-black text-gray-900">
                    ₹{Number(item.subtotal).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-gray-400">₹{Number(item.unitPrice).toLocaleString('en-IN')} each</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-base font-black text-gray-900 pb-2 border-b border-gray-100">
            Order Calculation
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total ({cart.totalItems} items)</span>
              <span className="font-bold text-gray-900">₹{Number(cart.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST &amp; Regulatory Taxes (18%)</span>
              <span className="font-bold text-gray-900">₹{Number(cart.tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              {Number(cart.shippingFee) === 0 ? (
                <span className="font-black text-emerald-600 uppercase text-[11px]">FREE</span>
              ) : (
                <span className="font-bold text-gray-900">₹{Number(cart.shippingFee).toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Estimated Total</span>
              <span className="text-2xl font-black text-[#ff5722]">
                ₹{Number(cart.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 bg-[#ff5722] hover:bg-[#e64a19] text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="p-3 bg-gray-50 rounded-2xl space-y-1.5 text-[11px] text-gray-500">
            <p className="flex items-center gap-1.5 font-bold text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safe &amp; Verified Checkout
            </p>
            <p>Cash on Delivery (COD) and Razorpay instant online payments supported.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
