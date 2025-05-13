const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const cloudinary = require('./config/cloudinary');

dotenv.config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(express.json()); // understand incoming JSON requests

app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true    // Let the browser send cookies or login info

}));

// Handle file uploads
app.use(fileUpload({     
  useTempFiles: false,  // Avoid using temp files
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}));

// Database connection (Connect to MongoDB using URI from .env file)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected")) // see message on terminal
  .catch((err) => console.error(err));

// API Routes
app.use("/api/auth", require("./routes/authRoutes")); // Authentication
app.use("/api/posts", require("./routes/postRoutes")); // Post routes
app.use('/api/gallery', require('./routes/galleryRoutes')); // Gallery


// Start the server
const PORT = process.env.PORT || 5000;  // (port BE)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));