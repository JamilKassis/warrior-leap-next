'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '@/types/cart';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART_OPEN':
      return { ...state, isCartOpen: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('warriorLeapCart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warriorLeapCart', JSON.stringify(state.items));
    }
  }, [state.items, isLoaded]);

  const contextValue: CartContextType = {
    items: state.items,
    isCartOpen: state.isCartOpen,
    addItem: (product: Omit<CartItem, 'quantity'>) => {
      dispatch({ type: 'ADD_ITEM', payload: product });
    },
    removeItem: (id: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    },
    updateQuantity: (id: string, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('warriorLeapCart');
    },
    getTotalItems: () => state.items.reduce((total, item) => total + item.quantity, 0),
    getTotalPrice: () => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    setIsCartOpen: (open: boolean) => {
      dispatch({ type: 'SET_CART_OPEN', payload: open });
    },
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
