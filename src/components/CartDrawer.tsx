import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Check,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FoodImage } from './FoodImage';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromo(couponInput);
    setCouponInput('');
  };

  const handleCheckoutClick = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1C1917] border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/100/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif-luxury text-stone-100">
                  Your Dining Cart
                </h2>
                <p className="text-xs text-stone-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  id="clear-cart-btn"
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-red-400 px-2 py-1 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                id="close-cart-drawer-btn"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-300">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our aromatic biriyanis, artisan pizzas, and sizzling desserts!
                  </p>
                </div>
                <button
                  id="empty-cart-explore-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/100 text-stone-950 font-semibold text-xs transition-transform hover:scale-105"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex gap-3.5 items-start relative group"
                >
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-800"
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.isVegetarian ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-sm font-semibold text-stone-200 truncate">
                        {item.name}
                      </h4>
                    </div>

                    {/* Customizations tags */}
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedCustomizations.map((c, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded border border-stone-700"
                          >
                            {c.selectedOption} {c.additionalPrice > 0 ? `(+₹${c.additionalPrice})` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        ₹{item.unitTotal * item.quantity}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-700 bg-stone-950 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="absolute top-3 right-3 text-stone-500 hover:text-red-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bill Breakdown & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-900 border-t border-stone-800 space-y-4">
              {/* Promo code bar */}
              <div className="space-y-1.5">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/100/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Promo '{appliedPromo}' applied (-₹{discount})
                    </span>
                    <button
                      onClick={removePromo}
                      className="text-stone-400 hover:text-stone-100 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="text"
                        placeholder="Coupon code (Try ZEST50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold rounded-xl border border-stone-700"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {promoError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {promoError}
                  </p>
                )}
              </div>

              {/* Price Calculation details */}
              <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="font-medium text-stone-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">GST (5%)</span>
                  <span className="font-medium text-stone-200">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Service Charge</span>
                  <span className="font-medium text-stone-200">₹{serviceCharge}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-stone-800 pt-2 flex justify-between text-base font-bold text-amber-400 font-serif-luxury">
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!user && (
                <p className="text-[11px] text-center text-stone-400">
                  *You will be prompted to log in or create an account to place an order.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
