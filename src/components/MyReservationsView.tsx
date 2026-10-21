import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { TableReservation } from '../types';
import { useAuth } from '../context/AuthContext';
import { FoodImage } from './FoodImage';

interface MyReservationsViewProps {
  onNavigate: (view: string) => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({ onNavigate }) => {
  const { user, token, openAuthModal } = useAuth();
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setRefreshing(true);
      const res = await fetch('/api/reservations/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations || []);
      }
    } catch (e) {
      setActionError('Failed to load reservations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mx-auto text-stone-500">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-100">
          Sign In to View Reservations
        </h2>
        <p className="text-xs text-stone-500">
          Manage your booked tables, cancel upcoming bookings, or check your dining pre-orders.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this table reservation?')) return;
    try {
      const res = await fetch(`/api/reservations/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReservations();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to cancel reservation');
      }
    } catch (e) {
      alert('Error cancelling reservation');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            My Table Reservations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your booked dining dates and linked food pre-orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReservations}
            disabled={refreshing}
            className="px-4 py-2 bg-stone-800/50 hover:bg-stone-200 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('reservation')}
            className="px-5 py-2.5 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Table</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Loading reservations...
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10/80 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/100/10 text-amber-600 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
            No reservations found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Ready to plan a memorable dining evening? Book a table from our interactive floor plan with instant confirmation.
          </p>
          <button
            onClick={() => onNavigate('reservation')}
            className="px-6 py-3 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md"
          >
            Book a Table Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((res) => {
            const isCancelled = res.status === 'Cancelled';
            const isConfirmed = res.status === 'Confirmed';

            return (
              <div
                key={res.id}
                className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10/80 p-6 shadow-sm flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Reservation ID
                      </span>
                      <span className="text-sm font-bold font-mono text-stone-100">
                        {res.reservationId}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-stone-800/50 text-stone-300'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-300">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{res.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{res.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300">
                      <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-semibold">{res.tableNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300">
                      <Users className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{res.guests} Guests</span>
                    </div>
                  </div>

                  {res.specialRequest && (
                    <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-white/5 text-[11px] text-stone-400">
                      <strong className="text-stone-200">Special Request:</strong> {res.specialRequest}
                    </div>
                  )}

                  {/* Pre-ordered food list */}
                  {res.preOrderItems && res.preOrderItems.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                        Linked Food Pre-Order:
                      </span>
                      <div className="space-y-1.5 text-xs text-stone-300">
                        {res.preOrderItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-2 bg-stone-50 p-1.5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2 min-w-0">
                              {item.image && (
                                <FoodImage
                                  src={item.image}
                                  alt={item.name}
                                  className="w-7 h-7 rounded-md object-cover shrink-0"
                                />
                              )}
                              <span className="truncate font-medium text-stone-100">
                                {item.quantity} × {item.name}
                              </span>
                            </div>
                            <span className="font-semibold text-stone-100 shrink-0">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    Booked on {new Date(res.createdAt).toLocaleDateString()}
                  </span>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
