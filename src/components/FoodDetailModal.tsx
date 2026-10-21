import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Plus, Minus, ShoppingBag, Check, Flame } from 'lucide-react';
import { FoodItem, CartItemCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { FoodImage } from './FoodImage';

interface FoodDetailModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  isOpen,
  onClose,
  onOpenCart
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSingleOptions, setSelectedSingleOptions] = useState<Record<string, { optionName: string; price: number }>>({});
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<Record<string, { optionName: string; price: number }[]>>({});
  const [addedToast, setAddedToast] = useState(false);
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);
  const [relatedFoods, setRelatedFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (food) {
      setActiveFood(food);
    }
  }, [food]);

  useEffect(() => {
    if (activeFood) {
      setQuantity(1);
      setAddedToast(false);
      // Initialize single selection defaults
      const singles: Record<string, { optionName: string; price: number }> = {};
      const multiples: Record<string, { optionName: string; price: number }[]> = {};

      if (activeFood.customizations) {
        activeFood.customizations.forEach((group) => {
          if (group.type === 'single' && group.options.length > 0) {
            singles[group.name] = {
              optionName: group.options[0].name,
              price: group.options[0].price
            };
          } else if (group.type === 'multiple') {
            multiples[group.name] = [];
          }
        });
      }
      setSelectedSingleOptions(singles);
      setSelectedMultipleOptions(multiples);

      // Fetch related foods
      fetch(`/api/foods?category=${encodeURIComponent(activeFood.category)}`)
        .then(res => res.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : (data.foods || []);
          const filtered = arr.filter((f: FoodItem) => f.id !== activeFood.id);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setRelatedFoods(shuffled.slice(0, 4));
        })
        .catch(err => console.error(err));
    }
  }, [activeFood]);

  if (!isOpen || !activeFood) return null;

  // Calculate current extra price
  let additionalPrice = 0;
  Object.values(selectedSingleOptions).forEach((opt) => {
    additionalPrice += opt.price;
  });
  Object.values(selectedMultipleOptions).forEach((list) => {
    list.forEach((opt) => {
      additionalPrice += opt.price;
    });
  });

  const unitPrice = activeFood.price + additionalPrice;
  const totalPrice = unitPrice * quantity;

  const handleSingleSelect = (groupName: string, optionName: string, price: number) => {
    setSelectedSingleOptions((prev) => ({
      ...prev,
      [groupName]: { optionName, price }
    }));
  };

  const handleMultipleToggle = (groupName: string, optionName: string, price: number) => {
    setSelectedMultipleOptions((prev) => {
      const currentList = prev[groupName] || [];
      const exists = currentList.find((i) => i.optionName === optionName);
      let updated;
      if (exists) {
        updated = currentList.filter((i) => i.optionName !== optionName);
      } else {
        updated = [...currentList, { optionName, price }];
      }
      return { ...prev, [groupName]: updated };
    });
  };

  const handleAddToCart = () => {
    const customizations: CartItemCustomization[] = [];
    Object.entries(selectedSingleOptions).forEach(([groupName, opt]) => {
      customizations.push({
        groupName,
        selectedOption: opt.optionName,
        additionalPrice: opt.price
      });
    });
    Object.entries(selectedMultipleOptions).forEach(([groupName, list]) => {
      list.forEach((opt) => {
        customizations.push({
          groupName,
          selectedOption: opt.optionName,
          additionalPrice: opt.price
        });
      });
    });

    addToCart(activeFood, quantity, customizations);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
      if (onOpenCart) onOpenCart();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1C1917] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 max-h-[92vh] flex flex-col">
        {/* Close button */}
        <button
          id="close-food-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pb-4">
            {/* Hero Food Image */}
          <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden bg-stone-900">
            <FoodImage
              src={activeFood.image}
              alt={activeFood.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/25 to-transparent pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                  activeFood.isVegetarian
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-600/50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeFood.isVegetarian ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
                {activeFood.isVegetarian ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>

              {activeFood.isPopular && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/100 text-stone-950 flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-stone-950" /> Chef's Bestseller
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  {activeFood.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                  {activeFood.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Base Price</span>
                <span className="text-2xl font-bold text-amber-400 font-serif-luxury">
                  ₹{activeFood.price}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pb-4 border-b border-stone-800">
              <div className="flex items-center gap-1 bg-amber-500/100/20 px-2.5 py-1 rounded-lg text-amber-300 font-semibold border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{activeFood.rating}</span>
                <span className="text-stone-400">({activeFood.reviewCount} reviews)</span>
              </div>
              {activeFood.preparationTime && (
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Prep time: {activeFood.preparationTime}</span>
                </div>
              )}
              <div className="text-stone-400">
                Status:{' '}
                <span className={activeFood.isAvailable ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                  {activeFood.isAvailable ? 'Available Now' : 'Sold Out for Today'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Description
              </h3>
              <p className="text-sm text-stone-200 leading-relaxed font-light">
                {activeFood.description}
              </p>
            </div>

            {/* Ingredients */}
            {activeFood.ingredients && activeFood.ingredients.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Key Fresh Ingredients
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeFood.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 text-xs"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {activeFood.customizations && activeFood.customizations.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    Customize Your Dish
                  </h3>
                  <span className="text-[11px] text-stone-400">Select your preferences</span>
                </div>

                {activeFood.customizations.map((group) => {
                  const isSingle = group.type === 'single';
                  return (
                    <div
                      key={group.name}
                      className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-200">
                        <span>{group.name}</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          {isSingle ? 'Choose one' : 'Optional add-ons'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((opt) => {
                          const isSelected = isSingle
                            ? selectedSingleOptions[group.name]?.optionName === opt.name
                            : !!selectedMultipleOptions[group.name]?.find((i) => i.optionName === opt.name);

                          return (
                            <button
                              type="button"
                              key={opt.name}
                              onClick={() => {
                                if (isSingle) {
                                  handleSingleSelect(group.name, opt.name, opt.price);
                                } else {
                                  handleMultipleToggle(group.name, opt.name, opt.price);
                                }
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                                isSelected
                                  ? 'bg-amber-500/100/15 border-amber-500 text-amber-200 font-medium'
                                  : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:border-stone-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-${isSingle ? 'full' : 'md'} border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-amber-400 bg-amber-500/100 text-stone-950'
                                      : 'border-stone-600'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{opt.name}</span>
                              </div>
                              <span className="text-stone-400 font-semibold">
                                {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Related Items Section */}
            {relatedFoods.length > 0 && (
              <div className="pt-6 border-t border-stone-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Perfect Pairings & Related Items
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedFoods.map(related => (
                    <button 
                      key={related.id} 
                      onClick={() => setActiveFood(related)}
                      className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800 transition-all flex flex-col text-left group"
                    >
                      <div className="h-20 w-full overflow-hidden relative">
                        <FoodImage src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-[11px] font-bold text-stone-200 line-clamp-1">{related.name}</h4>
                        <span className="text-amber-400 font-bold text-[11px] mt-1 block">₹{related.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions with sticky price */}
        <div className="p-4 sm:p-6 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center border border-stone-700 rounded-xl bg-stone-950 p-1">
            <button
              id="detail-qty-minus"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center text-stone-300 disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-stone-100">
              {quantity}
            </span>
            <button
              id="detail-qty-plus"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center text-stone-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            id="detail-add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!activeFood.isAvailable || addedToast}
            className="flex-1 py-3 px-6 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/20 active:scale-98 disabled:opacity-50"
          >
            {addedToast ? (
              <>
                <Check className="w-5 h-5 text-stone-950 stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 text-stone-950" />
                <span>Add to Cart • ₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
