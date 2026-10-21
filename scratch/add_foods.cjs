const fs = require('fs');
const path = 'c:/Users/mangudi/Downloads/zestora-restaurant/server/db.ts';

let content = fs.readFileSync(path, 'utf-8');

const newFoods = `
  {
    id: 'food-13',
    name: 'Hyderabadi Dum Biriyani',
    description: 'Classic slow-cooked basmati rice with marinated chicken, authentic spices, and a touch of saffron.',
    price: 240,
    category: 'Biriyani',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 230,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices'],
    preparationTime: '25 mins'
  },
  {
    id: 'food-14',
    name: 'Awadhi Mutton Biriyani',
    description: 'Tender mutton pieces layered with fragrant rice, cooked in royal Awadhi style with kewra water.',
    price: 320,
    category: 'Biriyani',
    image: 'https://images.unsplash.com/photo-1589302168068-98c25e162b77?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 156,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Mutton', 'Basmati Rice', 'Kewra', 'Saffron'],
    preparationTime: '30 mins'
  },
  {
    id: 'food-15',
    name: 'Lucknowi Veg Biriyani',
    description: 'A rich and aromatic vegetarian biriyani packed with fresh vegetables, paneer cubes, and cashew nuts.',
    price: 190,
    category: 'Biriyani',
    image: 'https://images.unsplash.com/photo-1605333391744-30fb15c1c01e?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 89,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Mixed Veggies', 'Paneer', 'Basmati Rice', 'Spices'],
    preparationTime: '20 mins'
  },
  {
    id: 'food-16',
    name: 'Pepperoni Overload Pizza',
    description: 'A carnivorous delight packed with spicy pepperoni slices, mozzarella, and a robust tomato sauce.',
    price: 290,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 310,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Dough'],
    preparationTime: '20 mins'
  },
  {
    id: 'food-17',
    name: 'Veggie Supreme Pizza',
    description: 'Loaded with bell peppers, olives, mushrooms, and onions on a thin crust base.',
    price: 230,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 112,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Olives', 'Bell Peppers', 'Mushrooms', 'Mozzarella'],
    preparationTime: '18 mins'
  },
  {
    id: 'food-18',
    name: 'Spicy Paneer Tikka Pizza',
    description: 'Fusion pizza featuring tandoori paneer tikka, red paprika, and gooey cheese.',
    price: 260,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 145,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Paneer Tikka', 'Paprika', 'Cheese', 'Pizza Sauce'],
    preparationTime: '20 mins'
  },
  {
    id: 'food-19',
    name: 'Classic Veggie Burger',
    description: 'A wholesome vegetable patty topped with fresh lettuce, tomatoes, and a tangy mustard mayo.',
    price: 150,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewCount: 88,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Veggie Patty', 'Lettuce', 'Tomato', 'Burger Bun'],
    preparationTime: '12 mins'
  },
  {
    id: 'food-20',
    name: 'Double Smash Beef Burger',
    description: 'Two smashed beef patties with caramelized onions, double cheddar, and house sauce on a toasted bun.',
    price: 280,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 420,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Beef Patty', 'Cheddar', 'Onions', 'Burger Bun'],
    preparationTime: '15 mins'
  },
  {
    id: 'food-21',
    name: 'Spicy Arrabiata Pasta',
    description: 'Penne pasta tossed in a fiery, garlic-infused tomato basil sauce.',
    price: 190,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 130,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Penne', 'Tomato Sauce', 'Garlic', 'Chili Flakes'],
    preparationTime: '15 mins'
  },
  {
    id: 'food-22',
    name: 'Pesto Chicken Pasta',
    description: 'Fusilli pasta mixed with rich basil pesto, cherry tomatoes, and grilled chicken strips.',
    price: 240,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996316220-410787e95b77?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 95,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Fusilli', 'Basil Pesto', 'Chicken', 'Parmesan'],
    preparationTime: '18 mins'
  },
  {
    id: 'food-23',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
    price: 180,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 210,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Mascarpone', 'Coffee', 'Ladyfingers', 'Cocoa'],
    preparationTime: '5 mins'
  },
  {
    id: 'food-24',
    name: 'New York Cheesecake',
    description: 'Creamy and dense cheesecake with a graham cracker crust, topped with strawberry coulis.',
    price: 200,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 180,
    isVegetarian: false,
    isAvailable: true,
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Strawberries'],
    preparationTime: '5 mins'
  },
  {
    id: 'food-25',
    name: 'Iced Caramel Macchiato',
    description: 'Chilled espresso combined with vanilla syrup, milk, and a sweet caramel drizzle.',
    price: 140,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 220,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Espresso', 'Milk', 'Caramel', 'Vanilla'],
    preparationTime: '5 mins'
  },
  {
    id: 'food-26',
    name: 'Mint Mojito Mocktail',
    description: 'Refreshing blend of muddled mint, lime juice, and soda water.',
    price: 110,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 140,
    isVegetarian: true,
    isAvailable: true,
    ingredients: ['Mint', 'Lime', 'Soda Water', 'Sugar'],
    preparationTime: '5 mins'
  }
`;

// Insert before the last bracket of initialFoods
const targetStr = \`  }
];\`;

const replacement = \`  },
\${newFoods}
];\`;

const newContent = content.replace(targetStr, replacement);
fs.writeFileSync(path, newContent, 'utf-8');
console.log('Added foods successfully.');
