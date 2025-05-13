const mongoose = require('mongoose');

// Define the schema for the Gallery model
const gallerySchema = new mongoose.Schema({
  title: {
  type: String, // Title of the gallery
    required: true, // Title is required
  },
  description: {
    type: String, // Description of the gallery
    required: true,
  },
  url: {
    type: String, // URL for the gallery
    required: true, // URL is required
    unique: true, // // URL should be unique for each gallery
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // Reference to the User model to associate a gallery with a user
    required: true // User is required to associate with the gallery
  },
  photos: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Post model (photos)
    ref: 'Post', // Link each photo to a Post
  }],
  
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt fields

// Create and export the Gallery model based on the schema
module.exports = mongoose.model('Gallery', gallerySchema);