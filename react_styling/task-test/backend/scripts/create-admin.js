// create-admin.js
// Script to create an admin user in the database

const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// Admin user details
const adminUser = {
  prenom: 'Admin',
  nom: 'User',
  email: 'admin@travelbuddy.com',
  password: 'Admin123!',
  role: 'admin'
};

async function createAdmin() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Import the main User model (not the duplicate .model.js version)
    const User = require('../models/user');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: adminUser.email } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await sequelize.close();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create new admin user
    const newAdmin = await User.create({
      prenom: adminUser.prenom,
      nom: adminUser.nom,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role
    });

    console.log('Admin user created successfully with user_id:', newAdmin.user_id);
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await sequelize.close();
  }
}

// Execute function
createAdmin();