import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function MyOrders() {
  const [searchParams] = useSearchParams();
  const successOrderNumber = searchParams.get('success');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders(0, 20);
      if (res.success && res.data) {
        setOrders(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order? Any reserved stock will be returned to inventory.');
    if (!confirmCancel) return;

    setCancellingId(orderId);
    try {
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="px-2.5 py-1 bg-orange-100 text-[#ff5722] rounded-full text-[11px] font-bold">Placed</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[11px] font-bold">Confirmed</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-[11px] font-bold">Processing</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold">Shipped</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[11px] font-bold">Out for Delivery</span>;
      case 'READY_FOR_PICKUP':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">Ready for Store Pickup</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading text="Loading order history..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success banner if navigated from checkout */}
      {successOrderNumber && (
        <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3.5 text-emerald-900 shadow-sm animate-fade-in">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Order Confirmed! Reference: {successOrderNumber}</h3>
            <p className="text-xs text-emerald-700 mt-1">
              Thank you for shopping with Zara Mobiles. Your order has been placed successfully and stock has been allocated.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
        <p className="text-xs text-slate-500 mt-1">View past smartphone purchases, tracking and fulfilment details</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1">You haven't placed any orders with Zara Mobiles yet.</p>
          <Link
            to="/products"
            className="inline-block mt-5 px-6 py-2.5 bg-[#ff5722] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#e64a19]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const canCancel = ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Order Summary Strip */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-slate-900">{order.orderNumber}</span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6 animate-fade-in text-xs">
                    
                    {/* Items List */}
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                        Purchased Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={item.productImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=200&q=80'}
                                  alt={item.productName}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800">{item.productName}</h5>
                                <p className="text-[11px] text-slate-400 font-mono">SKU: {item.productSku}</p>
                                {item.variantInfo && (
                                  <span className="text-[10px] text-slate-500 font-medium">({item.variantInfo})</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">₹{Number(item.totalPrice).toLocaleString('en-IN')}</p>
                              <p className="text-[10px] text-slate-400">{item.quantity} × ₹{Number(item.purchasePrice).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfilment & Payment Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      
                      {/* Fulfilment Info */}
                      <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-[#ff5722]">
                          {order.fulfilmentType === 'HOME_DELIVERY' ? <Truck className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          Fulfilment: {order.fulfilmentType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                        </span>

                        {order.fulfilmentType === 'HOME_DELIVERY' && order.deliveryAddress && (
                          <div className="text-slate-600 text-xs">
                            <p className="font-bold text-slate-800">{order.deliveryAddress.fullName}</p>
                            <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                            <p>{order.deliveryAddress.state} - {order.deliveryAddress.pinCode}</p>
                            <p className="text-[11px] text-slate-400 mt-1">Phone: {order.deliveryAddress.mobileNumber}</p>
                          </div>
                        )}

                        {order.fulfilmentType === 'STORE_PICKUP' && order.pickupStore && (
                          <div className="text-slate-600 text-xs">
                            <p className="font-bold text-slate-800">{order.pickupStore.name}</p>
                            <p>{order.pickupStore.address}, {order.pickupStore.city}</p>
                            <p className="text-[#ff5722] font-semibold mt-1">Pickup slot: {order.pickupDateTime || 'Ready for Pickup'}</p>
                          </div>
                        )}
                      </div>

                      {/* Payment & Charges Info */}
                      <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-slate-600 block">
                          Payment Details
                        </span>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Method</span>
                          <span className="font-bold text-slate-800">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Payment Status</span>
                          <span className={`font-bold ${order.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Subtotal</span>
                          <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Tax (18% GST)</span>
                          <span>₹{Number(order.tax).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Shipping</span>
                          <span>{Number(order.shippingFee) === 0 ? 'FREE' : `₹${Number(order.shippingFee).toLocaleString('en-IN')}`}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
