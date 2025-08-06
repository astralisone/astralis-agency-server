import { useState, useEffect, useCallback } from 'react';

export interface MarketplaceItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  status: string;
  featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  seller?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CartItem {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
  item: {
    id: string;
    title: string;
    imageUrl?: string;
    slug: string;
    stock: number;
  };
}

export interface Cart {
  id?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  inStock?: boolean;
}

export const useMarketplace = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  const fetchItems = useCallback(async (filters: SearchFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/marketplace/products/search?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error('Fetch items error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/marketplace/cart`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const cartData = await response.json();
      setCart(cartData);
      return cartData;
    } catch (err) {
      console.error('Fetch cart error:', err);
      // Don't set error for cart fetch failures, just use empty cart
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
    }
  }, [apiUrl]);

  const addToCart = useCallback(async (itemId: string, quantity: number = 1) => {
    try {
      const response = await fetch(`${apiUrl}/marketplace/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(errorMessage);
      throw err;
    }
  }, [apiUrl]);

  const createOrder = useCallback(async (orderData: {
    items: Array<{ itemId: string; quantity: number }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
    couponCode?: string;
  }) => {
    try {
      const response = await fetch(`${apiUrl}/marketplace/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      // Clear cart after successful order
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    }
  }, [apiUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    items,
    cart,
    loading,
    error,
    pagination,
    fetchItems,
    fetchCart,
    addToCart,
    createOrder,
    clearError
  };
};

export default useMarketplace;
