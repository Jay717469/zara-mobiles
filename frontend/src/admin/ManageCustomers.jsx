import React, { useEffect, useState } from 'react';
import { Users, Search, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await orderService.getCustomers();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customerId, currentStatus) => {
    const targetStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmToggle = window.confirm(`Change customer status to ${targetStatus}?`);
    if (!confirmToggle) return;

    setUpdatingId(customerId);
    try {
      const res = await orderService.updateCustomerStatus(customerId, targetStatus);
      if (res.success) {
        fetchCustomers();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!keyword.trim()) return true;
    const term = keyword.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.mobileNumber?.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Accounts</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage customer roster and access permissions</p>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <input
          type="text"
          placeholder="Search by customer name, email, or phone..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table */}
      {loading ? (
        <Loading text="Loading customer accounts..." />
      ) : customers.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          No registered customers found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Mobile Phone</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{cust.fullName}</td>
                    <td className="py-3 px-4 text-slate-700">{cust.email}</td>
                    <td className="py-3 px-4 font-mono">{cust.mobileNumber}</td>
                    <td className="py-3 px-4 font-bold text-[#2563EB]">{cust.totalOrders} order(s)</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(cust.registeredAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust.id, cust.status)}
                        disabled={updatingId === cust.id}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          cust.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {cust.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
