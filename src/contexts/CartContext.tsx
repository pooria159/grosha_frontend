import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CartItem {
  id: number;
  product_id: number;
  seller_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image: string;
  store_name: string;
  product_stock: number;
}

interface CartContextType {
  cart: {
    id: number;
    items: CartItem[];
    total_items: number;
    total_price: number;
  } | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, sellerId: number, productData: {
    name: string;
    price: number;
    image: string;
    storeName: string;
    stock: number;
  }, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  removeFromCartByProduct: (productId: number, sellerId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  isInCart: (productId: number, sellerId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartContextType['cart']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    };
  };

  const fetchCart = async () => {
    if (!isAuthenticated()) {
      setCart(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/cart/', getAuthHeader());
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت سبد خرید');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const addToCart = async (
    productId: number,
    sellerId: number,
    productData: {
      name: string;
      price: number;
      image: string;
      storeName: string;
      stock: number;
    },
    quantity: number = 1
  ) => {
    if (!isAuthenticated()) {
      navigate('/login');
      toast.error('لطفاً ابتدا وارد شوید');
      return;
    }

    try {
      setLoading(true);
      
      if (productData.stock < quantity) {
        toast.error('موجودی محصول کافی نیست');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/cart/items/', {
        product_id: productId,
        seller_id: sellerId,
        quantity,
        product_name: productData.name,
        product_price: productData.price,
        product_image: productData.image,
        store_name: productData.storeName,
        product_stock: productData.stock
      }, getAuthHeader());

      await fetchCart();
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('خطا در افزودن به سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`http://localhost:8000/api/cart/items/${itemId}/`, { quantity }, getAuthHeader());
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
      toast.error('خطا در به‌روزرسانی سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/cart/items/${itemId}/remove/`, getAuthHeader());
      await fetchCart();
      toast.success('محصول از سبد خرید حذف شد');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('خطا در حذف از سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCartByProduct = async (productId: number, sellerId: number) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/cart/items/${productId}/${sellerId}/remove/`, getAuthHeader());
      await fetchCart();
      toast.success('محصول از سبد خرید حذف شد');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('خطا در حذف از سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete('http://localhost:8000/api/cart/clear/', getAuthHeader());
      await fetchCart();
      toast.success('سبد خرید خالی شد');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('خطا در خالی کردن سبد خرید');
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId: number, sellerId: number) => {
    return cart?.items?.some(
      item => item.product_id === productId && item.seller_id === sellerId
    ) || false;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        removeFromCartByProduct,
        clearCart,
        fetchCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};