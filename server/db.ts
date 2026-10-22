/**
 * File-based JSON database — no PostgreSQL required.
 * All data is persisted to data/db.json on every write.
 */
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  FoodItem,
  User,
  Order,
  Reservation,
  RestaurantTable,
  Review,
  CartItem,
} from '../src/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface DbSchema {
  users: any[];
  foods: FoodItem[];
  tables: RestaurantTable[];
  orders: Order[];
  reservations: Reservation[];
  reviews: Review[];
  carts: { userId: string; items: CartItem[] }[];
}

function readDb(): DbSchema {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw) as Partial<DbSchema>;
    return {
      users:        Array.isArray(data.users)        ? data.users        : [],
      foods:        Array.isArray(data.foods)        ? data.foods        : [],
      tables:       Array.isArray(data.tables)       ? data.tables       : [],
      orders:       Array.isArray(data.orders)       ? data.orders       : [],
      reservations: Array.isArray(data.reservations) ? data.reservations : [],
      reviews:      Array.isArray(data.reviews)      ? data.reviews      : [],
      carts:        Array.isArray(data.carts)        ? data.carts        : [],
    };
  } catch {
    return { users: [], foods: [], tables: [], orders: [], reservations: [], reviews: [], carts: [] };
  }
}

function writeDb(data: DbSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

class Database {
  async init() {
    await this.seedData();
  }

  private async seedData() {
    const data = readDb();

    // Seed default users if none exist
    if (data.users.length === 0) {
      const adminHash = bcrypt.hashSync('admin123', 10);
      const userHash = bcrypt.hashSync('password123', 10);
      data.users.push(
        {
          id: 'user-admin',
          name: 'Zestora Master Admin',
          email: 'admin@zestora.com',
          phone: '+91 98765 43210',
          role: 'admin',
          address: null,
          createdAt: new Date().toISOString(),
          passwordHash: adminHash,
        },
        {
          id: 'user-demo',
          name: 'Rahul Sen',
          email: 'rahul@example.com',
          phone: '+91 98123 45678',
          role: 'user',
          address: {
            houseNumber: 'Flat 402, Green Glen',
            street: '100ft Road, Indiranagar',
            city: 'Bengaluru',
            pincode: '560038',
            landmark: 'Near Metro Station',
          },
          createdAt: new Date().toISOString(),
          passwordHash: userHash,
        }
      );
      writeDb(data);
      console.log('✅ Seeded default users');
    }

    // Seed default tables if none exist
    if (data.tables.length === 0) {
      data.tables = [
        { id: 'table-1', tableNumber: 'Table 1', capacity: 2, status: 'Available', location: 'Window', x: 1, y: 1 },
        { id: 'table-2', tableNumber: 'Table 2', capacity: 4, status: 'Available', location: 'Window', x: 3, y: 1 },
        { id: 'table-3', tableNumber: 'Table 3', capacity: 4, status: 'Reserved', location: 'Center', x: 2, y: 2 },
        { id: 'table-4', tableNumber: 'Table 4', capacity: 6, status: 'Available', location: 'Booth', x: 1, y: 3 },
        { id: 'table-5', tableNumber: 'Table 5', capacity: 8, status: 'Available', location: 'Patio', x: 3, y: 3 },
        { id: 'table-6', tableNumber: 'Table 6', capacity: 4, status: 'Available', location: 'Center', x: 2, y: 4 },
        { id: 'table-7', tableNumber: 'Table 7', capacity: 2, status: 'Occupied', location: 'Window', x: 1, y: 5 },
        { id: 'table-8', tableNumber: 'Table 8', capacity: 6, status: 'Cleaning', location: 'Patio', x: 3, y: 5 },
      ] as any[];
      writeDb(data);
      console.log('✅ Seeded default tables');
    }
  }

  // ── Users ──
  async getUsers(): Promise<any[]> {
    return readDb().users;
  }
  async findUserByEmail(email: string): Promise<any> {
    return readDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }
  async findUserById(id: string): Promise<any> {
    return readDb().users.find((u) => u.id === id) ?? null;
  }
  async addUser(user: any): Promise<any> {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
    return user;
  }
  async updateUser(id: string, updates: Partial<User>): Promise<any> {
    const data = readDb();
    const idx = data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    writeDb(data);
    return data.users[idx];
  }

  // ── Foods ──
  async getFoods(): Promise<FoodItem[]> {
    return readDb().foods;
  }
  async getFoodById(id: string): Promise<FoodItem | null> {
    return readDb().foods.find((f) => f.id === id) ?? null;
  }
  async addFood(food: FoodItem): Promise<FoodItem> {
    const data = readDb();
    data.foods.push(food);
    writeDb(data);
    return food;
  }
  async updateFood(id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
    const data = readDb();
    const idx = data.foods.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    data.foods[idx] = { ...data.foods[idx], ...updates };
    writeDb(data);
    return data.foods[idx];
  }
  async deleteFood(id: string): Promise<boolean> {
    const data = readDb();
    const before = data.foods.length;
    data.foods = data.foods.filter((f) => f.id !== id);
    writeDb(data);
    return data.foods.length < before;
  }

  // ── Tables ──
  async getTables(): Promise<RestaurantTable[]> {
    return readDb().tables;
  }
  async getTableById(id: string): Promise<RestaurantTable | null> {
    return readDb().tables.find((t) => t.id === id) ?? null;
  }
  async addTable(table: RestaurantTable): Promise<RestaurantTable> {
    const data = readDb();
    data.tables.push(table);
    writeDb(data);
    return table;
  }
  async updateTable(id: string, updates: Partial<RestaurantTable>): Promise<RestaurantTable | null> {
    const data = readDb();
    const idx = data.tables.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    data.tables[idx] = { ...data.tables[idx], ...updates } as RestaurantTable;
    writeDb(data);
    return data.tables[idx];
  }

  // ── Orders ──
  async getOrders(): Promise<Order[]> {
    const data = readDb();
    return [...data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getOrderById(id: string): Promise<Order | null> {
    return readDb().orders.find((o) => o.id === id) ?? null;
  }
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return readDb()
      .orders.filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async addOrder(order: Order): Promise<Order> {
    const data = readDb();
    data.orders.push(order);
    writeDb(data);
    return order;
  }
  async updateOrderStatus(id: string, status: Order['orderStatus']): Promise<Order | null> {
    const data = readDb();
    const idx = data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    data.orders[idx] = { ...data.orders[idx], orderStatus: status };
    writeDb(data);
    return data.orders[idx];
  }

  // ── Reservations ──
  async getReservations(): Promise<Reservation[]> {
    return readDb().reservations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getReservationById(id: string): Promise<Reservation | null> {
    return readDb().reservations.find((r) => r.id === id) ?? null;
  }
  async getReservationsByUserId(userId: string): Promise<Reservation[]> {
    return readDb()
      .reservations.filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async addReservation(res: Reservation): Promise<Reservation> {
    const data = readDb();
    data.reservations.push(res);
    writeDb(data);
    return res;
  }
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const data = readDb();
    const idx = data.reservations.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    data.reservations[idx] = { ...data.reservations[idx], ...updates };
    writeDb(data);
    return data.reservations[idx];
  }

  // ── Reviews ──
  async getReviews(): Promise<Review[]> {
    return readDb().reviews;
  }
  async addReview(review: Review): Promise<Review> {
    const data = readDb();
    data.reviews.push(review);
    writeDb(data);
    return review;
  }

  // ── Carts ──
  async getUserCart(userId: string): Promise<CartItem[]> {
    const entry = readDb().carts.find((c) => c.userId === userId);
    return entry ? entry.items : [];
  }
  async saveUserCart(userId: string, items: CartItem[]): Promise<void> {
    const data = readDb();
    const idx = data.carts.findIndex((c) => c.userId === userId);
    if (idx === -1) {
      data.carts.push({ userId, items });
    } else {
      data.carts[idx].items = items;
    }
    writeDb(data);
  }
}

export const db = new Database();
