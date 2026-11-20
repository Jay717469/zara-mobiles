import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Search,
  PackageOpen,
  X,
  Smartphone
} from 'lucide-react';
import { productService } from '../services/productService';
import { FALLBACK_PRODUCTS } from '../services/fallbackCatalog';
import { useUI } from '../context/UIContext';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

export default function Products() {
  const ui = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL or UI context
  const keywordParam = searchParams.get('keyword') || searchParams.get('search') || ui.searchQuery || '';
  const categoryParam = searchParams.get('category') || ui.selectedCategory || '';
  const brandParam = searchParams.get('brand') || ui.selectedBrand || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    totalPages: 1,
    totalElements: FALLBACK_PRODUCTS.length,
  });
  const [loading, setLoading] = useState(false);

  // Sync keyword if URL changes
  useEffect(() => {
    if (keywordParam && keywordParam !== ui.searchQuery) {
      ui.setSearchQuery(keywordParam);
    }
  }, [keywordParam]);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [sortField, sortDirection] = (ui.sortBy || 'createdAt-desc').split('-');

        const params = {
          categoryId: categoryParam && categoryParam !== 'accessories' ? categoryParam : undefined,
          brand: brandParam || undefined,
          minPrice: ui.minPrice || undefined,
          maxPrice: ui.maxPrice || undefined,
          keyword: keywordParam || undefined,
          page: pageParam,
          size: 16,
          sortBy: sortField,
          sortDir: sortDirection,
        };

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          let list = res.data.content || [];

          if (categoryParam === 'accessories') {
            list = list.filter(p => p.categoryId >= 4);
          }

          if (ui.selectedStorage) {
            list = list.filter(p => p.storage && p.storage.toLowerCase().includes(ui.selectedStorage.toLowerCase()));
          }

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
          setPageInfo({
            pageNumber: res.data.pageNumber,
            totalPages: res.data.totalPages,
            totalElements: list.length,
          });
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, brandParam, ui.minPrice, ui.maxPrice, keywordParam, ui.sortBy, ui.selectedStorage, ui.selectedCondition, pageParam]);

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12">
      {/* Horizontally scrollable Category Nav */}
      <CategoryNav
        activeCategory={ui.activeCategoryTab}
        onSelectCategory={(cat) => {
          ui.handleSelectCategoryTab(cat);
          const next = new URLSearchParams(searchParams);
          if (cat.id === 'all') {
            next.delete('brand');
            next.delete('category');
          } else if (cat.brand) {
            next.set('brand', cat.brand);
            next.delete('category');
          } else if (cat.isAccessory) {
            next.set('category', 'accessories');
            next.delete('brand');
          }
          next.set('page', '0');
          setSearchParams(next);
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              {brandParam ? `${brandParam} Smartphones` : (categoryParam === 'accessories' ? 'Audio & Accessories' : 'All Smartphones')}
              <span className="text-xs font-bold text-gray-400 ml-1.5">({pageInfo.totalElements})</span>
            </h1>
          </div>

          <button
            onClick={() => ui.setIsFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-xs font-bold text-gray-700 hover:text-[#ff5722] transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5722]" />
            Filter
          </button>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loading text="Loading showroom inventory..." />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 text-[#ff5722] flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              No Phones Found
            </h3>
            <p className="text-xs text-gray-600 mb-5">
              Try adjusting your price range, storage, or brand filters.
            </p>
            <button
              onClick={() => {
                ui.resetFilters();
                setSearchParams({});
              }}
              className="px-6 py-2.5 bg-[#ff5722] hover:bg-[#e64a19] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pageInfo.pageNumber - 1)}
              disabled={pageInfo.pageNumber === 0}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-gray-700 px-3 py-1.5 bg-white rounded-xl border border-gray-200">
              Page {pageInfo.pageNumber + 1} of {pageInfo.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pageInfo.pageNumber + 1)}
              disabled={pageInfo.pageNumber >= pageInfo.totalPages - 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
