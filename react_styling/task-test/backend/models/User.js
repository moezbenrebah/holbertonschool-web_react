const mongoose = require("mongoose");

// Define the schema for a User
const userSchema = new mongoose.Schema({

  username: { type: String, // Unique username
    required: true, 
    unique: true },

  email: { type: String, // Unique email address
    required: true, 
    unique: true },

  password: { type: String, // Hashed password
    required: true },

  profilePic: { type: String, // URL for user's profile picture
    default: "" }, //defaults to empty string

  isVerified: { type: Boolean, // Whether the user's email is verified
    default: false },

  verificationToken: { type: String }, // Token sent via email for verification
  
  verificationTokenExpires: { type: 
    Date }, // Expiry time for the verification token

  resetPasswordToken: { type: String}, // Token sent to reset password

  resetPasswordExpires: { type: Date}}, // Expiry time for the reset token
  {
    timestamps: true  // Automatically add createdAt and updatedAt fields

});


// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);