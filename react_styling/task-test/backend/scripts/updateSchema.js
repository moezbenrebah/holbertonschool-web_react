// updateSchema.js
// Script to update database schema with new fields

const { Sequelize } = require('sequelize');
require('dotenv').config();

async function updateSchema() {
  try {
    // Database connection
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log
      }
    );

    // Test database connection
    await sequelize.authenticate();
    console.log('Connected to database');

    // Load models
    const User = require('../models/user');
    
    // Sync the model with the database - this will add the new fields
    await sequelize.sync({ alter: true });
    console.log('Database schema updated successfully');
  } catch (err) {
    console.error('Error updating database schema:', err);
  }
}

// Execute function
updateSchema();