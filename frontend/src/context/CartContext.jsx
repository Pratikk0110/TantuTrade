import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') return;
    const res = await api.get('/cart');
    setCart(res.data.cart);
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    setCart(res.data.cart);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    setCart(res.data.cart);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + i.quantity * (i.product?.price || i.priceAtAdd), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, refreshCart, addToCart, updateItem, removeItem, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
