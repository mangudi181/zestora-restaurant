import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, Phone, AlertCircle, Eye, EyeOff, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Floating orb backgrounds ─── */
const Orbs = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div
      style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '55vw',
        height: '55vw',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'floatOrb1 12s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(180,83,9,0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'floatOrb2 15s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '40%',
        width: '30vw',
        height: '30vw',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'floatOrb3 18s ease-in-out infinite',
      }}
    />
  </div>
);

/* ─── Field wrapper ─── */
const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <div>
    <label className="block text-xs font-semibold text-stone-400 mb-1.5 tracking-wide uppercase">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

const inputCls =
  'w-full pl-10 pr-4 py-3 bg-stone-900/80 border border-stone-700/80 rounded-xl text-stone-100 text-sm placeholder:text-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/60 transition-all';

/* ─── Main component ─── */
export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  /* form state */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* reset on mode switch */
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      if (!res.success) setError(res.error || 'Sign-in failed. Please try again.');
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      const res = await register({ name, email, phone, password, confirmPassword });
      if (!res.success) setError(res.error || 'Registration failed. Please try again.');
      else setSuccessMsg('Account created! Signing you in…');
    }
    setLoading(false);
  };

  const fillDemo = (role: 'user' | 'admin') => {
    setError(null);
    setMode('login');
    setEmail(role === 'admin' ? 'admin@zestora.com' : 'rahul@example.com');
    setPassword('password123');
    if (role === 'admin') setPassword('admin123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Inline keyframes for the orbs */}
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.08); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.06); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: authFadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <Orbs />

      {/* Fine grid overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Card */}
      <div className="auth-card relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(20,17,14,0.82)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* ── Header ── */}
          <div className="relative text-center py-8 px-6 overflow-hidden border-b border-white/10">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(217,119,6,0.22) 0%, transparent 60%)',
              }}
            />
            {/* Logo icon */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: '0 8px 32px rgba(217,119,6,0.45)',
                }}
              >
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-500 mb-1">
                  Zestora Dining
                </p>
                <h1
                  className="text-3xl font-bold text-stone-100"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    textShadow: '0 0 20px rgba(245,158,11,0.4)',
                  }}
                >
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-xs text-stone-400 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
                  {mode === 'login'
                    ? 'Sign in to access orders, reservations & more'
                    : 'Join us for exclusive deals & fast table bookings'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex border-b border-white/10 bg-black/20">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                id={`authpage-tab-${m}`}
                onClick={() => setMode(m)}
                className="flex-1 py-3.5 text-sm font-semibold transition-all cursor-pointer"
                style={{
                  color: mode === m ? '#fbbf24' : '#a8a29e',
                  borderBottom: mode === m ? '2px solid #f59e0b' : '2px solid transparent',
                  background: mode === m ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            {/* Error */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-start gap-2.5">
                <span className="w-4 h-4 shrink-0 mt-0.5">✓</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <Field label="Full Name" icon={<User className="w-4 h-4" />}>
                  <input
                    id="authpage-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone Number" icon={<Phone className="w-4 h-4" />}>
                  <input
                    id="authpage-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputCls}
                  />
                </Field>
              </>
            )}

            {/* Email */}
            <Field label="Email Address" icon={<Mail className="w-4 h-4" />}>
              <input
                id="authpage-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={<Lock className="w-4 h-4" />}>
              <input
                id="authpage-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls + ' pr-11'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <Field label="Confirm Password" icon={<Lock className="w-4 h-4" />}>
                <input
                  id="authpage-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>
            )}

            {/* Submit */}
            <button
              id="authpage-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer disabled:opacity-50 mt-2"
              style={{
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: '#1c1917',
                boxShadow: '0 4px 20px rgba(217,119,6,0.4)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = '0 6px 28px rgba(217,119,6,0.6)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = '0 4px 20px rgba(217,119,6,0.4)')
              }
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing In…' : 'Creating Account…'}
                </span>
              ) : mode === 'login' ? (
                'Sign In Securely'
              ) : (
                'Create My Account'
              )}
            </button>

            {/* Switch mode hint */}
            <p className="text-center text-xs text-stone-500 pt-1">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors"
                  >
                    Create one for free →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors"
                  >
                    Sign In →
                  </button>
                </>
              )}
            </p>

            {/* Demo accounts */}
            <div className="pt-4 mt-1 border-t border-white/10">
              <p className="text-[10px] text-stone-500 text-center mb-3 uppercase tracking-widest font-medium">
                Quick Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="authpage-demo-user"
                  onClick={() => fillDemo('user')}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-stone-200 border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  👤 Demo Customer
                </button>
                <button
                  type="button"
                  id="authpage-demo-admin"
                  onClick={() => fillDemo('admin')}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  🛡️ Demo Admin
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-stone-600 mt-5">
          © 2025 Zestora Dining · All rights reserved
        </p>
      </div>
    </div>
  );
};
