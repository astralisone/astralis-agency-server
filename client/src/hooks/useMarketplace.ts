import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
  status: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || '/api';

  const fetchProducts = async (params: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/marketplace/products/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await fetch(`${apiUrl}/marketplace/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity })
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
  };

  const createOrder = async (orderData: {
    items: Array<{ productId: number; quantity: number }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
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
      setCart({ items: [], subtotal: 0, total: 0 });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    products,
    cart,
    loading,
    error,
    fetchProducts,
    addToCart,
    createOrder,
    setError
  };
};

export default useMarketplace;
