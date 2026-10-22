import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { ReservationView } from './components/ReservationView';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { MyReservationsView } from './components/MyReservationsView';
import { AboutContactView } from './components/AboutContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthPage } from './components/AuthPage';
import { FoodItem, Review, RestaurantTable, Order } from './types';

/* ── Auth Gate ── */
function AuthGate() {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);

  // Give the AuthContext time to restore session from localStorage
  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-500 text-sm tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppContent />;
}

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const res = await fetch('/api/foods');
      if (res.ok) {
        const data = await res.json();
        setFoods(Array.isArray(data) ? data : data.foods || []);
      }
    } catch (e) {
      console.error('Error fetching foods:', e);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(Array.isArray(data) ? data : data.tables || []);
      }
    } catch (e) {
      console.error('Error fetching tables:', e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFoods(), fetchTables(), fetchReviews()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleNavigate = (view: string, category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Outlet */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            foods={foods}
            reviews={reviews}
            onSelectFood={(food) => setSelectedFood(food)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'menu' && (
          <MenuView
            foods={foods}
            onSelectFood={(food) => setSelectedFood(food)}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        )}

        {currentView === 'reservation' && (
          <ReservationView
            tables={tables}
            foods={foods}
            onReservationComplete={() => fetchTables()}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            tables={tables}
            onOrderPlaced={(_order) => {}}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'orders' && (
          <OrdersView onNavigate={handleNavigate} />
        )}

        {currentView === 'reservations' && (
          <MyReservationsView onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && (
          <AboutContactView mode="about" onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <AboutContactView mode="contact" onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onRefreshFoods={fetchFoods}
            onRefreshTables={fetchTables}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Drawers */}
      <AuthModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <FoodDetailModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
      />

      {/* Mobile Bottom Quick-Access Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AuthGate />
      </CartProvider>
    </AuthProvider>
  );
}
