import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db';
import {
  generateToken,
  authenticateToken,
  optionalAuthenticateToken,
  requireAdmin,
  AuthenticatedRequest
} from './auth';
import {
  FoodItem,
  Order,
  Reservation,
  RestaurantTable,
  Review,
  CartItem
} from '../src/types';

export const apiRouter = Router();

// ==========================================
// AUTH ROUTES
// ==========================================

// Register
apiRouter.post('/auth/register', async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await db.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = await db.addUser({
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    passwordHash
  });

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role
  });

  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      address: newUser.address
    }
  });
});

// Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  return res.json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address
    }
  });
});

// Profile
apiRouter.get('/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = await db.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    createdAt: user.createdAt
  });
});

// Update profile
apiRouter.put('/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, phone, address } = req.body;
  const updated = await db.updateUser(req.user!.id, {
    name: name ? name.trim() : undefined,
    phone: phone ? phone.trim() : undefined,
    address: address || undefined
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    message: 'Profile updated successfully',
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      address: updated.address
    }
  });
});

// ==========================================
// FOODS ROUTES
// ==========================================

apiRouter.get('/foods', async (req, res) => {
  let foods = await db.getFoods();
  const { q, category, isVeg, sort } = req.query;

  if (category && category !== 'All') {
    foods = foods.filter((f) => f.category.toLowerCase() === String(category).toLowerCase());
  }

  if (isVeg !== undefined && isVeg !== 'all') {
    const vegBool = isVeg === 'true';
    foods = foods.filter((f) => f.isVegetarian === vegBool);
  }

  if (q && typeof q === 'string' && q.trim()) {
    const search = q.toLowerCase();
    foods = foods.filter(
      (f) =>
        f.name.toLowerCase().includes(search) ||
        f.description.toLowerCase().includes(search) ||
        (f.ingredients || []).some((ing) => ing.toLowerCase().includes(search))
    );
  }

  if (sort === 'price_asc') {
    foods.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    foods.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    foods.sort((a, b) => b.rating - a.rating);
  }

  return res.json(foods);
});

apiRouter.get('/foods/:id', async (req, res) => {
  const food = await db.getFoodById(req.params.id);
  if (!food) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  return res.json(food);
});

apiRouter.post('/foods', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, price, category, image, isVegetarian, isAvailable, ingredients, customizations } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newFood: FoodItem = {
    id: `food-${Date.now()}`,
    name,
    description: description || '',
    price: Number(price),
    category,
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 1,
    isVegetarian: Boolean(isVegetarian),
    isAvailable: isAvailable !== false,
    isPopular: false,
    isSpecialToday: false,
    ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map((s: string) => s.trim()) : []),
    customizations: customizations || []
  };

  await db.addFood(newFood);
  return res.status(201).json(newFood);
});

apiRouter.put('/foods/:id', authenticateToken, requireAdmin, async (req, res) => {
  const updated = await db.updateFood(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  return res.json(updated);
});

apiRouter.delete('/foods/:id', authenticateToken, requireAdmin, async (req, res) => {
  const deleted = await db.deleteFood(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  return res.json({ message: 'Food item deleted successfully' });
});

// ==========================================
// CART ROUTES
// ==========================================

apiRouter.get('/cart', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const items = await db.getUserCart(req.user!.id);
  return res.json(items);
});

apiRouter.post('/cart', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const item: CartItem = req.body;
  if (!item || !item.foodId) {
    return res.status(400).json({ error: 'Invalid cart item' });
  }

  const currentCart = await db.getUserCart(req.user!.id);
  const customKey = JSON.stringify(item.selectedCustomizations || []);
  const existingIndex = currentCart.findIndex(
    (c) => c.foodId === item.foodId && JSON.stringify(c.selectedCustomizations || []) === customKey
  );

  if (existingIndex !== -1) {
    currentCart[existingIndex].quantity += item.quantity || 1;
  } else {
    currentCart.push({
      ...item,
      cartItemId: item.cartItemId || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    });
  }

  await db.saveUserCart(req.user!.id, currentCart);
  return res.json(currentCart);
});

apiRouter.put('/cart/:cartItemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { quantity } = req.body;
  const currentCart = await db.getUserCart(req.user!.id);
  const idx = currentCart.findIndex((i) => i.cartItemId === req.params.cartItemId);

  if (idx !== -1) {
    if (quantity <= 0) {
      currentCart.splice(idx, 1);
    } else {
      currentCart[idx].quantity = quantity;
    }
    await db.saveUserCart(req.user!.id, currentCart);
    return res.json(currentCart);
  }
  return res.status(404).json({ error: 'Cart item not found' });
});

apiRouter.delete('/cart/:cartItemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  let currentCart = await db.getUserCart(req.user!.id);
  currentCart = currentCart.filter((i) => i.cartItemId !== req.params.cartItemId);
  await db.saveUserCart(req.user!.id, currentCart);
  return res.json(currentCart);
});

apiRouter.delete('/cart', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  await db.saveUserCart(req.user!.id, []);
  return res.json([]);
});

// ==========================================
// ORDERS ROUTES
// ==========================================

apiRouter.get('/orders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'admin') {
    return res.json(await db.getOrders());
  }
  return res.json(await db.getOrdersByUserId(req.user!.id));
});

apiRouter.get('/orders/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const order = await db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (req.user!.role !== 'admin' && order.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  return res.json(order);
});

apiRouter.post('/orders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const {
    items,
    orderType,
    tableId,
    tableNumber,
    deliveryAddress,
    paymentMethod,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total,
    reservationId,
    isPreOrder
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Your cart is empty. Please add items before placing an order.' });
  }

  if (orderType === 'Delivery' && (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city)) {
    return res.status(400).json({ error: 'Complete delivery address is required for Delivery orders.' });
  }

  if (orderType === 'Dine-In' && !tableId && !tableNumber) {
    return res.status(400).json({ error: 'Please select a table for Dine-In orders.' });
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ZES-${todayStr}-${randomSuffix}`;

  const user = await db.findUserById(req.user!.id);

  const newOrder: Order = {
    id: orderId,
    userId: req.user!.id,
    customerName: user ? user.name : req.user!.name,
    customerPhone: user ? user.phone : '',
    customerEmail: req.user!.email,
    items,
    orderType,
    tableId,
    tableNumber,
    deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
    subtotal: Number(subtotal) || 0,
    tax: Number(tax) || 0,
    serviceCharge: Number(serviceCharge) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    paymentStatus: paymentMethod === 'Cash on Delivery' || paymentMethod === 'Pay at Restaurant' ? 'Pending' : 'Paid',
    orderStatus: 'Order Placed',
    reservationId,
    createdAt: new Date().toISOString()
  };

  await db.addOrder(newOrder);
  await db.saveUserCart(req.user!.id, []);

  if (reservationId) {
    await db.updateReservation(reservationId, { foodOrderId: orderId, preOrderItems: items });
  }

  if (tableId && !isPreOrder) {
    await db.updateTable(tableId, { status: 'Occupied' });
  }

  return res.status(201).json({
    message: 'Order Placed Successfully!',
    order: newOrder
  });
});

apiRouter.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = await db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json({
    message: 'Order status updated successfully',
    order: updated
  });
});

// ==========================================
// RESERVATIONS ROUTES
// ==========================================

apiRouter.get('/reservations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'admin') {
    return res.json(await db.getReservations());
  }
  return res.json(await db.getReservationsByUserId(req.user!.id));
});

apiRouter.get('/reservations/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const reservation = await db.getReservationById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  if (req.user!.role !== 'admin' && reservation.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  return res.json(reservation);
});

apiRouter.post('/reservations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const {
    customerName,
    customerPhone,
    date,
    time,
    guests,
    tableId,
    tableNumber,
    specialRequest,
    preOrderItems,
    foodOrderId
  } = req.body;

  if (!date || !time || !guests || !tableId) {
    return res.status(400).json({ error: 'Date, time, guests, and table are required' });
  }

  const table = await db.getTableById(tableId);
  if (!table) {
    return res.status(404).json({ error: 'Selected table not found' });
  }
  if (table.status === 'Reserved' || table.status === 'Occupied') {
    return res.status(400).json({ error: 'Selected table is currently unavailable. Please select an available table.' });
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reservationId = `RES-${todayStr}-${randomSuffix}`;

  const user = await db.findUserById(req.user!.id);

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    reservationId,
    userId: req.user!.id,
    customerName: customerName || (user ? user.name : req.user!.name),
    customerEmail: req.user!.email,
    customerPhone: customerPhone || (user ? user.phone : ''),
    tableId,
    tableNumber: tableNumber || table.tableNumber,
    date,
    time,
    guests: Number(guests),
    specialRequest: specialRequest || '',
    foodOrderId,
    preOrderItems: preOrderItems || [],
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  await db.addReservation(newReservation);
  await db.updateTable(tableId, { status: 'Reserved' });

  return res.status(201).json({
    message: 'Table Reserved Successfully!',
    reservation: newReservation
  });
});

apiRouter.put('/reservations/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const resId = req.params.id;
  const current = await db.getReservationById(resId);
  if (!current) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  if (req.user!.role !== 'admin' && current.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await db.updateReservation(resId, req.body);
  if (req.body.status === 'Cancelled' && current.tableId) {
    await db.updateTable(current.tableId, { status: 'Available' });
  }

  return res.json({
    message: 'Reservation updated successfully',
    reservation: updated
  });
});

apiRouter.delete('/reservations/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const resId = req.params.id;
  const current = await db.getReservationById(resId);
  if (!current) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  if (req.user!.role !== 'admin' && current.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await db.updateReservation(resId, { status: 'Cancelled' });
  if (current.tableId) {
    await db.updateTable(current.tableId, { status: 'Available' });
  }

  return res.json({
    message: 'Reservation cancelled successfully',
    reservation: updated
  });
});

// ==========================================
// TABLES ROUTES
// ==========================================

apiRouter.get('/tables', async (_req, res) => {
  return res.json(await db.getTables());
});

apiRouter.post('/tables', authenticateToken, requireAdmin, async (req, res) => {
  const { tableNumber, capacity, location, status } = req.body;
  if (!tableNumber || !capacity) {
    return res.status(400).json({ error: 'Table number and capacity are required' });
  }

  const newTable: RestaurantTable = {
    id: `table-${Date.now()}`,
    tableNumber,
    capacity: Number(capacity),
    location: location || 'Center',
    status: status || 'Available'
  };

  await db.addTable(newTable);
  return res.status(201).json(newTable);
});

apiRouter.put('/tables/:id', authenticateToken, requireAdmin, async (req, res) => {
  const updated = await db.updateTable(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Table not found' });
  }
  return res.json(updated);
});

// ==========================================
// REVIEWS ROUTES
// ==========================================

apiRouter.get('/reviews', async (_req, res) => {
  return res.json(await db.getReviews());
});

apiRouter.post('/reviews', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { userName, rating, comment, dishName } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and comment are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    userName: req.user ? req.user.name : userName,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
    rating: Number(rating),
    comment,
    dishName: dishName || undefined,
    date: 'Today'
  };

  await db.addReview(newReview);
  return res.status(201).json(newReview);
});

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================

apiRouter.get('/admin/stats', authenticateToken, requireAdmin, async (_req, res) => {
  const orders = await db.getOrders();
  const tables = await db.getTables();
  const reservations = await db.getReservations();
  const foods = await db.getFoods();

  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeReservations = reservations.filter((r) => r.status === 'Confirmed').length;
  const availableTables = tables.filter((t) => t.status === 'Available').length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr)).length;

  const foodSalesMap: Record<string, { count: number; revenue: number }> = {};
  for (const ord of orders) {
    for (const item of (ord.items || [])) {
      if (!foodSalesMap[item.name]) {
        foodSalesMap[item.name] = { count: 0, revenue: 0 };
      }
      foodSalesMap[item.name].count += item.quantity;
      foodSalesMap[item.name].revenue += item.unitTotal * item.quantity;
    }
  }

  const popularFoods = Object.entries(foodSalesMap)
    .map(([name, stat]) => ({
      name,
      ordersCount: stat.count,
      revenue: stat.revenue
    }))
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 5);

  return res.json({
    totalOrders,
    todayOrders: todayOrders || 0,
    revenue,
    activeReservations,
    availableTables,
    popularFoods
  });
});
