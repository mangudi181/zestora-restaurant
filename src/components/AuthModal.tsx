import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const res = await register({
        name,
        email,
        phone,
        password,
        confirmPassword
      });
      if (!res.success) {
        setError(res.error || 'Failed to register account');
      }
    }
    setLoading(false);
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    setError(null);
    if (role === 'admin') {
      setEmail('admin@zestora.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@example.com');
      setPassword('password123');
    }
    setAuthModalMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md glass-panel rounded-3xl shadow-2xl overflow-hidden text-stone-100 animate-slide-up">
        {/* Header decoration */}
        <div className="relative p-6 text-center border-b border-white/10 overflow-hidden">
          {/* Subtle background gradient inside the header */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent pointer-events-none" />
          
          <button
            id="close-auth-modal-btn"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeAuthModal();
            }}
            className="absolute top-4 right-4 w-8 h-8 z-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-stone-100 transition-all hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-500 flex justify-center items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow" />
              Zestora Dining
            </p>
            <h2 className="text-3xl font-bold font-serif-luxury text-stone-100 text-glow">
              {authModalMode === 'login' ? 'Welcome Back' : 'Join Zestora'}
            </h2>
            <p className="text-xs text-stone-400 font-light max-w-[250px] mx-auto">
              {authModalMode === 'login'
                ? 'Sign in to access your orders and table reservations'
                : 'Experience exclusive specials and fast table bookings'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 bg-black/20">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              authModalMode === 'login'
                ? 'text-amber-400 border-amber-500 bg-white/5 shadow-inner'
                : 'text-stone-400 border-transparent hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-register"
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              authModalMode === 'register'
                ? 'text-amber-400 border-amber-500 bg-white/5 shadow-inner'
                : 'text-stone-400 border-transparent hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="register-phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                id="auth-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  id="register-confirm-password-input"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : authModalMode === 'login' ? (
              'Sign In Securely'
            ) : (
              'Create Account'
            )}
          </button>

          {/* Quick Demo Logins */}
          <div className="pt-4 mt-2 border-t border-white/10">
            <p className="text-[10px] text-stone-400 text-center mb-3 font-medium uppercase tracking-widest">
              Quick 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="demo-user-btn"
                onClick={() => handleQuickDemo('user')}
                className="py-2.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-stone-200 border border-white/10 text-center transition-all cursor-pointer shadow-sm"
              >
                👤 Demo Customer
              </button>
              <button
                type="button"
                id="demo-admin-btn"
                onClick={() => handleQuickDemo('admin')}
                className="py-2.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-400 border border-amber-500/30 text-center transition-all cursor-pointer shadow-sm"
              >
                🛡️ Demo Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
