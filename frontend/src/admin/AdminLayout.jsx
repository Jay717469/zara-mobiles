import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smartphone, 
  Layers, 
  ShoppingBag, 
  Users, 
  Boxes, 
  ArrowLeft, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: Smartphone },
    { name: 'Manage Categories', path: '/admin/categories', icon: Layers },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Accounts', path: '/admin/customers', icon: Users },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#101827] text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-sm">
              ZM
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight">ZARA ADMIN</span>
              <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Control Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Logged in as:</span>
            <span className="text-xs font-bold text-slate-900">{user?.fullName} ({user?.email})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Live Admin Session
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
