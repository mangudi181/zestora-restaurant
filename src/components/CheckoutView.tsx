import React, { useState, useEffect } from 'react';
import {
  Utensils,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShoppingBag,
  Building,
  ShieldAlert
} from 'lucide-react';
import { OrderType, PaymentMethod, RestaurantTable, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FoodImage } from './FoodImage';

interface CheckoutViewProps {
  tables: RestaurantTable[];
  onOrderPlaced: (order: Order) => void;
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  tables,
  onOrderPlaced,
  onNavigate
}) => {
  const { user, token } = useAuth();
  const {
    items,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total,
    clearCart
  } = useCart();

  // Customer info
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');

  // Order type
  const [orderType, setOrderType] = useState<OrderType>('Dine-In');
  const [selectedTableId, setSelectedTableId] = useState<string>('');

  // Delivery details
  const [houseNumber, setHouseNumber] = useState(user?.address?.houseNumber || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(user?.address?.pincode || '560038');
  const [landmark, setLandmark] = useState(user?.address?.landmark || '');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone);
      if (!customerEmail) setCustomerEmail(user.email);
    }
    if (tables.length > 0 && !selectedTableId) {
      const avail = tables.find((t) => t.status === 'Available');
      if (avail) setSelectedTableId(avail.id);
    }
  }, [user, tables]);

  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/100 text-stone-950 flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            Our kitchen team has received your ticket and is preparing your freshly cooked dishes with love.
          </p>
        </div>

        {/* Order Details card */}
        <div className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-sm text-left max-w-lg mx-auto space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div>
              <span className="text-xs text-stone-400 block">Order ID</span>
              <span className="text-base font-bold font-mono text-amber-400">
                {placedOrder.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Order Type</span>
              <span className="text-xs font-bold text-stone-100 bg-stone-800/50 px-2.5 py-1 rounded-full">
                {placedOrder.orderType}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-300">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-semibold text-stone-100">{placedOrder.customerName}</span>
            </div>
            {placedOrder.tableNumber && (
              <div className="flex justify-between">
                <span>Dine-In Table:</span>
                <span className="font-semibold text-stone-100">{placedOrder.tableNumber}</span>
              </div>
            )}
            {placedOrder.deliveryAddress && (
              <div className="flex justify-between">
                <span>Delivery To:</span>
                <span className="font-semibold text-stone-100 text-right">
                  {placedOrder.deliveryAddress.houseNumber}, {placedOrder.deliveryAddress.street}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold text-stone-100">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 text-sm font-bold text-amber-400">
              <span>Grand Total:</span>
              <span>₹{placedOrder.total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 rounded-2xl bg-stone-800/50 hover:bg-stone-200 text-stone-200 text-xs font-semibold transition-colors"
          >
            Order More Food
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-8 py-3.5 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-sm font-bold shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-100">
          Your cart is empty
        </h2>
        <p className="text-xs text-stone-500">
          Please add dishes from our menu before heading to checkout.
        </p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-3 rounded-xl bg-amber-500/100 text-stone-950 font-bold text-xs"
        >
          Explore Food Menu
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('You must be logged in to place an order.');
      return;
    }

    if (orderType === 'Delivery') {
      if (!houseNumber || !street || !city || !pincode) {
        setError('Please fill in complete delivery address details.');
        return;
      }
    }

    let targetTable = tables.find((t) => t.id === selectedTableId);
    if (orderType === 'Dine-In' && !targetTable) {
      setError('Please select a dining table for Dine-In orders.');
      return;
    }

    setSubmitting(true);
    setShowPaymentGateway(true);

    // Simulate payment gateway delay and UI
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowPaymentGateway(false);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          orderType,
          tableId: orderType === 'Dine-In' ? targetTable?.id : undefined,
          tableNumber: orderType === 'Dine-In' ? targetTable?.tableNumber : undefined,
          deliveryAddress:
            orderType === 'Delivery'
              ? { houseNumber, street, city, pincode, landmark }
              : undefined,
          paymentMethod,
          subtotal,
          tax,
          serviceCharge,
          discount,
          total
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to place order');
        setSubmitting(false);
        return;
      }

      clearCart();
      setPlacedOrder(data.order);
      onOrderPlaced(data.order);
    } catch (err) {
      setError('Network error while placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
          Order Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your information and choose your dining preferences
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Customer Information */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Order Type Selection */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                2
              </span>
              Select Order Type
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {(['Dine-In', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => {
                const isActive = orderType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500/100 text-stone-950 border-amber-500 font-bold shadow-md'
                        : 'bg-stone-950 border-white/10 text-stone-300 hover:bg-stone-800/50 font-semibold text-xs'
                    }`}
                  >
                    {type === 'Dine-In' && <Utensils className="w-4 h-4" />}
                    {type === 'Takeaway' && <Clock className="w-4 h-4" />}
                    {type === 'Delivery' && <MapPin className="w-4 h-4" />}
                    <span className="text-xs">{type}</span>
                  </button>
                );
              })}
            </div>

            {/* If Dine-In: Table Picker */}
            {orderType === 'Dine-In' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-white/10 space-y-4">
                <label className="block text-sm font-bold text-stone-200">
                  Select Dine-In Table:
                </label>
                
                {['Window', 'Center', 'Patio', 'Booth'].map(zone => {
                  const zoneTables = tables.filter(t => t.location === zone);
                  if (zoneTables.length === 0) return null;
                  
                  return (
                    <div key={zone} className="space-y-2">
                      <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">{zone} Seating</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {zoneTables.map((table) => {
                          const isSelected = selectedTableId === table.id;
                          const isAvail = table.status === 'Available';
                          return (
                            <button
                              key={table.id}
                              type="button"
                              onClick={() => setSelectedTableId(table.id)}
                              disabled={!isAvail}
                              className={`p-3 rounded-xl text-xs border text-center transition-all flex flex-col items-center gap-1 ${
                                isSelected
                                  ? 'bg-stone-900 text-amber-400 border-amber-500 font-bold ring-2 ring-amber-500 shadow-lg shadow-amber-500/20'
                                  : isAvail
                                  ? 'bg-stone-900/60 border-white/10 text-stone-200 hover:border-amber-400 hover:bg-stone-800'
                                  : 'bg-stone-900/30 border-white/5 text-stone-600 cursor-not-allowed'
                              }`}
                            >
                              <span className="block font-bold text-sm">{table.tableNumber}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-500/20 text-amber-400' : isAvail ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-500'}`}>
                                {table.capacity} Seats
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* If Delivery: Address Fields */}
            {orderType === 'Delivery' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-stone-200 block">
                  Delivery Destination Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      House / Flat No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      placeholder="e.g. 204, Green Park"
                      className="w-full px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      Street / Road *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 100ft Road, Indiranagar"
                      className="w-full px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Behind Metro Station"
                      className="w-full px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                3
              </span>
              Payment Options (Mock Payment Flow)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI', label: 'Instant UPI', icon: QrCode },
                { id: 'Credit/Debit Card', label: 'Card Payment', icon: CreditCard },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
                { id: 'Pay at Restaurant', label: 'Pay at Counter', icon: Building }
              ].map((p) => {
                const isSelected = paymentMethod === p.id;
                const IconComp = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/100/15 border-amber-500 text-amber-900 font-bold'
                        : 'bg-stone-950 border-white/10 text-stone-300 hover:bg-stone-800/50 text-xs font-semibold'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mock payment details */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-amber-500/10/50 border border-amber-200/60 flex flex-col sm:flex-row items-center gap-4 text-xs">
                <div className="w-24 h-24 bg-stone-900/40 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-stone-200" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="font-bold text-stone-100 block">Scan QR Code with GPay, PhonePe, Paytm</span>
                  <span className="text-stone-500 block">Or enter your VPA / UPI handle:</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="px-3 py-1.5 bg-stone-900/40 backdrop-blur-md border border-stone-300 rounded-lg text-xs w-full max-w-xs focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    ✓ Simulated Instant UPI Auto-Approval
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'Credit/Debit Card' && (
              <div className="p-4 rounded-2xl bg-stone-950 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-stone-200 block">Simulated Card Payment:</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="col-span-2 px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-stone-300 rounded-lg text-xs"
                    placeholder="Card Number"
                  />
                  <input
                    type="text"
                    defaultValue="12/28"
                    className="px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-stone-300 rounded-lg text-xs"
                    placeholder="MM/YY"
                  />
                  <input
                    type="password"
                    defaultValue="•••"
                    className="px-3 py-2 bg-stone-900/40 backdrop-blur-md border border-stone-300 rounded-lg text-xs"
                    placeholder="CVV"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-5 sticky top-28">
            <h3 className="text-lg font-bold font-serif-luxury text-stone-100 pb-3 border-b border-white/5">
              Order Summary ({items.length} dishes)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-800/50"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span className="font-semibold text-stone-200 truncate">
                          {item.quantity} × {item.name}
                        </span>
                      </div>
                      {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                        <span className="text-[10px] text-stone-500 block truncate">
                          {item.selectedCustomizations.map((c) => c.selectedOption).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-stone-100 shrink-0">
                    ₹{item.unitTotal * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-white/5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-stone-100">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span className="font-medium text-stone-100">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Service / Packaging:</span>
                <span className="font-medium text-stone-100">₹{serviceCharge}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex justify-between text-lg font-bold font-serif-luxury text-amber-400">
                <span>Total Payable:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              id="checkout-place-order-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                'Processing Order...'
              ) : (
                <>
                  <span>Place Order & Pay • ₹{total}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-stone-400">
              🔒 Safe Mock Checkout • No real banking cards required.
            </p>
          </div>
        </div>
      </form>

      {/* Payment Gateway Modal Overlay */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 animate-slide-up shadow-amber-500/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold font-serif-luxury text-stone-100 text-glow">
                Processing Payment
              </h3>
              <p className="text-sm text-stone-400">
                Securely connecting to bank...
              </p>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              End-to-End Encrypted
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
