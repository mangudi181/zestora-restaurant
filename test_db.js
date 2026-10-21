import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
    });
    console.log("Successfully connected to MySQL server!");
    await connection.end();
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  }
}
testConnection();
