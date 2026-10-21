import React from 'react';
import { Home, Utensils, Calendar, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  const navButtons = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'reservation', label: 'Book Table', icon: Calendar },
    { id: 'orders', label: 'Orders', icon: Clock }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E1B18]/95 backdrop-blur-xl border-t border-stone-800/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = currentView === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => onNavigate(btn.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-amber-500/100/15 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{btn.label}</span>
            </button>
          );
        })}

        {/* Cart Quick Action Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-xl text-stone-400 hover:text-stone-200 transition-all cursor-pointer relative"
          aria-label="Open Cart"
        >
          <div className="relative p-1">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500/100 text-stone-950 font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight text-amber-400">Cart</span>
        </button>
      </div>
    </nav>
  );
};
