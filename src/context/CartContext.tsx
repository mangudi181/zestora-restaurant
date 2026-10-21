import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, CartItemCustomization } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (food: FoodItem, quantity: number, customizations?: CartItemCustomization[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  promoCode: string;
  appliedPromo: string | null;
  promoError: string | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem('zestora_cart');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zestora_cart', JSON.stringify(items));
  }, [items]);

  // If token changes, optionally fetch user cart from server
  useEffect(() => {
    if (token) {
      fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((serverCart) => {
          if (serverCart && serverCart.length > 0) {
            setItems(serverCart);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const addToCart = (
    food: FoodItem,
    quantity: number = 1,
    customizations: CartItemCustomization[] = []
  ) => {
    const customTotal = customizations.reduce((acc, c) => acc + c.additionalPrice, 0);
    const unitTotal = food.price + customTotal;

    // Build signature to group identical items with exact same customizations
    const customSignature = JSON.stringify(
      customizations
        .map((c) => `${c.groupName}:${c.selectedOption}:${c.additionalPrice}`)
        .sort()
    );

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => {
        const itemSig = JSON.stringify(
          (item.selectedCustomizations || [])
            .map((c) => `${c.groupName}:${c.selectedOption}:${c.additionalPrice}`)
            .sort()
        );
        return item.foodId === food.id && itemSig === customSignature;
      });

      let updated: CartItem[];
      if (existingIdx !== -1) {
        updated = [...prev];
        updated[existingIdx].quantity += quantity;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity,
          image: food.image,
          isVegetarian: food.isVegetarian,
          selectedCustomizations: customizations,
          customizationTotal: customTotal,
          unitTotal
        };
        updated = [...prev, newItem];
      }

      // Sync to server if logged in
      if (token) {
        const itemToSync = updated[existingIdx !== -1 ? existingIdx : updated.length - 1];
        fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(itemToSync)
        }).catch(() => {});
      }

      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (token) {
        const target = updated.find((i) => i.cartItemId === cartItemId);
        if (target) {
          fetch(`/api/cart/${cartItemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: target.quantity })
          }).catch(() => {});
        } else {
          fetch(`/api/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => {});
        }
      }

      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (token) {
      fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setPromoCode('');
    if (token) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ZEST50' || clean === 'WELCOME50') {
      setAppliedPromo(clean);
      setPromoError(null);
      return true;
    } else if (clean === 'ZESTORA100') {
      setAppliedPromo(clean);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid coupon code. Try ZEST50 for ₹50 off!');
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError(null);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0);
  const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
  const serviceCharge = subtotal > 0 ? 20 : 0;

  let discount = 0;
  if (appliedPromo === 'ZEST50' || appliedPromo === 'WELCOME50') {
    discount = Math.min(50, subtotal);
  } else if (appliedPromo === 'ZESTORA100') {
    discount = Math.min(100, subtotal);
  }

  const total = Math.max(0, subtotal + tax + serviceCharge - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        tax,
        serviceCharge,
        discount,
        total,
        promoCode,
        appliedPromo,
        promoError,
        applyPromo,
        removePromo,
        isCartOpen,
        setIsCartOpen
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
