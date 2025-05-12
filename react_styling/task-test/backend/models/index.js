const sequelize = require('../config/database');
const User = require('./user');
const Guide = require('./guide');
const Tour = require('./tour');
const Booking = require('./booking');
// const Review = require('./review'); // Commented out as the file is missing

// Define relationships
Guide.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' }); // A guide belongs to a user
User.hasOne(Guide, { foreignKey: 'user_id' }); // A user can be a guide

Tour.belongsTo(Guide, { foreignKey: 'guide_id', onDelete: 'CASCADE' }); // A tour belongs to a guide
Guide.hasMany(Tour, { foreignKey: 'guide_id' }); // A guide can have many tours

// Changed the alias from 'Client' to 'TourClient' to avoid duplicate alias error
Tour.belongsTo(User, { foreignKey: 'client_id', as: 'TourClient', onDelete: 'SET NULL' }); // A tour can be booked by a client (user)
User.hasMany(Tour, { foreignKey: 'client_id', as: 'ClientTours' }); // A user can book many tours

Booking.belongsTo(Tour, { foreignKey: 'tour_id', onDelete: 'CASCADE' }); // A booking belongs to a tour
Tour.hasMany(Booking, { foreignKey: 'tour_id' }); // A tour can have many bookings

Booking.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' }); // A booking belongs to a user
User.hasMany(Booking, { foreignKey: 'user_id' }); // A user can have many bookings

// Review.belongsTo(Tour, { foreignKey: 'tour_id', onDelete: 'CASCADE' }); // Commented out
// Review.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' }); // Commented out

// Remove the automatic sync from here as it's being done in server.js
// This prevents duplicate syncing attempts

module.exports = { sequelize, User, Guide, Tour, Booking /*, Review */ }; // Commented out Review export
