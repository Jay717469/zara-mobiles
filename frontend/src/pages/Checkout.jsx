import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import Loading from '../components/Loading';

export default function Checkout() {
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fulfilment state: 'HOME_DELIVERY' | 'STORE_PICKUP'
  const [fulfilmentType, setFulfilmentType] = useState('HOME_DELIVERY');

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.fullName || '',
    mobileNumber: user?.mobileNumber || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    deliveryInstructions: '',
    isDefault: false,
  });

  // Stores state
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [pickupDateTime, setPickupDateTime] = useState('');

  // Payment method: 'COD' | 'RAZORPAY'
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerNotes, setCustomerNotes] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [addrRes, storeRes] = await Promise.all([
          orderService.getAddresses(),
          orderService.getActiveStores(),
        ]);

        if (addrRes.success && addrRes.data) {
          setAddresses(addrRes.data);
          const defaultAddr = addrRes.data.find((a) => a.isDefault) || addrRes.data[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else setShowNewAddressForm(true);
        }

        if (storeRes.success && storeRes.data) {
          setStores(storeRes.data);
          if (storeRes.data.length > 0) setSelectedStoreId(storeRes.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load checkout details', err);
      }
    };

    loadCheckoutData();
  }, [user]);

  if (cartLoading || !cart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading text="Preparing checkout session..." />
      </div>
    );
  }

  const items = cart.items || [];
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      // Validate fulfilment
      if (fulfilmentType === 'HOME_DELIVERY') {
        if (!selectedAddressId && !showNewAddressForm) {
          throw new Error('Please select or enter a delivery address');
        }
        if (showNewAddressForm) {
          if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pinCode) {
            throw new Error('Please complete all required address fields');
          }
        }
      } else if (fulfilmentType === 'STORE_PICKUP') {
        if (!selectedStoreId) {
          throw new Error('Please select a pickup store');
        }
        if (!pickupDateTime) {
          throw new Error('Please select a preferred pickup date and time');
        }
      }

      const orderPayload = {
        fulfilmentType,
        deliveryAddressId: fulfilmentType === 'HOME_DELIVERY' && !showNewAddressForm ? selectedAddressId : null,
        newDeliveryAddress: fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm ? newAddress : null,
        pickupStoreId: fulfilmentType === 'STORE_PICKUP' ? selectedStoreId : null,
        pickupDateTime: fulfilmentType === 'STORE_PICKUP' ? pickupDateTime : null,
        paymentMethod,
        customerNotes: customerNotes.trim() || null,
      };

      const orderRes = await orderService.createOrder(orderPayload);
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to place order');
      }

      const createdOrder = orderRes.data;

      // If COD: order is confirmed immediately!
      if (paymentMethod === 'COD') {
        await fetchCart();
        navigate(`/my-orders?success=${encodeURIComponent(createdOrder.orderNumber)}`);
        return;
      }

      // If RAZORPAY: create payment order and open Razorpay modal
      if (paymentMethod === 'RAZORPAY') {
        const rzpOrderRes = await paymentService.createRazorpayOrder(createdOrder.id);
        if (!rzpOrderRes.success || !rzpOrderRes.data) {
          throw new Error('Failed to create Razorpay payment order');
        }

        const rzpData = rzpOrderRes.data;

        // Check if Razorpay checkout script is available
        if (typeof window.Razorpay === 'function') {
          const options = {
            key: rzpData.keyId,
            amount: Math.round(Number(rzpData.amount) * 100),
            currency: rzpData.currency || 'INR',
            name: 'ZARA MOBILES',
            description: `Payment for Order ${createdOrder.orderNumber}`,
            order_id: rzpData.razorpayOrderId.startsWith('order_test_') ? undefined : rzpData.razorpayOrderId,
            prefill: {
              name: rzpData.customerName,
              email: rzpData.customerEmail,
              contact: rzpData.customerPhone,
            },
            theme: {
              color: '#ff5722',
            },
            handler: async (response) => {
              try {
                // Verify payment on backend
                const verifyRes = await paymentService.verifyRazorpayPayment({
                  orderId: createdOrder.id,
                  razorpayOrderId: response.razorpay_order_id || rzpData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                  razorpaySignature: response.razorpay_signature || `test_sig_${Date.now()}`,
                });

                if (verifyRes.success) {
                  await fetchCart();
                  navigate(`/my-orders?success=${encodeURIComponent(createdOrder.orderNumber)}`);
                }
              } catch (verErr) {
                alert('Payment verification failed on server: ' + (verErr.response?.data?.message || verErr.message));
                navigate('/my-orders');
              }
            },
            modal: {
              ondismiss: () => {
                alert('Payment was cancelled. Your order has been placed in pending state.');
                navigate('/my-orders');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback simulation for headless/mock environments
          const proceedSimulated = window.confirm(
            `Razorpay Test Mode: Proceed with mock verified payment for ₹${Number(createdOrder.totalAmount).toLocaleString('en-IN')}?`
          );

          if (proceedSimulated) {
            await paymentService.verifyRazorpayPayment({
              orderId: createdOrder.id,
              razorpayOrderId: rzpData.razorpayOrderId,
              razorpayPaymentId: `pay_test_${Date.now()}`,
              razorpaySignature: `test_sig_${Date.now()}`,
            });
            await fetchCart();
            navigate(`/my-orders?success=${encodeURIComponent(createdOrder.orderNumber)}`);
          } else {
            navigate('/my-orders');
          }
        }
      }

    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Error occurred while placing your order');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout &amp; Fulfilment</h1>
        <p className="text-xs text-slate-500 mt-1">Select fulfilment method and complete your secure order</p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Unable to process order</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Fulfilment & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: FULFILMENT METHOD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#ff5722] text-white text-xs font-black flex items-center justify-center">1</span>
              <h2 className="text-base font-bold text-slate-900">Choose Fulfilment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setFulfilmentType('HOME_DELIVERY')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  fulfilmentType === 'HOME_DELIVERY'
                    ? 'border-[#ff5722] bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Truck className="w-4 h-4 text-[#ff5722]" />
                    Home Delivery
                  </div>
                  <input
                    type="radio"
                    name="fulfilmentType"
                    checked={fulfilmentType === 'HOME_DELIVERY'}
                    onChange={() => setFulfilmentType('HOME_DELIVERY')}
                    className="accent-[#ff5722]"
                  />
                </div>
                <p className="text-xs text-slate-500">Delivered directly to your door with courier tracking.</p>
              </label>

              <label
                onClick={() => setFulfilmentType('STORE_PICKUP')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  fulfilmentType === 'STORE_PICKUP'
                    ? 'border-[#ff5722] bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <MapPin className="w-4 h-4 text-[#ff5722]" />
                    Store Pickup
                  </div>
                  <input
                    type="radio"
                    name="fulfilmentType"
                    checked={fulfilmentType === 'STORE_PICKUP'}
                    onChange={() => setFulfilmentType('STORE_PICKUP')}
                    className="accent-[#ff5722]"
                  />
                </div>
                <p className="text-xs text-slate-500">Pick up today at our certified retail centers.</p>
              </label>
            </div>

            {/* Fulfilment Details Container */}
            {fulfilmentType === 'HOME_DELIVERY' ? (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delivery Address</h4>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs text-[#ff5722] font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showNewAddressForm ? 'Choose Saved Address' : 'Add New Address'}
                  </button>
                </div>

                {!showNewAddressForm && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-[#ff5722] bg-orange-50/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-100 font-semibold text-slate-600 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{addr.street}, {addr.city}</p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">{addr.state} - {addr.pinCode}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Phone: {addr.mobileNumber}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* New Address Form */
                  <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200 text-xs">
                    <p className="font-bold text-slate-800">Enter New Delivery Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                          value={newAddress.mobileNumber}
                          onChange={(e) => setNewAddress({ ...newAddress, mobileNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                        placeholder="House/Flat number, Building name, Street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                        <input
                          type="text"
                          required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                        <input
                          type="text"
                          required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">PIN Code</label>
                        <input
                          type="text"
                          required={fulfilmentType === 'HOME_DELIVERY' && showNewAddressForm}
                          value={newAddress.pinCode}
                          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Delivery Instructions (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Leave with security / Ring bell twice"
                        value={newAddress.deliveryInstructions}
                        onChange={(e) => setNewAddress({ ...newAddress, deliveryInstructions: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* Store Pickup Details */
              <div className="pt-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Zara Retail Experience Store</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stores.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStoreId(s.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedStoreId === s.id
                          ? 'border-[#ff5722] bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{s.address}, {s.city}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ff5722]" /> {s.openingHours}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Phone: {s.phone}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200 text-xs">
                  <label className="block font-semibold text-slate-800">
                    Choose Pickup Date &amp; Time
                  </label>
                  <select
                    required={fulfilmentType === 'STORE_PICKUP'}
                    value={pickupDateTime}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff5722]"
                  >
                    <option value="">-- Select convenient pickup slot --</option>
                    <option value="Today (12:00 PM - 03:00 PM)">Today (12:00 PM - 03:00 PM)</option>
                    <option value="Today (04:00 PM - 08:00 PM)">Today (04:00 PM - 08:00 PM)</option>
                    <option value="Tomorrow (11:00 AM - 02:00 PM)">Tomorrow (11:00 AM - 02:00 PM)</option>
                    <option value="Tomorrow (03:00 PM - 07:00 PM)">Tomorrow (03:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#ff5722] text-white text-xs font-black flex items-center justify-center">2</span>
              <h2 className="text-base font-bold text-slate-900">Choose Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-[#ff5722] bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    Cash on Delivery (COD)
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#ff5722]"
                  />
                </div>
                <p className="text-xs text-slate-500">Pay cash or UPI directly upon delivery / store pickup.</p>
              </label>

              <label
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-[#ff5722] bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <CreditCard className="w-4 h-4 text-[#ff5722]" />
                    Razorpay Online Payment
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="accent-[#ff5722]"
                  />
                </div>
                <p className="text-xs text-slate-500">UPI, Credit/Debit cards, NetBanking in Razorpay Test Mode.</p>
              </label>
            </div>

            {/* Customer Notes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Notes / Special Requests (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Any special handling, preferred call time, or gift instructions..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff5722]"
              ></textarea>
            </div>

          </div>

        </div>

        {/* Right Summary: Items & Order Confirmation (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({items.length} items)
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 border border-slate-100 flex-shrink-0">
                    <img
                      src={it.primaryImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=200&q=80'}
                      alt={it.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 line-clamp-1 max-w-[170px]">{it.productName}</h5>
                    <p className="text-[11px] text-slate-400">Qty: {it.quantity} × ₹{Number(it.unitPrice).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{Number(it.subtotal).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs pt-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{Number(cart.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-slate-900">₹{Number(cart.tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              {fulfilmentType === 'STORE_PICKUP' || Number(cart.shippingFee) === 0 ? (
                <span className="font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="font-semibold text-slate-900">₹{Number(cart.shippingFee).toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-[#ff5722]">
                ₹{Number(cart.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-[#ff5722] hover:bg-[#e64a19] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Confirming Order...' : (
              <>
                <CheckCircle className="w-5 h-5" />
                {paymentMethod === 'COD' ? 'Confirm Order (COD)' : 'Proceed to Razorpay Checkout'}
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed">
            By confirming, you agree to Zara Mobiles terms of sale and warranty verification policies.
          </p>
        </div>

      </form>

    </div>
  );
}
