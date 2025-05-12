const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  booking_date: {
    type: DataTypes.DATEONLY, // Changed to DATEONLY for just the date part
    allowNull: false
  },
  booking_time: {
    type: DataTypes.STRING, // Changed to STRING to allow flexible time formats
    allowNull: true
  },
  participants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  special_requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contact_info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  payment_info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'confirmed' // Changed default to confirmed for better UX
  },
  approval_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  booking_reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guide_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: false // Disabled timestamps since they don't exist in the database
});

// Generate a unique booking reference before creation
Booking.beforeCreate(async (booking) => {
  // Generate a random reference code if one doesn't exist
  if (!booking.booking_reference) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const datePart = new Date().getTime().toString(36).substring(0, 4).toUpperCase();
    booking.booking_reference = `TB-${datePart}-${randomPart}`;
  }
});

module.exports = Booking;