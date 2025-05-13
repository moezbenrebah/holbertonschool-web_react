require('dotenv').config(); // load environment variables from .env file

// Log current environment variable status for debugging
console.log('Checking env vars:', {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
  secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});
// Import the Cloudinary API (v2) SDK
const cloudinary = require('cloudinary').v2;

// Check if Cloudinary config is missing
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error(' Current environment variables:', process.env); // Debug all vars
  throw new Error('Missing Cloudinary config');
}

// Configure of Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS for Cloudinary URLs
});

// Export the configured Cloudinary instance for use in other files
module.exports = cloudinary;