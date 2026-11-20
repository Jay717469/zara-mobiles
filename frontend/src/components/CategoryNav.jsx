import React from 'react';

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'apple', label: 'APPLE', brand: 'Apple' },
    { id: 'samsung', label: 'SAMSUNG', brand: 'Samsung' },
    { id: 'oneplus', label: 'ONEPLUS', brand: 'OnePlus' },
    { id: 'redmi', label: 'REDMI', brand: 'Redmi' },
    { id: 'realme', label: 'REALME', brand: 'Realme' },
    { id: 'accessories', label: 'ACCESSORIES', isAccessory: true },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-2.5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`flex-shrink-0 text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ff5722] text-white font-black px-5 py-2 shadow-md shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 font-bold px-4 py-2 border border-gray-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
