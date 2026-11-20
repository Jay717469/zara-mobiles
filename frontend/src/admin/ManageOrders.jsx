import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Truck, 
  MapPin, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        status: statusFilter || undefined,
        keyword: keyword || undefined,
        size: 50,
      });
      if (res.success && res.data) {
        setOrders(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus, 'Admin manual transition');
      if (res.success) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const orderStatuses = [
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'READY_FOR_PICKUP',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track fulfilment lifecycles, store pickups, and payments</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="text"
            placeholder="Search by order number or customer email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-9 pr-20 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#2563EB] text-white text-xs font-bold rounded-lg shadow-2xs"
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="">All Order Statuses</option>
          {orderStatuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loading text="Loading order records..." />
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No orders match the current filter.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Fulfilment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Update Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{ord.customerName}</p>
                      <p className="text-[11px] text-slate-400">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        {ord.fulfilmentType === 'HOME_DELIVERY' ? (
                          <Truck className="w-3.5 h-3.5 text-[#2563EB]" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                        )}
                        <span>{ord.fulfilmentType === 'HOME_DELIVERY' ? 'Home' : 'Pickup'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{ord.paymentMethod}</span>
                      <span className={`block text-[10px] font-bold ${ord.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        disabled={updatingStatusId === ord.id || ord.orderStatus === 'CANCELLED'}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50"
                      >
                        {orderStatuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-base font-bold text-slate-900">{selectedOrder.orderNumber}</span>
                <p className="text-xs text-slate-400">Customer: {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Fulfilment & Payment info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-[#2563EB] uppercase text-[10px] tracking-wider block">Fulfilment Target</span>
                {selectedOrder.fulfilmentType === 'HOME_DELIVERY' ? (
                  <>
                    <p className="font-bold text-slate-800">{selectedOrder.deliveryAddress?.fullName}</p>
                    <p>{selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}</p>
                    <p>{selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pinCode}</p>
                    <p className="text-[11px] text-slate-400">Phone: {selectedOrder.deliveryAddress?.mobileNumber}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-800">{selectedOrder.pickupStore?.name}</p>
                    <p>{selectedOrder.pickupStore?.address}, {selectedOrder.pickupStore?.city}</p>
                    <p className="text-[#2563EB] font-bold">Slot: {selectedOrder.pickupDateTime}</p>
                  </>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider block">Financial Summary</span>
                <div className="flex justify-between"><span>Payment Method:</span> <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong></div>
                <div className="flex justify-between"><span>Payment Status:</span> <strong className="text-slate-800">{selectedOrder.paymentStatus}</strong></div>
                <div className="flex justify-between"><span>Subtotal:</span> <span>₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Tax (18%):</span> <span>₹{Number(selectedOrder.tax).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{it.productName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">SKU: {it.productSku} {it.variantInfo && `• ${it.variantInfo}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{Number(it.totalPrice).toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-slate-400">{it.quantity} × ₹{Number(it.purchasePrice).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.customerNotes && (
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                <span className="font-bold block mb-0.5">Customer Instructions:</span>
                {selectedOrder.customerNotes}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
