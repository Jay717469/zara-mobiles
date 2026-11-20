import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Smartphone, 
  Sparkles, 
  Store, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { FALLBACK_PRODUCTS } from '../services/fallbackCatalog';
import { useUI } from '../context/UIContext';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function Home() {
  const ui = useUI();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(FALLBACK_PRODUCTS.length);

  // Sync search param from URL if present
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== ui.searchQuery) {
      ui.setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Load products dynamically from REST API
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [sortField, sortDirection] = (ui.sortBy || 'createdAt-desc').split('-');

        const params = {
          keyword: ui.searchQuery || undefined,
          brand: ui.selectedBrand || undefined,
          categoryId: ui.selectedCategory && ui.selectedCategory !== 'accessories' ? ui.selectedCategory : undefined,
          minPrice: ui.minPrice || undefined,
          maxPrice: ui.maxPrice || undefined,
          sortBy: sortField || 'createdAt',
          sortDir: sortDirection || 'desc',
          page: 0,
          size: 40, // Fetch ample products for browsing
        };

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          let list = res.data.content || [];

          // Handle 'accessories' category filter if selected
          if (ui.selectedCategory === 'accessories') {
            list = list.filter(p => p.categoryId >= 4);
          }

          // Handle client-side storage filter if specified
          if (ui.selectedStorage) {
            list = list.filter(p => p.storage && p.storage.toLowerCase().includes(ui.selectedStorage.toLowerCase()));
          }

          // Handle client-side condition filter if specified
          if (ui.selectedCondition) {
            if (ui.selectedCondition === 'Demo') {
              list = list.filter(p => 
                (p.name && p.name.toLowerCase().includes('demo')) ||
                (p.description && p.description.toLowerCase().includes('demo')) ||
                (p.warrantyDetails && p.warrantyDetails.toLowerCase().includes('store'))
              );
            } else if (ui.selectedCondition === 'New') {
              list = list.filter(p => 
                !p.name.toLowerCase().includes('demo') && 
                !p.warrantyDetails.toLowerCase().includes('store')
              );
            } else if (ui.selectedCondition === 'Store Warranty') {
              list = list.filter(p => p.warrantyDetails && p.warrantyDetails.toLowerCase().includes('store'));
            }
          }

          setProducts(list);
          setTotalElements(list.length);
        }
      } catch (err) {
        console.warn('API error, maintaining fallback catalog', err);
        setProducts(FALLBACK_PRODUCTS);
        setTotalElements(FALLBACK_PRODUCTS.length);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [
    ui.searchQuery,
    ui.selectedBrand,
    ui.selectedCategory,
    ui.selectedStorage,
    ui.selectedCondition,
    ui.minPrice,
    ui.maxPrice,
    ui.sortBy
  ]);

  // Active filter pills
  const hasActiveFilters = Boolean(
    ui.searchQuery ||
    ui.selectedBrand ||
    ui.selectedCategory ||
    ui.selectedStorage ||
    ui.selectedCondition ||
    ui.minPrice ||
    ui.maxPrice ||
    ui.activeCategoryTab !== 'all'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12">
      
      {/* 1. HORIZONTALLY SCROLLABLE CATEGORY NAVIGATION (From Reference Screenshot) */}
      <CategoryNav
        activeCategory={ui.activeCategoryTab}
        onSelectCategory={ui.handleSelectCategoryTab}
      />

      {/* 2. PROMOTIONAL TICKER / STORE PICKUP CALLOUT */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-b border-orange-200/60 py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-orange-950 font-semibold truncate">
            <span className="p-1 rounded-full bg-[#ff5722] text-white flex-shrink-0">
              <Store className="w-3 h-3" />
            </span>
            <span className="truncate">
              <strong>Same-Day Physical Store Pickup</strong> available at Indiranagar, Bandra West, Connaught Place &amp; T. Nagar!
            </span>
          </div>
          <button
            onClick={() => ui.setIsOffersOpen(true)}
            className="hidden sm:flex items-center gap-1 text-[#ff5722] hover:text-[#e64a19] font-extrabold flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            View Offers
          </button>
        </div>
      </div>

      {/* 3. MAIN PRODUCT LISTING SECTION */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5">
        
        {/* Active Filter Tags Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5722]" />
              Active Filters:
            </span>

            {ui.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff5722] text-xs font-bold">
                "{ui.searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => ui.setSearchQuery('')} />
              </span>
            )}

            {ui.selectedBrand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff5722] text-xs font-bold">
                Brand: {ui.selectedBrand}
                <X className="w-3 h-3 cursor-pointer" onClick={() => { ui.setSelectedBrand(''); ui.setActiveCategoryTab('all'); }} />
              </span>
            )}

            {ui.selectedStorage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff5722] text-xs font-bold">
                Storage: {ui.selectedStorage}
                <X className="w-3 h-3 cursor-pointer" onClick={() => ui.setSelectedStorage('')} />
              </span>
            )}

            {ui.selectedCondition && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff5722] text-xs font-bold">
                Condition: {ui.selectedCondition}
                <X className="w-3 h-3 cursor-pointer" onClick={() => ui.setSelectedCondition('')} />
              </span>
            )}

            {(ui.minPrice || ui.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff5722] text-xs font-bold">
                Price: ₹{ui.minPrice || '0'} - ₹{ui.maxPrice || 'Any'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => { ui.setMinPrice(''); ui.setMaxPrice(''); }} />
              </span>
            )}

            <button
              onClick={ui.resetFilters}
              className="text-xs font-extrabold text-gray-500 hover:text-red-500 ml-auto flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}

        {/* Section Header: Total Count & Quick Filter Trigger */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>{ui.selectedBrand ? `${ui.selectedBrand} Phones` : (ui.activeCategoryTab === 'accessories' ? 'Audio & Accessories' : 'Featured Smartphones')}</span>
              <span className="text-xs font-bold text-gray-400">({totalElements})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
              Sorted by: <strong className="text-gray-800">{ui.sortBy.includes('price-asc') ? 'Price (Low to High)' : 'Newest'}</strong>
            </span>
            <button
              onClick={() => ui.setIsFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-xs font-bold text-gray-700 hover:text-[#ff5722] transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5722]" />
              Filter
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loading text="Loading Zara Mobiles showroom catalog..." />
          </div>
        ) : products.length > 0 ? (
          /* PRODUCT CARDS: Mobile-First Stacked Cards (Matching Reference Screenshot) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 text-[#ff5722] flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              No Phones Found
            </h3>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              We couldn't find any smartphones matching your current filters or search query.
            </p>
            <button
              onClick={ui.resetFilters}
              className="px-6 py-2.5 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* 4. TRUST BADGES / SERVICE ASSURANCE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
          {[
            {
              title: '100% Genuine',
              desc: 'Official Brand Warranty',
              icon: ShieldCheck,
            },
            {
              title: 'Same-Day Pickup',
              desc: '4 Metro Flagship Stores',
              icon: Store,
            },
            {
              title: 'Insured Delivery',
              desc: 'All India Fast Dispatch',
              icon: Truck,
            },
            {
              title: 'Easy Exchange',
              desc: 'Up to ₹8,000 Trade Bonus',
              icon: Sparkles,
            },
          ].map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-900 truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 truncate">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
