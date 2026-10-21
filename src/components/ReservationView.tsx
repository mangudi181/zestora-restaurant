import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Utensils,
  Check,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { RestaurantTable, FoodItem, CartItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FoodImage } from './FoodImage';

interface ReservationViewProps {
  tables: RestaurantTable[];
  foods: FoodItem[];
  onReservationComplete: (resId: string) => void;
  onNavigate: (view: string) => void;
}

export const ReservationView: React.FC<ReservationViewProps> = ({
  tables,
  foods,
  onReservationComplete,
  onNavigate
}) => {
  const { user, openAuthModal, token } = useAuth();
  const { clearCart } = useCart();

  // Reservation form state
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('07:30 PM');
  const [guests, setGuests] = useState(4);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Combined Food Pre-Order state (Section 8 feature)
  const [enablePreOrder, setEnablePreOrder] = useState(true);
  const [preOrderItems, setPreOrderItems] = useState<{ food: FoodItem; quantity: number }[]>([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reservationId: string;
    orderId?: string;
    tableName: string;
    date: string;
    time: string;
    guests: number;
    totalAmount?: number;
  } | null>(null);

  // Default pre-order recommendations
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Initial table selection
  useEffect(() => {
    if (tables.length > 0 && !selectedTable) {
      const avail = tables.find((t) => t.status === 'Available' && t.capacity >= guests);
      if (avail) setSelectedTable(avail);
    }
  }, [tables, guests]);

  const times = [
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM'
  ];

  const handleTableClick = (table: RestaurantTable) => {
    if (table.status !== 'Available') return;
    setSelectedTable(table);
  };

  const handleAddPreOrderItem = (food: FoodItem) => {
    setPreOrderItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleUpdatePreOrderQty = (foodId: string, delta: number) => {
    setPreOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.food.id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { food: FoodItem; quantity: number }[]
    );
  };

  const preOrderSubtotal = preOrderItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );
  const preOrderTax = Math.round(preOrderSubtotal * 0.05);
  const preOrderTotal = preOrderSubtotal + preOrderTax;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!selectedTable) {
      setError('Please select an available table from the floor plan.');
      return;
    }

    if (guests > selectedTable.capacity) {
      setError(`Selected ${selectedTable.tableNumber} has a capacity of ${selectedTable.capacity} guests. Please choose a table with higher capacity or reduce guests.`);
      return;
    }

    setSubmitting(true);

    try {
      // 1. If pre-order items exist, create order first or directly pass to reservation
      let foodOrderId: string | undefined = undefined;

      if (enablePreOrder && preOrderItems.length > 0) {
        const orderItemsPayload: CartItem[] = preOrderItems.map((item) => ({
          cartItemId: `preorder-${item.food.id}-${Date.now()}`,
          foodId: item.food.id,
          name: item.food.name,
          price: item.food.price,
          quantity: item.quantity,
          image: item.food.image,
          isVegetarian: item.food.isVegetarian,
          customizationTotal: 0,
          unitTotal: item.food.price
        }));

        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            items: orderItemsPayload,
            orderType: 'Dine-In',
            tableId: selectedTable.id,
            tableNumber: selectedTable.tableNumber,
            paymentMethod: 'Pay at Restaurant',
            subtotal: preOrderSubtotal,
            tax: preOrderTax,
            serviceCharge: 0,
            discount: 0,
            total: preOrderTotal,
            isPreOrder: true
          })
        });

        if (orderRes.ok) {
          const ordData = await orderRes.json();
          foodOrderId = ordData.order.id;
        }
      }

      // 2. Create reservation
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          date,
          time,
          guests,
          tableId: selectedTable.id,
          tableNumber: selectedTable.tableNumber,
          specialRequest,
          foodOrderId,
          preOrderItems: preOrderItems.map((p) => ({
            cartItemId: `item-${p.food.id}`,
            foodId: p.food.id,
            name: p.food.name,
            price: p.food.price,
            quantity: p.quantity,
            image: p.food.image,
            isVegetarian: p.food.isVegetarian,
            customizationTotal: 0,
            unitTotal: p.food.price
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to book table');
        setSubmitting(false);
        return;
      }

      setSuccessData({
        reservationId: data.reservation.reservationId,
        orderId: foodOrderId,
        tableName: selectedTable.tableNumber,
        date,
        time,
        guests,
        totalAmount: foodOrderId ? preOrderTotal : undefined
      });

      onReservationComplete(data.reservation.reservationId);
    } catch (err) {
      setError('An error occurred while booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTableButton = (table: RestaurantTable) => {
    const isSelected = selectedTable?.id === table.id;
    const isAvailable = table.status === 'Available';

    let statusClasses = '';
    if (isSelected) {
      statusClasses =
        'bg-amber-500/100 text-stone-950 ring-4 ring-amber-400/50 scale-105 shadow-xl font-bold';
    } else if (isAvailable) {
      statusClasses =
        'bg-stone-800/90 text-stone-100 hover:bg-stone-700 hover:border-amber-400 border border-emerald-600/70 cursor-pointer shadow-md';
    } else {
      statusClasses =
        'bg-stone-900/60 text-stone-500 border border-stone-800 cursor-not-allowed opacity-50';
    }

    return (
      <button
        key={table.id}
        type="button"
        id={`table-seat-btn-${table.id}`}
        onClick={() => handleTableClick(table)}
        disabled={!isAvailable}
        className={`p-4 rounded-2xl flex flex-col items-center justify-between text-center transition-all min-h-[110px] relative ${statusClasses}`}
      >
        {/* Capacity badge */}
        <span
          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-1 ${
            isSelected
              ? 'bg-stone-950 text-amber-400'
              : isAvailable
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
              : 'bg-stone-800 text-stone-400'
          }`}
        >
          {table.capacity} Seats
        </span>

        <span className="text-base font-bold font-serif-luxury">
          {table.tableNumber}
        </span>

        <div className="text-[10px] mt-1">
          <span className="block opacity-80">{table.location} Zone</span>
          <span className="font-semibold capitalize">
            {isSelected ? 'Selected' : table.status}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
          Seamless Dining Experience
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-stone-100">
          Book a Table
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed">
          Select your date, preferred dining zone, and reserve your table instantly. Pre-order your meals so they arrive hot and ready.
        </p>
      </div>

      {/* Success Modal / Banner */}
      {successData && (
        <div className="bg-[#1C1917] border border-amber-500/40 rounded-3xl p-8 text-stone-100 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/100 text-stone-950 flex items-center justify-center font-bold shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif-luxury text-amber-400">
                Table Reserved Successfully!
              </h2>
              <p className="text-xs text-stone-300">
                A confirmation has been linked to your account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 block">Reservation ID</span>
              <span className="font-bold text-amber-400 text-sm font-mono">
                {successData.reservationId}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Table Reserved</span>
              <span className="font-bold text-stone-100 text-sm">
                {successData.tableName} ({successData.guests} Guests)
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Date & Time</span>
              <span className="font-bold text-stone-100 text-sm">
                {successData.date} at {successData.time}
              </span>
            </div>
            {successData.orderId && (
              <div>
                <span className="text-stone-400 block">Pre-order Linked</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">
                  {successData.orderId} (₹{successData.totalAmount})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setSuccessData(null);
                setPreOrderItems([]);
              }}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Book Another Table
            </button>
            <button
              onClick={() => onNavigate('reservations')}
              className="px-6 py-2.5 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md"
            >
              View My Reservations &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Reservation Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Date/Time/Guests & Visual Floor Plan */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: When & Who */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Select Date, Time & Party Size
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Reservation Date
                </label>
                <div className="relative">
                  <input
                    id="reservation-date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-900/50 border border-white/10 rounded-xl text-xs font-medium text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <select
                    id="reservation-time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-900/50 border border-white/10 rounded-xl text-xs font-medium text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Number of Guests
                </label>
                <div className="flex items-center border border-white/10 rounded-xl bg-stone-900/50 p-1">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-stone-100">
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(12, guests + 1))}
                    className="w-7 h-7 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Visual Floor Plan & Table Selection */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                Choose an Available Table
              </h3>

              {/* Visual Status Legend */}
              <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500/100 border-2 border-stone-900" />
                  Selected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400" />
                  Reserved / Busy
                </span>
              </div>
            </div>

            {/* Visual Restaurant Floor Layout */}
            <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 relative space-y-6">
              {/* Window Zone */}
              <div>
                <div className="text-center pb-4 border-b border-dashed border-stone-800">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-400 bg-stone-950 px-4 py-1 rounded-full border border-stone-800">
                    🪟 WINDOW SEATING (STREET VIEW)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  {tables.filter((t) => t.location === 'Window').map(renderTableButton)}
                </div>
              </div>

              {/* Center Zone */}
              <div>
                <div className="text-center pb-4 border-b border-dashed border-stone-800">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-300 bg-stone-950 px-4 py-1 rounded-full border border-stone-800">
                    🍽️ MAIN DINING (CENTER)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  {tables.filter((t) => t.location === 'Center').map(renderTableButton)}
                </div>
              </div>

              {/* Patio & Booths Zone */}
              <div>
                <div className="text-center pb-4 border-b border-dashed border-stone-800">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-emerald-400 bg-stone-950 px-4 py-1 rounded-full border border-stone-800">
                    🌿 PATIO & PRIVATE BOOTHS
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {tables.filter((t) => t.location === 'Booth' || t.location === 'Patio').map(renderTableButton)}
                </div>
              </div>
            </div>

            {selectedTable && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Selected: <strong>{selectedTable.tableNumber}</strong> ({selectedTable.capacity} Seats, {selectedTable.location} Zone).
                  </span>
                </div>
                <span className="font-bold text-amber-400">Ready to Book</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Details + Section 8 Food Pre-Order + Submit */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleConfirmBooking} className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10/80 shadow-sm space-y-5">
            <h3 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/100 text-stone-950 text-xs font-bold flex items-center justify-center">
                3
              </span>
              Guest Info & Special Requests
            </h3>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Customer Name *
                </label>
                <input
                  id="res-name-input"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-stone-900/50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Contact Phone *
                </label>
                <input
                  id="res-phone-input"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-stone-900/50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Special Request (Optional)
                </label>
                <textarea
                  id="res-special-input"
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g., Birthday celebration, high chair needed, quiet booth..."
                  className="w-full px-3.5 py-2 bg-stone-900/50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* SECTION 8: COMBINE TABLE BOOKING + FOOD ORDER */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-serif-luxury text-stone-100 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    Pre-order Your Food
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Dishes will be prepared and served fresh upon arrival
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enablePreOrder}
                  onChange={(e) => setEnablePreOrder(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              {enablePreOrder && (
                <div className="p-4 rounded-2xl bg-stone-900/50 border border-white/10 space-y-3">
                  <span className="text-[11px] font-semibold text-stone-400 block">
                    Quick Menu Picks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {foods.slice(0, 8).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleAddPreOrderItem(f)}
                        className="p-1.5 rounded-xl bg-stone-900/40 backdrop-blur-md border border-white/10 text-stone-200 text-left hover:border-amber-500 hover:shadow-sm transition-all flex items-center gap-2.5 cursor-pointer group"
                      >
                        <FoodImage
                          src={f.image}
                          alt={f.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-800/50"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-stone-100 group-hover:text-amber-400 block truncate">
                            {f.name}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400">₹{f.price}</span>
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/100 group-hover:text-stone-950 text-amber-400 flex items-center justify-center shrink-0 transition-colors">
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pre-ordered items summary */}
                  {preOrderItems.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-xs font-bold text-stone-200 block">
                        Pre-order Basket:
                      </span>
                      {preOrderItems.map((item) => (
                        <div
                          key={item.food.id}
                          className="flex items-center justify-between text-xs text-stone-300 bg-stone-900/40 backdrop-blur-md p-2 rounded-xl border border-white/10 gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FoodImage
                              src={item.food.image}
                              alt={item.food.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 bg-stone-800/50"
                            />
                            <span className="font-semibold text-stone-100 truncate">
                              {item.quantity} × {item.food.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-stone-100">
                              ₹{item.food.price * item.quantity}
                            </span>
                            <div className="flex items-center border border-stone-300 rounded-md">
                              <button
                                type="button"
                                onClick={() => handleUpdatePreOrderQty(item.food.id, -1)}
                                className="px-1.5 py-0.5 text-stone-500 hover:text-stone-100 cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdatePreOrderQty(item.food.id, 1)}
                                className="px-1.5 py-0.5 text-stone-500 hover:text-stone-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 flex justify-between text-xs font-bold text-amber-400">
                        <span>Pre-order Total (inc. 5% GST):</span>
                        <span>₹{preOrderTotal}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400 italic">
                      Click any dish above to add it to this reservation.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time:</span>
                <span className="font-semibold text-stone-100">{date} at {time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Table:</span>
                <span className="font-semibold text-amber-400">
                  {selectedTable ? `${selectedTable.tableNumber} (${selectedTable.capacity} Seats)` : 'None selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Guests:</span>
                <span className="font-semibold text-stone-100">{guests} Diners</span>
              </div>
            </div>

            <button
              id="confirm-reservation-btn"
              type="submit"
              disabled={submitting || !selectedTable}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                'Reserving...'
              ) : enablePreOrder && preOrderItems.length > 0 ? (
                'Confirm Reservation & Food Order'
              ) : (
                'Confirm Reservation'
              )}
            </button>

            {!user && (
              <p className="text-[11px] text-center text-stone-500">
                *Sign in required to link the booking to your account.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
