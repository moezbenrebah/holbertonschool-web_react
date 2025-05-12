const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Initializing database connection...');
console.log(`Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => console.log(msg), // Changed to function format to fix deprecation warning
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      typeCast: function (field, next) {
        // For DateTime and Date
        if (field.type === 'DATETIME' || field.type === 'DATE') {
          return field.string();
        }
        return next();
      }
    }
  }
);

console.log('Database connection configuration complete');

module.exports = sequelize;
