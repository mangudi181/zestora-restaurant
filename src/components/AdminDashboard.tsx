import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Utensils,
  Package,
  Calendar,
  Grid,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Search,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { FoodItem, Order, TableReservation, RestaurantTable, FoodCategory, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { FoodImage } from './FoodImage';

interface AdminDashboardProps {
  onRefreshFoods: () => void;
  onRefreshTables: () => void;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onRefreshFoods,
  onRefreshTables,
  onNavigate
}) => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'foods' | 'orders' | 'reservations' | 'tables'>('stats');

  // Data states
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    totalReservations: number;
    totalFoods: number;
    pendingOrdersCount: number;
  } | null>(null);

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(false);

  // Food Form modal/state
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodForm, setFoodForm] = useState<{
    name: string;
    description: string;
    price: number;
    category: FoodCategory;
    image: string;
    isVegetarian: boolean;
    isAvailable: boolean;
    isPopular: boolean;
    isSpecialToday: boolean;
    preparationTime: string;
  }>({
    name: '',
    description: '',
    price: 250,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isVegetarian: true,
    isAvailable: true,
    isPopular: false,
    isSpecialToday: false,
    preparationTime: '20 mins'
  });

  // Table Form state
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableForm, setTableForm] = useState<{
    tableNumber: string;
    capacity: number;
    location: 'Indoor' | 'Outdoor' | 'Balcony' | 'Rooftop';
    status: 'Available' | 'Reserved' | 'Occupied';
  }>({
    tableNumber: 'Table 9',
    capacity: 4,
    location: 'Indoor',
    status: 'Available'
  });

  // Status Filter for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const fetchAdminData = async () => {
    if (!token || user?.role !== 'admin') return;
    setLoading(true);
    try {
      const [statsRes, foodsRes, ordersRes, resRes, tablesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/foods'),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/reservations', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/tables')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (foodsRes.ok) {
        const d = await foodsRes.json();
        setFoods(d.foods || []);
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.orders || []);
      }
      if (resRes.ok) {
        const d = await resRes.json();
        setReservations(d.reservations || []);
      }
      if (tablesRes.ok) {
        const d = await tablesRes.json();
        setTables(d.tables || []);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-100">
          Admin Access Required
        </h2>
        <p className="text-xs text-stone-500">
          You must be logged in as an administrator (e.g., admin@zestora.com) to access management controls.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-amber-500/100 text-stone-950 font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // --- Handlers for Food ---
  const handleOpenAddFood = () => {
    setEditingFood(null);
    setFoodForm({
      name: '',
      description: '',
      price: 250,
      category: 'Starters',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isVegetarian: true,
      isAvailable: true,
      isPopular: false,
      isSpecialToday: false,
      preparationTime: '20 mins'
    });
    setShowFoodModal(true);
  };

  const handleOpenEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      isVegetarian: food.isVegetarian,
      isAvailable: food.isAvailable,
      isPopular: !!food.isPopular,
      isSpecialToday: !!food.isSpecialToday,
      preparationTime: food.preparationTime || '20 mins'
    });
    setShowFoodModal(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingFood ? 'PUT' : 'POST';
      const endpoint = editingFood ? `/api/admin/foods/${editingFood.id}` : '/api/admin/foods';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(foodForm)
      });

      if (res.ok) {
        setShowFoodModal(false);
        fetchAdminData();
        onRefreshFoods();
      } else {
        alert('Failed to save food item');
      }
    } catch (e) {
      alert('Error saving food item');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    try {
      const res = await fetch(`/api/admin/foods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminData();
        onRefreshFoods();
      }
    } catch (e) {
      alert('Error deleting food item');
    }
  };

  // --- Handlers for Orders ---
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      alert('Error updating order status');
    }
  };

  // --- Handlers for Reservations ---
  const handleUpdateReservationStatus = async (resId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/${resId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
        onRefreshTables();
      }
    } catch (e) {
      alert('Error updating reservation');
    }
  };

  // --- Handlers for Tables ---
  const handleUpdateTableStatus = async (tableId: string, status: 'Available' | 'Reserved' | 'Occupied') => {
    try {
      const res = await fetch(`/api/admin/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
        onRefreshTables();
      }
    } catch (e) {
      alert('Error updating table status');
    }
  };

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tableForm)
      });
      if (res.ok) {
        setShowTableModal(false);
        fetchAdminData();
        onRefreshTables();
      }
    } catch (e) {
      alert('Error adding table');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/100 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-100">
              Zestora Management Console
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time control over food dishes, live kitchen order tickets, table reservations, and restaurant floor plan.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-stone-800/50 hover:bg-stone-200 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'stats', label: 'Overview & Analytics', icon: BarChart3 },
          { id: 'orders', label: `Kitchen Orders (${orders.length})`, icon: Package },
          { id: 'foods', label: `Menu Management (${foods.length})`, icon: Utensils },
          { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
          { id: 'tables', label: `Floor Plan Tables (${tables.length})`, icon: Grid }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-amber-400 shadow-sm'
                  : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STATS & OVERVIEW */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/100/10 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Total Gross Revenue
                </span>
                <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                  ₹{stats.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Total Orders Placed
                </span>
                <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                  {stats.totalOrders}
                </span>
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Total Reservations
                </span>
                <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                  {stats.totalReservations}
                </span>
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Active Food Dishes
                </span>
                <span className="text-2xl font-bold font-serif-luxury text-stone-100">
                  {stats.totalFoods}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif-luxury text-stone-100">
                Pending Kitchen Orders ({stats.pendingOrdersCount})
              </h3>
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
                  .slice(0, 4)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold text-stone-100">
                          <span>{order.id}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            {order.orderType}
                          </span>
                        </div>
                        <span className="text-stone-500 block text-[11px] mt-0.5">
                          {order.customerName} • {order.items.length} items • ₹{order.total}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-amber-400 font-bold hover:underline"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif-luxury text-stone-100">
                Quick Admin Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAddFood}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-500/10 border border-white/10 hover:border-amber-300 transition-all text-left text-xs space-y-1 cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-stone-100 block">Add New Dish</span>
                  <span className="text-stone-500 text-[10px] block">Create menu items</span>
                </button>

                <button
                  onClick={() => setShowTableModal(true)}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-500/10 border border-white/10 hover:border-amber-300 transition-all text-left text-xs space-y-1 cursor-pointer"
                >
                  <Grid className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-stone-100 block">Add Floor Table</span>
                  <span className="text-stone-500 text-[10px] block">Expand seating zone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-400">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-stone-900/40 backdrop-blur-md border border-white/10 rounded-xl text-xs font-medium focus:outline-none"
              >
                <option value="all">All Orders</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Type / Location</th>
                    <th className="p-4">Dishes</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Live Status</th>
                    <th className="p-4">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-300">
                  {orders
                    .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-bold text-stone-100 block">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-stone-100 block">
                            {order.customerName}
                          </span>
                          <span className="text-stone-400 text-[11px]">{order.customerPhone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">{order.orderType}</span>
                          {order.tableNumber && (
                            <span className="text-stone-400 block text-[10px]">
                              {order.tableNumber}
                            </span>
                          )}
                          {order.deliveryAddress && (
                            <span className="text-stone-400 block text-[10px] truncate max-w-[120px]">
                              {order.deliveryAddress.street}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5 max-w-xs">
                            {order.items.map((it, idx) => (
                              <span key={idx} className="block text-[11px] truncate">
                                {it.quantity}x {it.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-stone-100">₹{order.total}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-400'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="px-2.5 py-1.5 bg-stone-800/50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOOD DISH MANAGEMENT */}
      {activeTab === 'foods' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
                Menu Items Catalogue
              </h3>
              <p className="text-xs text-stone-500">
                Create new dishes, adjust pricing, upload images, or mark items sold out.
              </p>
            </div>

            <button
              onClick={handleOpenAddFood}
              className="px-5 py-2.5 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40 bg-stone-800/50">
                  <FoodImage src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      food.isVegetarian
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {food.isVegetarian ? 'Veg' : 'Non-Veg'}
                  </span>
                  {!food.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full uppercase">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase">
                      <span>{food.category}</span>
                      <span>₹{food.price}</span>
                    </div>
                    <h4 className="text-base font-bold font-serif-luxury text-stone-100 mt-0.5">
                      {food.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {food.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400">
                      Prep: {food.preparationTime || '20m'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditFood(food)}
                        className="p-1.5 rounded-lg bg-stone-800/50 hover:bg-stone-200 text-stone-300 transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESERVATION MANAGEMENT */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
              Table Bookings Management
            </h3>
          </div>

          <div className="bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-4">Reservation ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Table & Guests</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Pre-Order Food</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-300">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50/50">
                      <td className="p-4 font-mono font-bold text-stone-100">
                        {res.reservationId}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-stone-100 block">{res.customerName}</span>
                        <span className="text-stone-400 text-[11px]">{res.customerPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{res.tableNumber}</span>
                        <span className="text-stone-400 block text-[10px]">{res.guests} Guests</span>
                      </td>
                      <td className="p-4">
                        <span>{res.date}</span>
                        <span className="text-stone-400 block text-[10px]">{res.time}</span>
                      </td>
                      <td className="p-4">
                        {res.preOrderItems && res.preOrderItems.length > 0 ? (
                          <span className="text-emerald-700 font-semibold">
                            {res.preOrderItems.length} items pre-ordered
                          </span>
                        ) : (
                          <span className="text-stone-400">None</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-800/50 text-stone-300'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={res.status}
                          onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                          className="px-2 py-1 bg-stone-800/50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TABLE FLOOR PLAN MANAGEMENT */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
                Floor Plan & Seating Capacity
              </h3>
              <p className="text-xs text-stone-500">
                Toggle table availability, mark occupied, or add additional dining tables.
              </p>
            </div>

            <button
              onClick={() => setShowTableModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.map((tbl) => (
              <div
                key={tbl.id}
                className="bg-stone-900/40 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {tbl.location} Zone
                  </span>
                  <span className="text-xs font-semibold bg-stone-800/50 px-2 py-0.5 rounded-full text-stone-300">
                    {tbl.capacity} Seats
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-bold font-serif-luxury text-stone-100">
                    {tbl.tableNumber}
                  </h4>
                  <span
                    className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      tbl.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tbl.status === 'Reserved'
                        ? 'bg-amber-100 text-amber-400'
                        : 'bg-stone-200 text-stone-200'
                    }`}
                  >
                    {tbl.status}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <label className="block text-[10px] text-stone-400 uppercase font-semibold mb-1">
                    Set Live Status:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Available', 'Reserved', 'Occupied'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateTableStatus(tbl.id, st)}
                        className={`py-1 text-[10px] font-bold rounded-lg transition-all ${
                          tbl.status === st
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-800/50 text-stone-400 hover:bg-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOD MODAL (Create / Edit) */}
      {showFoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1C1917] border border-stone-800 rounded-3xl p-6 text-stone-100 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-amber-400">
                {editingFood ? 'Edit Food Dish' : 'Create New Food Dish'}
              </h3>
              <button
                onClick={() => setShowFoodModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value as FoodCategory })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 cursor-pointer"
                  >
                    {[
                      'Starters',
                      'Main Course',
                      'Biriyani',
                      'Pizza',
                      'Burgers',
                      'Pasta',
                      'Desserts',
                      'Beverages'
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Image URL</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={foodForm.image}
                    onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                  {foodForm.image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-700">
                      <FoodImage src={foodForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={foodForm.preparationTime}
                    onChange={(e) => setFoodForm({ ...foodForm, preparationTime: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>

                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={foodForm.isVegetarian}
                      onChange={(e) => setFoodForm({ ...foodForm, isVegetarian: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span className="text-stone-200">Vegetarian Dish</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodForm.isAvailable}
                    onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-stone-200">In Stock / Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodForm.isSpecialToday}
                    onChange={(e) => setFoodForm({ ...foodForm, isSpecialToday: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-stone-200">Today's Special</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowFoodModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1C1917] border border-stone-800 rounded-3xl p-6 text-stone-100 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-amber-400">
                Add Dining Table
              </h3>
              <button
                onClick={() => setShowTableModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Table Number *</label>
                <input
                  type="text"
                  required
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  placeholder="e.g. Table 9"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Capacity (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Zone Location</label>
                  <select
                    value={tableForm.location}
                    onChange={(e) => setTableForm({ ...tableForm, location: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 cursor-pointer"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Rooftop">Rooftop</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
