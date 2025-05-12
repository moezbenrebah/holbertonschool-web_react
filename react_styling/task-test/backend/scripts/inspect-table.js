// inspect-table.js
// Script to examine the structure of the Users table

const { Sequelize } = require('sequelize');
require('dotenv').config();

async function inspectTable() {
  let sequelize;
  try {
    // Database connection
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
      }
    );

    // Test database connection
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Run a raw query to get table information
    const [results] = await sequelize.query('DESCRIBE Users');
    console.log('Table structure for Users:');
    console.table(results);
    
    // Additional check for primary key
    const [primaryKey] = await sequelize.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
      "WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Users' AND CONSTRAINT_NAME = 'PRIMARY'",
      { replacements: [process.env.DB_NAME] }
    );
    console.log('Primary Key:', primaryKey);
    
  } catch (err) {
    console.error('Error inspecting table:', err);
  } finally {
    if (sequelize) await sequelize.close();
  }
}

// Execute function
inspectTable();