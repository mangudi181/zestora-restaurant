const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'zestora_db'
    });
    
    console.log("Connected to database...");
    
    // Reset all tables to Available
    const [result] = await connection.execute("UPDATE `RestaurantTables` SET `status` = 'Available'");
    
    console.log(`Reset ${result.affectedRows} tables to 'Available'.`);
    
    await connection.end();
  } catch (error) {
    console.error("Failed to reset tables:", error);
  }
}

resetTables();
