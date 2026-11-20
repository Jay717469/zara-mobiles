import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      const res = await cartService.getCart();
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const res = await cartService.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart(null);
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to add items to your cart');
    }
    setLoading(true);
    try {
      const res = await cartService.addToCart(productId, quantity, variantId);
      if (res.success) {
        setCart(res.data);
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to update cart quantity', err);
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartService.removeItem(itemId);
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to remove cart item', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to manage your wishlist');
    }
    const alreadyIn = wishlist.some((item) => item.productId === productId);
    try {
      if (alreadyIn) {
        const res = await cartService.removeFromWishlist(productId);
        if (res.success) {
          setWishlist(res.data.items || []);
        }
      } else {
        const res = await cartService.addToWishlist(productId);
        if (res.success) {
          setWishlist(res.data.items || []);
        }
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlist.length;

  const value = {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    loading,
    fetchCart,
    fetchWishlist,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toggleWishlist,
    isInWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
