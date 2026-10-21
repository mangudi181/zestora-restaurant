import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Bike,
  Utensils,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { FoodImage } from './FoodImage';

interface OrdersViewProps {
  onNavigate: (view: string) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'Order Placed', label: 'Order Placed', icon: Clock },
  { status: 'Preparing', label: 'In the Kitchen', icon: Utensils },
  { status: 'Out for Delivery', label: 'On its Way / Ready', icon: Bike },
  { status: 'Delivered', label: 'Delivered / Enjoy', icon: CheckCircle2 }
];

export const OrdersView: React.FC<OrdersViewProps> = ({ onNavigate }) => {
  const { user, token, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setRefreshing(true);
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.orders?.length > 0 && !expandedOrderId) {
          setExpandedOrderId(data.orders[0].id);
        }
      } else {
        setError('Failed to load your orders.');
      }
    } catch (err) {
      setError('Network error fetching orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mx-auto text-stone-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-100">
          Sign In to Track Orders
        </h2>
        <p className="text-xs text-stone-500">
          Access your live kitchen order status, invoices, and reorder favorites.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const d = await res.json();
        alert(d.error || 'Cannot cancel order at this stage');
      }
    } catch (e) {
      alert('Failed to cancel order.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            My Orders & Live Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status updates from our kitchen straight to your table or doorstep
          </p>
        </div>

        <button
          id="refresh-orders-btn"
          onClick={fetchOrders}
          disabled={refreshing}
          className="self-start sm:self-auto px-4 py-2 bg-stone-800/50 hover:bg-stone-200 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10/80 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/100/10 text-amber-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Looks like you haven't ordered any meals yet. Explore our mouthwatering menu to place your first order!
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md"
          >
            Browse Menu & Order
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentOrderStatus: OrderStatus = order.status || order.orderStatus || 'Order Placed';
            const currentStep = getStepIndex(currentOrderStatus);
            const isCancelled = currentOrderStatus === 'Cancelled';

            return (
              <div
                key={order.id}
                className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10/80 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Header Strip */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-stone-100">
                        {order.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                        {order.orderType}
                      </span>
                      {order.tableNumber && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 text-stone-300 font-semibold">
                          Table: {order.tableNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Amount
                      </span>
                      <span className="text-base font-bold font-serif-luxury text-stone-100">
                        ₹{order.total}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-700'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-500/100 text-stone-950 shadow-sm'
                        }`}
                      >
                        {order.status}
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline (Section 9 Requirement) */}
                {!isCancelled && (
                  <div className="px-6 py-8 border-t border-b border-white/5 bg-stone-900/40 backdrop-blur-md">
                    <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                      {/* Connecting Line */}
                      <div className="absolute left-6 right-6 top-5 h-1 bg-stone-200 -z-0">
                        <div
                          className="h-full bg-amber-500/100 transition-all duration-700"
                          style={{
                            width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%`
                          }}
                        />
                      </div>

                      {STATUS_STEPS.map((st, idx) => {
                        const isDone = currentStep >= idx;
                        const isCurrent = currentStep === idx;
                        const Icon = st.icon;

                        return (
                          <div key={st.status} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-amber-500/100 text-stone-950 font-bold shadow-lg shadow-amber-500/30 ring-4 ring-amber-100'
                                  : 'bg-stone-800/50 border border-stone-300 text-stone-400'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[11px] mt-2 font-semibold text-center whitespace-nowrap ${
                                isCurrent
                                  ? 'text-amber-400 font-bold'
                                  : isDone
                                  ? 'text-stone-200'
                                  : 'text-stone-400'
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 bg-stone-50/40 border-t border-white/5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Dishes in this Order ({order.items.length})
                    </h4>

                    <div className="space-y-2 divide-y divide-stone-100">
                      {order.items.map((it, i) => (
                        <div key={i} className="pt-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <FoodImage
                              src={it.image}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-cover bg-stone-200 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-stone-100 block">
                                {it.quantity} × {it.name}
                              </span>
                              {it.selectedCustomizations && it.selectedCustomizations.length > 0 && (
                                <span className="text-[10px] text-stone-500 block">
                                  {it.selectedCustomizations.map((c) => c.selectedOption).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-stone-100">
                            ₹{it.unitTotal * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="p-4 rounded-2xl bg-stone-900/40 backdrop-blur-md border border-white/10 text-xs text-stone-400 space-y-1.5 mt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%):</span>
                        <span>₹{order.tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span>₹{order.serviceCharge}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount:</span>
                          <span>-₹{order.discount}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-sm text-stone-100">
                        <span>Grand Total:</span>
                        <span className="text-amber-400">₹{order.total}</span>
                      </div>
                    </div>

                    {/* Cancel action if allowed */}
                    {order.status === 'Order Placed' && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
