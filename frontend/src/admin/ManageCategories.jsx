import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { productService } from '../services/productService';
import Loading from '../components/Loading';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await productService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isActive: cat.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await productService.updateCategory(editingCategory.id, form);
      } else {
        await productService.createCategory(form);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await productService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">Product classifications and navigation taxonomy</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <Loading text="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=150&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">/{cat.slug}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  placeholder="e.g. flagship-smartphones (auto-generated if empty)"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
