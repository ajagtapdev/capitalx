import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
  productName: string;
  productPrice: string;
  imageUrl: string[];
  quantity: number;
  productRating: string;
  description: string;
  productCategory: string;
  productSeller: string;
  deliveryDate: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productName: string) => void;
  updateQuantity: (productName: string, quantity: number) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.productName === item.productName);
      if (existingItem) {
        return currentItems.map(i =>
          i.productName === item.productName
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productName: string) => {
    setItems(currentItems => currentItems.filter(item => item.productName !== productName));
  }, []);

  const updateQuantity = useCallback((productName: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.productName === productName
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.productPrice.replace(/[^0-9.-]+/g, ''));
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getItemCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 