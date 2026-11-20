import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UIProvider, useUI } from './context/UIContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import FloatingActions from './components/FloatingActions';
import OffersModal from './components/OffersModal';
import InstagramModal from './components/InstagramModal';
import ExchangeModal from './components/ExchangeModal';
import FaqsModal from './components/FaqsModal';
import ContactModal from './components/ContactModal';
import FilterDrawer from './components/FilterDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import ManageCategories from './admin/ManageCategories';
import ManageOrders from './admin/ManageOrders';
import ManageCustomers from './admin/ManageCustomers';
import Inventory from './admin/Inventory';

// Customer Layout Inner Wrapper with Modals & Mobile Bottom Nav
function CustomerLayoutInner() {
  const ui = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1F2937] pb-16 md:pb-0">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav
        onOpenExchange={() => ui.setIsExchangeOpen(true)}
        onOpenFaqs={() => ui.setIsFaqsOpen(true)}
        onOpenContact={() => ui.setIsContactOpen(true)}
      />

      {/* Floating Instagram & WhatsApp Action Buttons */}
      <FloatingActions
        onOpenInstagram={() => ui.setIsInstagramOpen(true)}
      />

      {/* Global Interactive Modals */}
      <OffersModal
        isOpen={ui.isOffersOpen}
        onClose={() => ui.setIsOffersOpen(false)}
      />

      <InstagramModal
        isOpen={ui.isInstagramOpen}
        onClose={() => ui.setIsInstagramOpen(false)}
      />

      <ExchangeModal
        isOpen={ui.isExchangeOpen}
        onClose={() => ui.setIsExchangeOpen(false)}
      />

      <FaqsModal
        isOpen={ui.isFaqsOpen}
        onClose={() => ui.setIsFaqsOpen(false)}
      />

      <ContactModal
        isOpen={ui.isContactOpen}
        onClose={() => ui.setIsContactOpen(false)}
      />

      <FilterDrawer
        isOpen={ui.isFilterOpen}
        onClose={() => ui.setIsFilterOpen(false)}
        brands={['Apple', 'Samsung', 'OnePlus', 'Redmi', 'Realme', 'Xiaomi', 'Google', 'Sony', 'Anker', 'Spigen']}
        selectedBrand={ui.selectedBrand}
        onSelectBrand={ui.setSelectedBrand}
        selectedCategory={ui.selectedCategory}
        onSelectCategory={ui.setSelectedCategory}
        selectedStorage={ui.selectedStorage}
        onSelectStorage={ui.setSelectedStorage}
        selectedCondition={ui.selectedCondition}
        onSelectCondition={ui.setSelectedCondition}
        minPrice={ui.minPrice}
        maxPrice={ui.maxPrice}
        onPriceChange={(min, max) => {
          ui.setMinPrice(min);
          ui.setMaxPrice(max);
        }}
        sortBy={ui.sortBy}
        onSortChange={ui.setSortBy}
        onResetAll={ui.resetFilters}
      />
    </div>
  );
}

function CustomerLayout() {
  return (
    <UIProvider>
      <CustomerLayoutInner />
    </UIProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Storefront Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Protected Customer Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="inventory" element={<Inventory />} />
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
