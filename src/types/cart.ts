export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  quantity: number;
  urlFriendlyName: string;
  status?: string;
  depositAmount?: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export interface CheckoutFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}
