import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  FoodItem,
  User,
  Order,
  Reservation,
  RestaurantTable,
  Review,
  CartItem
} from '../src/types';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'zestora_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class Database {
  async init() {
    // We connect without database selected first to create it if not exists
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE || 'zestora_db'}\``);
    await connection.end();

    // Now create tables
    await this.createTables();
    await this.seedData();
  }

  private async createTables() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(255),
        role VARCHAR(50),
        address JSON,
        createdAt VARCHAR(255),
        passwordHash VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Foods (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        price FLOAT,
        category VARCHAR(255),
        image VARCHAR(255),
        rating FLOAT,
        reviewCount INT,
        isVegetarian BOOLEAN,
        isAvailable BOOLEAN,
        isPopular BOOLEAN,
        isSpecialToday BOOLEAN,
        ingredients JSON,
        customizations JSON,
        preparationTime VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS RestaurantTables (
        id VARCHAR(255) PRIMARY KEY,
        tableNumber VARCHAR(255),
        capacity INT,
        status VARCHAR(50),
        location VARCHAR(100),
        x INT,
        y INT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Orders (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255),
        customerName VARCHAR(255),
        customerPhone VARCHAR(255),
        customerEmail VARCHAR(255),
        items JSON,
        orderType VARCHAR(100),
        tableId VARCHAR(255),
        tableNumber VARCHAR(255),
        deliveryAddress JSON,
        subtotal FLOAT,
        tax FLOAT,
        serviceCharge FLOAT,
        discount FLOAT,
        total FLOAT,
        paymentMethod VARCHAR(100),
        paymentStatus VARCHAR(100),
        orderStatus VARCHAR(100),
        reservationId VARCHAR(255),
        createdAt VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Reservations (
        id VARCHAR(255) PRIMARY KEY,
        reservationId VARCHAR(255),
        userId VARCHAR(255),
        customerName VARCHAR(255),
        customerEmail VARCHAR(255),
        customerPhone VARCHAR(255),
        tableId VARCHAR(255),
        tableNumber VARCHAR(255),
        date VARCHAR(255),
        time VARCHAR(255),
        guests INT,
        specialRequest TEXT,
        foodOrderId VARCHAR(255),
        preOrderItems JSON,
        status VARCHAR(100),
        createdAt VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Reviews (
        id VARCHAR(255) PRIMARY KEY,
        userName VARCHAR(255),
        userAvatar VARCHAR(255),
        rating FLOAT,
        comment TEXT,
        dishName VARCHAR(255),
        date VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Carts (
        userId VARCHAR(255) PRIMARY KEY,
        items JSON
      )
    `);
  }

  private async seedData() {
    const [userRows]: any = await pool.query('SELECT COUNT(*) as count FROM Users');
    if (userRows[0].count === 0) {
      const adminPasswordHash = bcrypt.hashSync('admin123', 10);
      const userPasswordHash = bcrypt.hashSync('password123', 10);
      await pool.query('INSERT INTO Users (id, name, email, phone, role, address, createdAt, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        ['user-admin', 'Zestora Master Admin', 'admin@zestora.com', '+91 98765 43210', 'admin', null, new Date().toISOString(), adminPasswordHash]
      );
      await pool.query('INSERT INTO Users (id, name, email, phone, role, address, createdAt, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        ['user-demo', 'Rahul Sen', 'rahul@example.com', '+91 98123 45678', 'user', JSON.stringify({ houseNumber: 'Flat 402, Green Glen', street: '100ft Road, Indiranagar', city: 'Bengaluru', pincode: '560038', landmark: 'Near Metro Station' }), new Date().toISOString(), userPasswordHash]
      );
    }

    const [tableRows]: any = await pool.query('SELECT COUNT(*) as count FROM RestaurantTables');
    if (tableRows[0].count === 0) {
      const initialTables = [
        { id: 'table-1', tableNumber: 'Table 1', capacity: 2, status: 'Available', location: 'Window', x: 1, y: 1 },
        { id: 'table-2', tableNumber: 'Table 2', capacity: 4, status: 'Available', location: 'Window', x: 3, y: 1 },
        { id: 'table-3', tableNumber: 'Table 3', capacity: 4, status: 'Reserved', location: 'Center', x: 2, y: 2 },
        { id: 'table-4', tableNumber: 'Table 4', capacity: 6, status: 'Available', location: 'Booth', x: 1, y: 3 },
        { id: 'table-5', tableNumber: 'Table 5', capacity: 8, status: 'Available', location: 'Patio', x: 3, y: 3 },
        { id: 'table-6', tableNumber: 'Table 6', capacity: 4, status: 'Available', location: 'Center', x: 2, y: 4 },
        { id: 'table-7', tableNumber: 'Table 7', capacity: 2, status: 'Occupied', location: 'Window', x: 1, y: 5 },
        { id: 'table-8', tableNumber: 'Table 8', capacity: 6, status: 'Cleaning', location: 'Patio', x: 3, y: 5 }
      ];
      for (const t of initialTables) {
        await pool.query('INSERT INTO RestaurantTables (id, tableNumber, capacity, status, location, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [t.id, t.tableNumber, t.capacity, t.status, t.location, t.x, t.y]
        );
      }
    }
  }

  // Users
  async getUsers(): Promise<any[]> {
    const [rows] = await pool.query('SELECT * FROM Users');
    return rows as any[];
  }
  async findUserByEmail(email: string): Promise<any> {
    const [rows]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email.toLowerCase()]);
    return rows[0] || null;
  }
  async findUserById(id: string): Promise<any> {
    const [rows]: any = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    return rows[0] || null;
  }
  async addUser(user: any): Promise<any> {
    await pool.query('INSERT INTO Users (id, name, email, phone, role, address, createdAt, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [user.id, user.name, user.email, user.phone, user.role, JSON.stringify(user.address), user.createdAt, user.passwordHash]
    );
    return user;
  }
  async updateUser(id: string, updates: Partial<User>): Promise<any> {
    const user = await this.findUserById(id);
    if (!user) return null;
    const merged = { ...user, ...updates };
    await pool.query('UPDATE Users SET name = ?, phone = ?, address = ?, role = ? WHERE id = ?', 
      [merged.name, merged.phone, JSON.stringify(merged.address), merged.role, id]
    );
    return merged;
  }

  // Foods
  async getFoods(): Promise<FoodItem[]> {
    const [rows]: any = await pool.query('SELECT * FROM Foods');
    return rows.map((r: any) => ({
      ...r,
      isVegetarian: Boolean(r.isVegetarian),
      isAvailable: Boolean(r.isAvailable),
      isPopular: Boolean(r.isPopular),
      isSpecialToday: Boolean(r.isSpecialToday),
    })) as FoodItem[];
  }
  async getFoodById(id: string): Promise<FoodItem | null> {
    const [rows]: any = await pool.query('SELECT * FROM Foods WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return {
      ...rows[0],
      isVegetarian: Boolean(rows[0].isVegetarian),
      isAvailable: Boolean(rows[0].isAvailable),
      isPopular: Boolean(rows[0].isPopular),
      isSpecialToday: Boolean(rows[0].isSpecialToday),
    } as FoodItem;
  }
  async addFood(food: FoodItem): Promise<FoodItem> {
    await pool.query('INSERT INTO Foods (id, name, description, price, category, image, rating, reviewCount, isVegetarian, isAvailable, isPopular, isSpecialToday, ingredients, customizations, preparationTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [food.id, food.name, food.description, food.price, food.category, food.image, food.rating, food.reviewCount, food.isVegetarian, food.isAvailable, food.isPopular, food.isSpecialToday, JSON.stringify(food.ingredients), JSON.stringify(food.customizations), food.preparationTime]
    );
    return food;
  }
  async updateFood(id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
    const food = await this.getFoodById(id);
    if (!food) return null;
    const merged = { ...food, ...updates };
    await pool.query('UPDATE Foods SET name=?, description=?, price=?, category=?, image=?, rating=?, reviewCount=?, isVegetarian=?, isAvailable=?, isPopular=?, isSpecialToday=?, ingredients=?, customizations=?, preparationTime=? WHERE id=?',
      [merged.name, merged.description, merged.price, merged.category, merged.image, merged.rating, merged.reviewCount, merged.isVegetarian, merged.isAvailable, merged.isPopular, merged.isSpecialToday, JSON.stringify(merged.ingredients), JSON.stringify(merged.customizations), merged.preparationTime, id]
    );
    return merged;
  }
  async deleteFood(id: string): Promise<boolean> {
    const [result]: any = await pool.query('DELETE FROM Foods WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Tables
  async getTables(): Promise<RestaurantTable[]> {
    const [rows] = await pool.query('SELECT * FROM RestaurantTables');
    return rows as RestaurantTable[];
  }
  async getTableById(id: string): Promise<RestaurantTable | null> {
    const [rows]: any = await pool.query('SELECT * FROM RestaurantTables WHERE id = ?', [id]);
    return rows[0] || null;
  }
  async addTable(table: RestaurantTable): Promise<RestaurantTable> {
    await pool.query('INSERT INTO RestaurantTables (id, tableNumber, capacity, status, location, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [table.id, table.tableNumber, table.capacity, table.status, table.location, table.x, table.y]
    );
    return table;
  }
  async updateTable(id: string, updates: Partial<RestaurantTable>): Promise<RestaurantTable | null> {
    const table = await this.getTableById(id);
    if (!table) return null;
    const merged = { ...table, ...updates };
    await pool.query('UPDATE RestaurantTables SET tableNumber=?, capacity=?, status=?, location=?, x=?, y=? WHERE id=?',
      [merged.tableNumber, merged.capacity, merged.status, merged.location, merged.x, merged.y, id]
    );
    return merged;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const [rows]: any = await pool.query('SELECT * FROM Orders ORDER BY createdAt DESC');
    return rows;
  }
  async getOrderById(id: string): Promise<Order | null> {
    const [rows]: any = await pool.query('SELECT * FROM Orders WHERE id = ?', [id]);
    return rows[0] || null;
  }
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const [rows]: any = await pool.query('SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows;
  }
  async addOrder(order: Order): Promise<Order> {
    await pool.query('INSERT INTO Orders (id, userId, customerName, customerPhone, customerEmail, items, orderType, tableId, tableNumber, deliveryAddress, subtotal, tax, serviceCharge, discount, total, paymentMethod, paymentStatus, orderStatus, reservationId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [order.id, order.userId, order.customerName, order.customerPhone, order.customerEmail, JSON.stringify(order.items), order.orderType, order.tableId, order.tableNumber, JSON.stringify(order.deliveryAddress), order.subtotal, order.tax, order.serviceCharge, order.discount, order.total, order.paymentMethod, order.paymentStatus, order.orderStatus, order.reservationId, order.createdAt]
    );
    return order;
  }
  async updateOrderStatus(id: string, status: Order['orderStatus']): Promise<Order | null> {
    const [result]: any = await pool.query('UPDATE Orders SET orderStatus = ? WHERE id = ?', [status, id]);
    if (result.affectedRows > 0) {
      return this.getOrderById(id);
    }
    return null;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    const [rows]: any = await pool.query('SELECT * FROM Reservations ORDER BY createdAt DESC');
    return rows;
  }
  async getReservationById(id: string): Promise<Reservation | null> {
    const [rows]: any = await pool.query('SELECT * FROM Reservations WHERE id = ?', [id]);
    return rows[0] || null;
  }
  async getReservationsByUserId(userId: string): Promise<Reservation[]> {
    const [rows]: any = await pool.query('SELECT * FROM Reservations WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows;
  }
  async addReservation(res: Reservation): Promise<Reservation> {
    await pool.query('INSERT INTO Reservations (id, reservationId, userId, customerName, customerEmail, customerPhone, tableId, tableNumber, date, time, guests, specialRequest, foodOrderId, preOrderItems, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [res.id, res.reservationId, res.userId, res.customerName, res.customerEmail, res.customerPhone, res.tableId, res.tableNumber, res.date, res.time, res.guests, res.specialRequest, res.foodOrderId, JSON.stringify(res.preOrderItems), res.status, res.createdAt]
    );
    return res;
  }
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const r = await this.getReservationById(id);
    if (!r) return null;
    const merged = { ...r, ...updates };
    await pool.query('UPDATE Reservations SET customerName=?, customerEmail=?, customerPhone=?, tableId=?, tableNumber=?, date=?, time=?, guests=?, specialRequest=?, foodOrderId=?, preOrderItems=?, status=? WHERE id=?',
      [merged.customerName, merged.customerEmail, merged.customerPhone, merged.tableId, merged.tableNumber, merged.date, merged.time, merged.guests, merged.specialRequest, merged.foodOrderId, JSON.stringify(merged.preOrderItems), merged.status, id]
    );
    return merged;
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    const [rows]: any = await pool.query('SELECT * FROM Reviews');
    return rows;
  }
  async addReview(review: Review): Promise<Review> {
    await pool.query('INSERT INTO Reviews (id, userName, userAvatar, rating, comment, dishName, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [review.id, review.userName, review.userAvatar, review.rating, review.comment, review.dishName, review.date]
    );
    return review;
  }

  // Carts
  async getUserCart(userId: string): Promise<CartItem[]> {
    const [rows]: any = await pool.query('SELECT items FROM Carts WHERE userId = ?', [userId]);
    if (rows[0] && rows[0].items) {
      return typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : rows[0].items;
    }
    return [];
  }
  async saveUserCart(userId: string, items: CartItem[]): Promise<void> {
    await pool.query('INSERT INTO Carts (userId, items) VALUES (?, ?) ON DUPLICATE KEY UPDATE items = ?',
      [userId, JSON.stringify(items), JSON.stringify(items)]
    );
  }
}

export const db = new Database();
