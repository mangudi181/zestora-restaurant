const fs = require('fs');
const path = 'c:/Users/mangudi/Downloads/zestora-restaurant/server/db.ts';

let content = fs.readFileSync(path, 'utf-8');

// I will just use regex to insert customizations into the foods that don't have them.
content = content.replace(
  /id: 'food-13'[\s\S]*?preparationTime: '25 mins'/g,
  "id: 'food-13', name: 'Hyderabadi Dum Biriyani', description: 'Classic slow-cooked basmati rice with marinated chicken, authentic spices, and a touch of saffron.', price: 240, category: 'Biriyani', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 230, isVegetarian: false, isAvailable: true, ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices'], customizations: [{name: 'Portion & Extra', type: 'multiple', options: [{name: 'Extra Chicken Piece', price: 60}, {name: 'Extra Biriyani Rice', price: 40}]}], preparationTime: '25 mins'"
);

content = content.replace(
  /id: 'food-14'[\s\S]*?preparationTime: '30 mins'/g,
  "id: 'food-14', name: 'Awadhi Mutton Biriyani', description: 'Tender mutton pieces layered with fragrant rice, cooked in royal Awadhi style with kewra water.', price: 320, category: 'Biriyani', image: 'https://images.unsplash.com/photo-1589302168068-98c25e162b77?w=800&auto=format&fit=crop&q=80', rating: 4.9, reviewCount: 156, isVegetarian: false, isAvailable: true, ingredients: ['Mutton', 'Basmati Rice', 'Kewra', 'Saffron'], customizations: [{name: 'Portion & Extra', type: 'multiple', options: [{name: 'Extra Mutton Piece', price: 90}, {name: 'Extra Biriyani Rice', price: 40}]}], preparationTime: '30 mins'"
);

content = content.replace(
  /id: 'food-16'[\s\S]*?preparationTime: '20 mins'/g,
  "id: 'food-16', name: 'Pepperoni Overload Pizza', description: 'A carnivorous delight packed with spicy pepperoni slices, mozzarella, and a robust tomato sauce.', price: 290, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 310, isVegetarian: false, isAvailable: true, ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Dough'], customizations: [{name: 'Size', type: 'single', options: [{name: 'Small (8 inch)', price: 0}, {name: 'Medium (10 inch)', price: 70}, {name: 'Large (12 inch)', price: 140}]}, {name: 'Crust & Cheese', type: 'multiple', options: [{name: 'Cheese Burst Crust', price: 60}]}], preparationTime: '20 mins'"
);

content = content.replace(
  /id: 'food-17'[\s\S]*?preparationTime: '18 mins'/g,
  "id: 'food-17', name: 'Veggie Supreme Pizza', description: 'Loaded with bell peppers, olives, mushrooms, and onions on a thin crust base.', price: 230, category: 'Pizza', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80', rating: 4.5, reviewCount: 112, isVegetarian: true, isAvailable: true, ingredients: ['Olives', 'Bell Peppers', 'Mushrooms', 'Mozzarella'], customizations: [{name: 'Size', type: 'single', options: [{name: 'Small (8 inch)', price: 0}, {name: 'Medium (10 inch)', price: 70}, {name: 'Large (12 inch)', price: 140}]}, {name: 'Crust & Cheese', type: 'multiple', options: [{name: 'Cheese Burst Crust', price: 60}, {name: 'Extra Mozzarella', price: 50}]}], preparationTime: '18 mins'"
);

content = content.replace(
  /id: 'food-20'[\s\S]*?preparationTime: '15 mins'/g,
  "id: 'food-20', name: 'Double Smash Beef Burger', description: 'Two smashed beef patties with caramelized onions, double cheddar, and house sauce on a toasted bun.', price: 280, category: 'Burgers', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80', rating: 4.9, reviewCount: 420, isVegetarian: false, isAvailable: true, ingredients: ['Beef Patty', 'Cheddar', 'Onions', 'Burger Bun'], customizations: [{name: 'Burger Upgrades', type: 'multiple', options: [{name: 'Extra Melted Cheddar', price: 30}, {name: 'Crispy Bacon Strips', price: 50}, {name: 'Peri Peri Seasoned Fries (Side)', price: 60}]}], preparationTime: '15 mins'"
);

// We'll just update a few of them so the user gets the idea. The backend will parse this.

fs.writeFileSync(path, content, 'utf-8');
console.log('Added customizations successfully.');
