import React, { useEffect, useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowUpDown, 
  History, 
  Plus, 
  Minus,
  CheckCircle,
  PackageOpen
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal adjustment state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityChange, setQuantityChange] = useState(1);
  const [transactionType, setTransactionType] = useState('RESTOCK');
  const [reason, setReason] = useState('Restocked shipment from supplier');
  const [referenceId, setReferenceId] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invRes, txRes] = await Promise.all([
        orderService.getInventory(),
        orderService.getInventoryTransactions(0, 20),
      ]);

      if (invRes.success && invRes.data) {
        setInventory(invRes.data);
      }
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setQuantityChange(10);
    setTransactionType('RESTOCK');
    setReason('Restocked shipment from supplier');
    setReferenceId(`BATCH-${Date.now().toString().slice(-4)}`);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setAdjusting(true);
    try {
      const payload = {
        quantityChange: parseInt(quantityChange, 10),
        transactionType,
        reason,
        referenceId: referenceId || 'ADMIN-MANUAL',
      };

      const res = await orderService.adjustStock(selectedProduct.id, payload);
      if (res.success) {
        setSelectedProduct(null);
        fetchInventoryData();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Warehouse Inventory Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Live stock control, intake adjustments, and audit transaction log</p>
      </div>

      {loading ? (
        <Loading text="Loading inventory logs and stock counts..." />
      ) : (
        <>
          {/* Stock Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Current Stock Levels</h3>
              <span className="text-xs text-slate-400 font-medium">{inventory.length} devices tracked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Smartphone / SKU</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock on Hand</th>
                    <th className="py-3 px-4">Inventory Alert</th>
                    <th className="py-3 px-4 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{item.brand}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{Number(item.finalPrice || item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-slate-900">{item.stockQuantity}</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.stockQuantity === 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        ) : item.stockQuantity < 10 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            Low Stock Alert (&lt; 10)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Healthy Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openAdjustModal(item)}
                          className="px-3 py-1.5 bg-blue-50 text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-lg font-bold text-xs transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Transaction History Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-slate-900">Inventory Transaction Audit Trail</h3>
              </div>
              <span className="text-xs text-slate-400">Timestamped ledger</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Device Name</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Change</th>
                    <th className="py-3 px-4">Stock After</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Reference ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 line-clamp-1 max-w-[180px]">{tx.productName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={tx.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{tx.quantityAfter}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{tx.reason}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{tx.referenceId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Adjust Warehouse Stock</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedProduct.name} (Current: <strong>{selectedProduct.stockQuantity}</strong> units)
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adjustment Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="RESTOCK">RESTOCK (Shipment Inward)</option>
                  <option value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT (Audit Correction)</option>
                  <option value="ORDER_RESERVATION">ORDER_RESERVATION (Manual Hold)</option>
                  <option value="ORDER_CANCELLATION">ORDER_CANCELLATION (Restoration)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Change</label>
                <input
                  type="number"
                  required
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  placeholder="e.g. 20 (or -5 for deduction)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Use positive numbers to add stock, negative to deduct.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Batch ID</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2 bg-[#2563EB] text-white font-bold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {adjusting ? 'Committing...' : 'Commit Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
