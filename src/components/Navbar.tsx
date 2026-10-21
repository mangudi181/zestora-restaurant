import React, { useState } from 'react';
import {
  Utensils,
  ShoppingBag,
  Calendar,
  Clock,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  LogOut,
  ShieldAlert,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentView: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigate,
  onOpenProfile
}) => {
  const navigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    if (setCurrentView) setCurrentView(view);
  };
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'reservation', label: 'Book a Table' },
    { id: 'orders', label: 'My Orders' },
    { id: 'reservations', label: 'My Reservations' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    navigate(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/10 text-stone-100 transition-all shadow-md">
      {/* Top micro bar for phone / hours */}
      <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-xs text-stone-400 border-b border-white/5 bg-stone-950">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Open Daily: 11:00 AM – 11:30 PM
          </span>
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            Reservations & Delivery: +91 98765 43210
          </span>
        </div>
        <div className="flex items-center gap-4 text-stone-400">
          <span>100ft Road, Indiranagar, Bengaluru</span>
          {isAdmin && (
            <span className="bg-amber-500/100/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider border border-amber-500/30">
              ADMIN MODE
            </span>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-6 h-6 text-stone-950" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-luxury text-amber-400 group-hover:text-amber-300 transition-colors">
              Zestora
            </span>
            <span className="block text-[10px] tracking-[0.25em] uppercase text-stone-400 -mt-1 font-sans">
              Restaurant & Dining
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/100/15 border border-amber-500/30 shadow-inner'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isAdmin && (
            <button
              id="nav-link-admin"
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-1.5 ml-1 ${
                currentView === 'admin'
                  ? 'bg-amber-500/100 text-stone-950 shadow-md font-bold'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-700/50 hover:bg-amber-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>

        {/* Action Controls (Cart & Auth) */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            id="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-100 border border-stone-700/70 transition-all hover:scale-105 shadow-sm active:scale-95"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500/100 text-stone-950 font-bold text-xs flex items-center justify-center shadow-md animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
              <span className="text-[11px] text-stone-400">Cart</span>
              <span className="font-semibold text-amber-400">
                ₹{subtotal > 0 ? subtotal : '0'}
              </span>
            </div>
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="relative">
              <button
                id="nav-user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/70 text-stone-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/100/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-medium text-stone-100 max-w-[100px] truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-amber-400/90 capitalize">{user.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-stone-950 border border-white/10 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-md"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs text-stone-400">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-100 truncate">{user.email}</p>
                  </div>
                  <button
                    id="menu-profile-btn"
                    onClick={onOpenProfile}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-900/40 backdrop-blur-md/5 hover:text-amber-400 flex items-center gap-2.5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-stone-400" />
                    My Profile
                  </button>
                  <button
                    id="menu-orders-btn"
                    onClick={() => handleNavClick('orders')}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-900/40 backdrop-blur-md/5 hover:text-amber-400 flex items-center gap-2.5 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-stone-400" />
                    My Orders
                  </button>
                  <button
                    id="menu-reservations-btn"
                    onClick={() => handleNavClick('reservations')}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-900/40 backdrop-blur-md/5 hover:text-amber-400 flex items-center gap-2.5 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-stone-400" />
                    My Table Bookings
                  </button>
                  {isAdmin && (
                    <button
                      id="menu-admin-btn"
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2.5 text-sm text-amber-400 hover:bg-stone-900/40 backdrop-blur-md/5 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <div className="border-t border-white/10 my-1" />
                  <button
                    id="menu-logout-btn"
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-stone-900/40 backdrop-blur-md/5 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/100 hover:bg-amber-400 text-stone-950 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-stone-800/80 text-stone-300 hover:text-white border border-stone-700/60"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-stone-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1 shadow-2xl overflow-hidden"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                currentView === item.id
                  ? 'bg-amber-500/100/20 text-amber-400 border border-amber-500/30'
                  : 'text-stone-300 hover:bg-stone-900/40 backdrop-blur-md/5'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-amber-300 bg-amber-950/50 border border-amber-600/40 flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Admin Dashboard
            </button>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>Call: +91 98765 43210</span>
            <span>11:00 AM – 11:30 PM</span>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};
