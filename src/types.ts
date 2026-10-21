export type FoodCategory =
  | 'Starters'
  | 'Main Course'
  | 'Biriyani'
  | 'Pizza'
  | 'Burgers'
  | 'Pasta'
  | 'Desserts'
  | 'Beverages';

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  name: string; // e.g. "Size", "Add-ons", "Preparation"
  type: 'single' | 'multiple';
  required?: boolean;
  options: CustomizationOption[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  rating: number;
  reviewCount: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  ingredients: string[];
  customizations?: CustomizationGroup[];
  isPopular?: boolean;
  isSpecialToday?: boolean;
  preparationTime?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  address?: {
    houseNumber?: string;
    street?: string;
    city?: string;
    pincode?: string;
    landmark?: string;
  };
  createdAt: string;
}

export interface CartItemCustomization {
  groupName: string;
  selectedOption: string;
  additionalPrice: number;
}

export interface CartItem {
  cartItemId: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVegetarian: boolean;
  selectedCustomizations?: CartItemCustomization[];
  customizationTotal: number;
  unitTotal: number;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'Pay at Restaurant'
  | 'UPI'
  | 'Credit/Debit Card';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface DeliveryAddress {
  houseNumber: string;
  street: string;
  city: string;
  pincode: string;
  landmark?: string;
}

export interface Order {
  id: string; // e.g. ZES-20260925-1024
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  orderType: OrderType;
  tableId?: string;
  tableNumber?: string;
  deliveryAddress?: DeliveryAddress;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status?: OrderStatus;
  reservationId?: string;
  createdAt: string;
}

export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  location: 'Window' | 'Center' | 'Patio' | 'Booth';
  x?: number; // visual floorplan coordinate
  y?: number;
}

export interface Reservation {
  id: string;
  reservationId: string; // e.g. RES-20260925-8821
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string;
  tableNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "07:30 PM"
  guests: number;
  specialRequest?: string;
  foodOrderId?: string;
  preOrderItems?: CartItem[];
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export type TableReservation = Reservation;

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  dishName?: string;
  date: string;
}

export interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  revenue: number;
  activeReservations: number;
  availableTables: number;
  popularFoods: { name: string; ordersCount: number; revenue: number }[];
}
