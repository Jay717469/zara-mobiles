import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN' && from === '/') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#ff5722] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              ZARA<span className="text-[#ff5722] ml-0.5">MOBILES</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-gray-500">Access your smartphone orders, cart, and address book</p>
        </div>

        {/* 1-Click Demo Fill Buttons */}
        <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#ff5722]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Quick Demo Login:
            </span>
            <span className="text-[10px] text-gray-500 font-normal">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer@zaramobiles.com', 'Customer@123')}
              className="py-1.5 px-2 bg-white hover:bg-orange-100/60 border border-orange-200 text-[#ff5722] text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@zaramobiles.com', 'Admin@123')}
              className="py-1.5 px-2 bg-white hover:bg-orange-100/60 border border-orange-200 text-amber-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#ff5722] hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
