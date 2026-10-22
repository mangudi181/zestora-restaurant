import React from 'react';
import { motion } from 'motion/react';
import {
  Utensils,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { FoodItem, Review, FoodCategory } from '../types';
import { FoodImage } from './FoodImage';

interface HomeViewProps {
  foods: FoodItem[];
  reviews: Review[];
  onSelectFood: (food: FoodItem) => void;
  onNavigate: (view: string, category?: string) => void;
}

interface CategoryCard {
  name: FoodCategory;
  title: string;
  image: string;
  badge: string;
}

const CATEGORY_SHOWCASE: CategoryCard[] = [
  {
    name: 'Biriyani',
    title: 'Dum Biriyanis',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    badge: 'Royal Saffron'
  },
  {
    name: 'Starters',
    title: 'Tandoori Grills',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    badge: 'Smoky Flavors'
  },
  {
    name: 'Main Course',
    title: 'Curries & Dal',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    badge: 'Rich & Creamy'
  },
  {
    name: 'Pizza',
    title: 'Artisan Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    badge: 'Woodfired'
  },
  {
    name: 'Burgers',
    title: 'Gourmet Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    badge: 'Juicy Angus'
  },
  {
    name: 'Pasta',
    title: 'Italian Pastas',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80',
    badge: 'Handcrafted'
  },
  {
    name: 'Desserts',
    title: 'Decadent Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    badge: 'Hot & Sweet'
  },
  {
    name: 'Beverages',
    title: 'Coolers & Sodas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    badge: 'Refreshing'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  foods,
  reviews,
  onSelectFood,
  onNavigate
}) => {
  const specials = foods.filter((f) => f.isSpecialToday).slice(0, 4);
  const popular = foods.filter((f) => f.isPopular).slice(0, 6);
  const spotlightDish = foods.find((f) => f.id === 'food-1') || foods[0];

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center bg-[#151311] overflow-hidden">
        {/* Background hero food image with high contrast vignette overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=75"
            alt="Zestora Luxury Restaurant"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-30 filter brightness-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-[#151311]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#151311] via-[#151311]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/100/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Award-Winning Dining Experience</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-luxury text-stone-100 leading-tight animate-slide-up">
                Good Food. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-glow">
                  Great Moments.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-xl">
                Freshly prepared dishes delivered to your table. Experience authentic clay tandoor grills, slow-cooked royal dum biriyanis, and artisan woodfired pizzas.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-explore-menu-btn"
                  onClick={() => onNavigate('menu')}
                  className="px-7 py-4 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-base transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Utensils className="w-5 h-5 text-stone-950" />
                  <span>Explore Menu</span>
                </button>

                <button
                  id="hero-book-table-btn"
                  onClick={() => onNavigate('reservation')}
                  className="px-7 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-100 font-semibold text-base border border-stone-700/80 hover:border-amber-500/50 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Book a Table</span>
                </button>
              </div>

              {/* Quick metrics */}
              <div className="pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/100/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block text-sm">4.9 / 5</span>
                    <span className="text-[11px]">1,200+ Diners</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/100/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block text-sm">20-25 Mins</span>
                    <span className="text-[11px]">Fresh Prep Time</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500/100/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-100 block text-sm">100% Fresh</span>
                    <span className="text-[11px]">Farm Ingredients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Chef's Spotlight Showcase Dish */}
            {spotlightDish && (
              <div className="lg:col-span-5 hidden lg:block">
                <div className="relative group cursor-pointer" onClick={() => onSelectFood(spotlightDish)}>
                  {/* Decorative glowing back-ring */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

                  <div className="relative glass-panel p-5 rounded-3xl overflow-hidden text-stone-100 space-y-4 animate-float hover:scale-105 transition-transform duration-500">
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-stone-900">
                      <FoodImage
                        src={spotlightDish.image}
                        alt={spotlightDish.name}
                        priority={true}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-amber-500/100 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-md">
                          <Flame className="w-3.5 h-3.5 fill-stone-950" /> Chef's Spotlight
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/70 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{spotlightDish.rating} Rating</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                          {spotlightDish.category}
                        </span>
                        <span className="text-2xl font-bold font-serif-luxury text-amber-400">
                          ₹{spotlightDish.price}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-serif-luxury text-stone-100 group-hover:text-amber-400 transition-colors">
                        {spotlightDish.name}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {spotlightDish.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                      <span className="text-xs text-stone-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {spotlightDish.preparationTime || '20 mins'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFood(spotlightDish);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>View & Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY CATEGORY (Responsive Food Showcase) */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Culinary Selections
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-stone-100 mt-1">
              Explore By Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-400 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>See Complete Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8-Card Responsive Food Category Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORY_SHOWCASE.map((cat) => (
            <button
              key={cat.name}
              id={`home-category-${cat.name.toLowerCase()}`}
              onClick={() => onNavigate('menu', cat.name)}
              className="group flex flex-col items-center glass-panel p-2.5 sm:p-3 rounded-2xl shadow-sm glass-panel-hover hover:-translate-y-1.5 cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-800/50 mb-2.5">
                <FoodImage
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="w-full text-center">
                <span className="block text-xs sm:text-sm font-bold font-serif-luxury text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                  {cat.title}
                </span>
                <span className="block text-[10px] text-stone-400 mt-0.5 truncate">
                  {cat.badge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* 3. TODAY'S SPECIALS */}
      {specials.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-600 font-bold">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Handpicked for Today</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-stone-100 mt-1">
                Today's Chef Specials
              </h2>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-400 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>View All Specials</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {specials.map((food) => (
              <div
                key={food.id}
                onClick={() => onSelectFood(food)}
                className="glass-panel rounded-3xl overflow-hidden shadow-sm glass-panel-hover hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] sm:h-48 w-full overflow-hidden bg-stone-800/50">
                  <FoodImage
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                        food.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      title={food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    />
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/100/90 text-stone-950 font-bold text-[10px] backdrop-blur-sm">
                      Special
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{food.rating}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      {food.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-stone-100 mt-0.5 group-hover:text-amber-400 transition-colors">
                      {food.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Price</span>
                      <span className="text-lg font-bold text-stone-100 font-serif-luxury">
                        ₹{food.price}
                      </span>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-semibold group-hover:bg-amber-500/100 group-hover:text-stone-950 transition-colors">
                      Order / Customize
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. POPULAR DISHES */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Customer Favorites
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            Most Loved Dishes
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Our most ordered dishes crafted with signature spice blends, served hot and fresh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {popular.map((food) => (
            <div
              key={food.id}
              onClick={() => onSelectFood(food)}
              className="glass-panel rounded-3xl p-3.5 sm:p-4 shadow-sm glass-panel-hover hover:-translate-y-1 cursor-pointer flex gap-3.5 sm:gap-4 items-center group"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-stone-800/50">
                <FoodImage
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span
                  className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full border border-white ${
                    food.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider truncate">
                    {food.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-semibold shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{food.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-serif-luxury text-stone-100 truncate mt-0.5 group-hover:text-amber-400 transition-colors">
                  {food.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {food.description}
                </p>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-base font-bold text-stone-100 font-serif-luxury">
                    ₹{food.price}
                  </span>
                  <span className="text-xs font-semibold text-amber-400 group-hover:underline flex items-center gap-1">
                    <span>Order</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5. TABLE RESERVATION BANNER */}
      <motion.section initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E1B18] via-[#282420] to-[#151311] text-stone-100 p-6 sm:p-12 lg:p-16 border border-stone-800 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/100/20 text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
              <Award className="w-3.5 h-3.5" /> Guaranteed Seating & Instant Confirmation
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-stone-100 leading-tight">
              Reserve Your Table & Pre-order Your Feast
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Planning an intimate candlelight dinner, business lunch, or family gathering? Select your preferred table from our visual floor plan and have your dishes sizzling the moment you arrive.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('reservation')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-base transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Book a Table Now
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute right-12 bottom-0 w-96 h-80 overflow-hidden rounded-t-3xl border-t border-l border-r border-stone-700/60 shadow-2xl">
            <FoodImage
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
              alt="Restaurant Table Setup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.section>

      {/* 6. CUSTOMER REVIEWS */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Guest Testimonials
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            Loved by Thousands of Diners
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Read what our valued customers say about our food quality, prompt service, and memorable ambiance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between glass-panel-hover"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                {rev.dishName && (
                  <span className="inline-block mt-3 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold">
                    Ordered: {rev.dishName}
                  </span>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-3">
                <img
                  src={
                    rev.userAvatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      rev.userName
                    )}`
                  }
                  alt={rev.userName}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-100">{rev.userName}</h4>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. RESTAURANT HOURS, LOCATION & CONTACT INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl text-stone-100 p-6 sm:p-10 lg:p-12 border border-stone-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Opening Hours */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/100/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100">
                Opening Hours
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Open every day for lunch, dinner, and late evening dining.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex justify-between py-1 border-b border-stone-800">
                <span>Monday – Friday</span>
                <span className="font-semibold text-amber-400">11:00 AM – 11:30 PM</span>
              </li>
              <li className="flex justify-between py-1 border-b border-stone-800">
                <span>Saturday – Sunday</span>
                <span className="font-semibold text-amber-400">10:30 AM – 12:00 AM</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Kitchen Last Call</span>
                <span className="text-stone-400">11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/100/20 text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100">
                Location & Ambiance
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Centrally situated with valet parking and outdoor patio.
              </p>
            </div>
            <div className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-stone-100">Zestora Restaurant & Lounge</p>
              <p>#42, 100ft Road, Opposite Metro Pillar 84</p>
              <p>Indiranagar, Bengaluru, Karnataka – 560038</p>
              <p className="text-amber-400/90 pt-1">Valet Parking Available at Entrance</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/100/20 text-amber-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100">
                Contact & Support
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Get in touch for table bookings, corporate catering, or queries.
              </p>
            </div>
            <div className="text-xs text-stone-300 space-y-2.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">contact@zestorarestaurant.com</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold text-xs border border-stone-700 transition-colors"
                >
                  Send us a Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

