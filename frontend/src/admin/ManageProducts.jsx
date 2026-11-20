import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Smartphone, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { productService } from '../services/productService';
import Loading from '../components/Loading';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    brand: '',
    model: '',
    sku: '',
    description: '',
    price: '',
    discountPercentage: '0',
    stockQuantity: '10',
    ram: '',
    storage: '',
    processor: '',
    display: '',
    battery: '',
    camera: '',
    color: '',
    warrantyDetails: '1 Year Brand Warranty',
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    imageUrls: [''],
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ size: 100 }),
        productService.getCategories(),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.content || []);
      }
      if (catRes.success) {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      categoryId: categories[0]?.id || '',
      name: '',
      brand: '',
      model: '',
      sku: `ZM-PROD-${Date.now().toString().slice(-4)}`,
      description: '',
      price: '',
      discountPercentage: '0',
      stockQuantity: '10',
      ram: '',
      storage: '',
      processor: '',
      display: '',
      battery: '',
      camera: '',
      color: '',
      warrantyDetails: '1 Year Brand Warranty',
      isActive: true,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      imageUrls: [''],
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      categoryId: p.categoryId || categories[0]?.id || '',
      name: p.name || '',
      brand: p.brand || '',
      model: p.model || '',
      sku: p.sku || '',
      description: p.description || '',
      price: p.price?.toString() || '',
      discountPercentage: p.discountPercentage?.toString() || '0',
      stockQuantity: p.stockQuantity?.toString() || '0',
      ram: p.ram || '',
      storage: p.storage || '',
      processor: p.processor || '',
      display: p.display || '',
      battery: p.battery || '',
      camera: p.camera || '',
      color: p.color || '',
      warrantyDetails: p.warrantyDetails || '',
      isActive: p.isActive ?? true,
      isFeatured: p.isFeatured ?? false,
      isTrending: p.isTrending ?? false,
      isBestSeller: p.isBestSeller ?? false,
      imageUrls: p.images && p.images.length > 0 ? p.images.map((i) => i.imageUrl) : [p.primaryImageUrl || ''],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        price: parseFloat(form.price),
        discountPercentage: parseFloat(form.discountPercentage || 0),
        stockQuantity: parseInt(form.stockQuantity || 0, 10),
        imageUrls: form.imageUrls.filter((url) => url && url.trim().length > 0),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!keyword.trim()) return true;
    const term = keyword.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">Catalog control, pricing, specifications, and device status</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filter by name, brand, or SKU..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loading text="Loading catalog..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Brand / Model</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]" title={p.name}>
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{p.brand}</span>
                      <span className="block text-[11px] text-slate-400">{p.model}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{p.sku}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{Number(p.finalPrice || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {p.discountPercentage > 0 ? (
                        <span className="text-rose-600 font-bold">{p.discountPercentage}%</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${p.stockQuantity < 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.discountPercentage}
                    onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              {/* Technical Specifications Subform */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
                <p className="font-bold text-slate-800">Hardware Specifications</p>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="RAM (e.g. 12 GB)"
                    value={form.ram}
                    onChange={(e) => setForm({ ...form, ram: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Storage (e.g. 256 GB)"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Processor"
                    value={form.processor}
                    onChange={(e) => setForm({ ...form, processor: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Display Panel"
                    value={form.display}
                    onChange={(e) => setForm({ ...form, display: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Battery & Charging"
                    value={form.battery}
                    onChange={(e) => setForm({ ...form, battery: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Camera Setup"
                    value={form.camera}
                    onChange={(e) => setForm({ ...form, camera: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrls[0] || ''}
                  onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-semibold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded text-[#2563EB]"
                  /> Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded text-[#2563EB]"
                  /> Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isTrending}
                    onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
                    className="rounded text-[#2563EB]"
                  /> Trending
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="rounded text-[#2563EB]"
                  /> Best Seller
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
