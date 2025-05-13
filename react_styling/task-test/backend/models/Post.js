const mongoose = require("mongoose");


// Define the schema for a photo post
const postSchema = new mongoose.Schema({

  // Link to the User who created the post
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // URL of the uploaded image
  imageUrl: { type: String, required: true },

  // ID of the image in Cloudinary
  cloudinaryId: { type: String, required: true },

  // Timestamp of when the post was created
  createdAt: { type: Date, 
    default: Date.now }, // Set default to current date and time

  gallery: { type: mongoose.Schema.Types.ObjectId, // Optional link to a Gallery
    ref: 'Gallery', 
    default: null }, // Default is null if the post is not in a gallery
});


// Export the Post model based on the schema
module.exports = mongoose.model("Post", postSchema);