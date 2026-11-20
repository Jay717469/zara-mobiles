import React, { useState } from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function FilterDrawer({
  isOpen,
  onClose,
  brands = [],
  categories = [],
  selectedBrand,
  onSelectBrand,
  selectedCategory,
  onSelectCategory,
  selectedStorage,
  onSelectStorage,
  selectedCondition,
  onSelectCondition,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onResetAll,
}) {
  if (!isOpen) return null;

  const storageOptions = ['All', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const conditionOptions = ['All', 'New', 'Demo', 'Store Warranty'];

  const quickPriceRanges = [
    { label: 'Under ₹25K', min: '', max: '25000' },
    { label: '₹25K - ₹50K', min: '25000', max: '50000' },
    { label: '₹50K - ₹1 Lakh', min: '50000', max: '100000' },
    { label: 'Above ₹1 Lakh', min: '100000', max: '' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-[#ff5722] via-[#ff4500] to-[#e64a19] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-white" />
            <h3 className="text-lg font-black text-white">Filter Phones</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Brand
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectBrand('')}
                className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                  !selectedBrand
                    ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onSelectBrand(selectedBrand === b ? '' : b)}
                  className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                    selectedBrand === b
                      ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCategory('')}
                  className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                    !selectedCategory
                      ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectCategory(selectedCategory === c.id.toString() ? '' : c.id.toString())}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                      selectedCategory === c.id.toString()
                        ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Condition &amp; Warranty
            </label>
            <div className="grid grid-cols-2 gap-2">
              {conditionOptions.map((cond) => {
                const isActive = (selectedCondition || 'All') === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => onSelectCondition(cond === 'All' ? '' : cond)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-orange-50 border-[#ff5722] text-[#ff5722]'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cond}</span>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storage Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Storage Capacity
            </label>
            <div className="flex flex-wrap gap-2">
              {storageOptions.map((st) => {
                const isActive = (selectedStorage || 'All') === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onSelectStorage(st === 'All' ? '' : st)}
                    className={`py-1.5 px-3.5 rounded-full text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Price Range (₹)
            </label>
            
            {/* Quick Price Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {quickPriceRanges.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPriceChange(q.min, q.max)}
                  className="py-1.5 px-2 bg-gray-50 hover:bg-orange-50 hover:text-[#ff5722] border border-gray-200 hover:border-orange-200 rounded-xl text-[11px] font-semibold text-gray-700 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice || ''}
                onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice || ''}
                onChange={(e) => onPriceChange(minPrice, e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
              />
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'createdAt-desc', label: 'Newest Arrivals' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'rating-desc', label: 'Customer Rating' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSortChange(s.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    sortBy === s.id
                      ? 'bg-orange-50 border-[#ff5722] text-[#ff5722]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
          <button
            type="button"
            onClick={onResetAll}
            className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl border border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
