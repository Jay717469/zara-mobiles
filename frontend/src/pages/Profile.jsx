import React, { useEffect, useState } from 'react';
import { 
  User, 
  MapPin, 
  Lock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';

export default function Profile() {
  const { user } = useAuth();

  // Tab: 'profile' | 'addresses' | 'security'
  const [activeTab, setActiveTab] = useState('addresses');

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.fullName || '',
    mobileNumber: user?.mobileNumber || '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    deliveryInstructions: '',
    isDefault: false,
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await orderService.getAddresses();
      if (res.success && res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await orderService.createAddress(addressForm);
      if (res.success) {
        setShowAddressModal(false);
        setAddressForm({
          fullName: user?.fullName || '',
          mobileNumber: user?.mobileNumber || '',
          street: '',
          city: '',
          state: '',
          pinCode: '',
          deliveryInstructions: '',
          isDefault: false,
        });
        fetchAddresses();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await orderService.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSubmittingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      if (res.success) {
        setPasswordSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account &amp; Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage delivery addresses, security, and personal profile</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-[#ff5722]">
          <ShieldCheck className="w-4 h-4" /> Role: {user?.role || 'CUSTOMER'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'addresses' ? 'bg-[#ff5722] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-[#ff5722] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Profile Details
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-[#ff5722] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" /> Security &amp; Password
        </button>
      </div>

      {/* ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Delivery Address Book</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          </div>

          {loadingAddresses ? (
            <Loading text="Loading addresses..." />
          ) : addresses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No saved addresses found. Add an address for faster checkout.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 bg-orange-50 text-[#ff5722] text-[10px] font-bold rounded-md">
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{addr.street}, {addr.city}</p>
                    <p className="text-xs text-slate-500 font-mono">{addr.state} - {addr.pinCode}</p>
                    <p className="text-xs text-slate-400">Mobile: {addr.mobileNumber}</p>
                    {addr.deliveryInstructions && (
                      <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded">
                        Note: {addr.deliveryInstructions}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE DETAILS TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-xl">
          <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-500 mb-1">Full Name</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200/80">
                {user?.fullName}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Registered Email</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200/80">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Mobile Contact</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200/80">
                {user?.mobileNumber}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-500 mb-1">Account Role</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-200/80">
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-xl">
          <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPassword}
              className="py-2.5 px-6 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submittingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Delivery Address</h3>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.mobileNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Flat, House No, Street name"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pinCode}
                    onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={addressForm.deliveryInstructions}
                  onChange={(e) => setAddressForm({ ...addressForm, deliveryInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-[#ff5722]"
                />
                Set as default delivery address
              </label>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff5722] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
