import React from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#12100E] border-t border-stone-800/80 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer inline-flex"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Utensils className="w-5 h-5 text-stone-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-stone-100">
                  Zestora
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400 font-semibold -mt-1">
                  Restaurant & Lounge
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-light">
              Experience the pinnacle of dining with authentic clay tandoors, slow-simmered dum biriyanis, and artisanal stone-fired pizzas crafted with whole organic spices.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>FSSAI Certified • 100% Fresh Daily Procurement</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif-luxury text-stone-100 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservation')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Book a Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Table Bookings
                </button>
              </li>
            </ul>
          </div>

          {/* About & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif-luxury text-stone-100 uppercase tracking-wider">
              Experience
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Zestora
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Directions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservation')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pre-order with Seating
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 transition-colors text-amber-500/80"
                >
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Times */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif-luxury text-stone-100 uppercase tracking-wider">
              Visit Us
            </h4>
            <div className="space-y-2 text-stone-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>#42, 100ft Road, Indiranagar, Bengaluru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>11:00 AM – 11:30 PM Everyday</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Zestora Restaurant. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> for unforgettable dining moments.
          </p>
        </div>
      </div>
    </footer>
  );
};
