import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Plus,
  Flame,
  Check,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FoodCategory, FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { FoodImage } from './FoodImage';

interface MenuViewProps {
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Starters',
  'Main Course',
  'Biriyani',
  'Pizza',
  'Burgers',
  'Pasta',
  'Desserts',
  'Beverages'
];

const CATEGORY_IMAGES: Record<string, string> = {
  'All': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&auto=format&fit=crop&q=80',
  'Starters': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=150&auto=format&fit=crop&q=80',
  'Biriyani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
  'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80',
  'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80',
  'Pasta': 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=150&auto=format&fit=crop&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&auto=format&fit=crop&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=150&auto=format&fit=crop&q=80'
};

export const MenuView: React.FC<MenuViewProps> = ({
  foods,
  onSelectFood,
  selectedCategory: propCategory,
  onSelectCategory
}) => {
  const { addToCart } = useCart();
  const [internalCategory, setInternalCategory] = useState<'All' | FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  // Sync prop category if provided
  useEffect(() => {
    if (propCategory && CATEGORIES.includes(propCategory as any)) {
      setInternalCategory(propCategory as any);
    }
  }, [propCategory]);

  const activeCategory = propCategory && CATEGORIES.includes(propCategory as any)
    ? (propCategory as 'All' | FoodCategory)
    : internalCategory;

  const handleCategoryChange = (cat: 'All' | FoodCategory) => {
    setInternalCategory(cat);
    setVegFilter('all');
    setSearchQuery('');
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (activeCategory !== 'All' && food.category !== activeCategory) {
          return false;
        }
        // Veg filter
        if (vegFilter === 'veg' && !food.isVegetarian) return false;
        if (vegFilter === 'non-veg' && food.isVegetarian) return false;
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = food.name.toLowerCase().includes(q);
          const matchDesc = food.description.toLowerCase().includes(q);
          const matchIng = food.ingredients?.some((i) => i.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchIng) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // recommended: bestsellers first
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [foods, activeCategory, vegFilter, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, food: FoodItem) => {
    e.stopPropagation();
    // If food has customizations, open modal so user can choose; otherwise add directly
    if (food.customizations && food.customizations.length > 0) {
      onSelectFood(food);
    } else {
      addToCart(food, 1, []);
      setAddedItemAnimation(food.id);
      setTimeout(() => setAddedItemAnimation(null), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Freshly Cooked & Table-Served
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-stone-100">
          Zestora Food Menu
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
          From fiery clay tandoor starters to slow-simmered dum biriyanis and artisanal pizzas. Choose your favorites and customize every detail to taste.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-stone-900/40 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/10 shadow-sm space-y-4">
        {/* Search, veg filter, and sort controls */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search dishes (e.g., Biriyani, Tikka, Pizza, Brownie)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() !== '') {
                  setInternalCategory('All');
                  if (onSelectCategory) onSelectCategory('All');
                }
              }}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-stone-800/50 border border-white/10 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-stone-900/60 backdrop-blur-md transition-all text-stone-200 placeholder:text-stone-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Veg / Non-Veg toggle */}
            <div className="flex bg-stone-800/50 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  vegFilter === 'all'
                    ? 'bg-stone-900/40 backdrop-blur-md text-stone-100 shadow-sm'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  vegFilter === 'veg'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Veg
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  vegFilter === 'non-veg'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                Non-Veg
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 bg-stone-800/50 hover:bg-stone-700/50 transition-colors border border-white/10 rounded-2xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                id="menu-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-stone-300 focus:outline-none cursor-pointer [&>option]:bg-stone-900 [&>option]:text-stone-200"
              >
                <option value="recommended">Featured / Bestsellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category horizontal scroll bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`pl-1.5 pr-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shadow-sm ${
                  isActive
                    ? 'bg-stone-900 border-amber-500/50 text-amber-400 scale-102'
                    : 'bg-stone-800/50 hover:bg-stone-700/50 border-white/10 text-stone-300'
                }`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                  <img src={CATEGORY_IMAGES[cat]} alt={cat} className="w-full h-full object-cover" />
                </div>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 space-y-3">
          <p className="text-base font-semibold text-stone-300">
            No dishes found matching your criteria.
          </p>
          <p className="text-xs text-stone-500">
            Try resetting your filters or searching for something else like "Biriyani", "Tikka", or "Brownie".
          </p>
          <button
            onClick={() => {
              handleCategoryChange('All');
              setVegFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/100 text-stone-950 text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          <AnimatePresence>
          {filteredFoods.map((food) => {
            const isJustAdded = addedItemAnimation === food.id;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={food.id}
                onClick={() => onSelectFood(food)}
                className="bg-stone-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col group relative"
              >
                {/* Image container */}
                <div className="relative aspect-[16/11] sm:h-52 w-full overflow-hidden bg-stone-800/50">
                  <FoodImage
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Veg / Non-veg square badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-md border-2 bg-stone-900/40 backdrop-blur-md flex items-center justify-center shadow-sm ${
                        food.isVegetarian ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                      title={food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          food.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </div>
                    {food.isPopular && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/100 text-stone-950 font-bold text-[10px] flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3 fill-stone-950" /> Bestseller
                      </span>
                    )}
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute bottom-3 right-3 bg-stone-950/85 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md border border-stone-700/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{food.rating}</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      ({food.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                      <span className="text-amber-400">{food.category}</span>
                      {food.preparationTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {food.preparationTime}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-stone-100 mt-1 group-hover:text-amber-400 transition-colors">
                      {food.name}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  {/* Price and Add button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Price</span>
                      <span className="text-lg font-bold text-stone-100 font-serif-luxury">
                        ₹{food.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      id={`menu-add-btn-${food.id}`}
                      onClick={(e) => handleQuickAdd(e, food)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white scale-95'
                          : 'bg-amber-500/100 hover:bg-amber-400 text-stone-950 hover:shadow-md'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : food.customizations && food.customizations.length > 0 ? (
                        <>
                          <span>Customize</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
