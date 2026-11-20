import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Smartphone, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  PackageX
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await orderService.getAdminDashboard();
        if (res.success && res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loading text="Aggregating store metrics and figures..." />;
  }

  if (!dashboard) {
    return <p className="text-xs text-rose-500">Failed to load admin metrics.</p>;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${Number(dashboard.totalSales || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: dashboard.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-[#2563EB] border-blue-200',
    },
    {
      title: 'Registered Customers',
      value: dashboard.totalCustomers,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Active Products',
      value: dashboard.totalProducts,
      icon: Smartphone,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Live metrics, inventory alerts, and sales performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{card.title}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Alerts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Low Stock Alert</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {dashboard.lowStockCount} product(s) have fewer than 10 units in warehouse.
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-2xs"
          >
            Review Stock
          </Link>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <PackageX className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">Out of Stock Alert</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                {dashboard.outOfStockCount} product(s) are completely sold out.
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-2xs"
          >
            Restock
          </Link>
        </div>
      </div>

      {/* Order Status Breakdown Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Orders by Fulfilment Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.entries(dashboard.ordersByStatus || {}).map(([st, cnt]) => (
            <div key={st} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{st}</p>
              <p className="text-lg font-black text-slate-900 mt-1">{cnt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-2 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest purchases awaiting dispatch or pickup</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            View All Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-y border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">Order Number</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Fulfilment</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboard.recentOrders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                  <td className="py-3 px-6">
                    <p className="font-bold text-slate-800">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-400">{ord.customerEmail}</p>
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {ord.fulfilmentType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-semibold text-slate-800">{ord.paymentMethod}</span>
                    <span className={`block text-[10px] font-bold ${ord.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-bold text-slate-900">
                    ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-xs text-[#2563EB] hover:underline font-bold"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
