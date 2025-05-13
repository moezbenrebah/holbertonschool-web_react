const Post = require("../models/Post");
const uploadToCloudinary = require("../utils/Upload");
const cloudinary = require('../config/cloudinary');

// create a new photo post
exports.createPost = async (req, res) => {
  try {

    // check if image is uploaded
    if (!req.files?.image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Ensure user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.files.image.data);
    
    // save post in database
    const post = await Post.create({
      user: req.user.id,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("❌ createPost error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// get all post from current user
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// delete photo and its image from Cloudinary

exports.deletePost = async (req, res) => {
  try {
    // Find post and ensure its belongs to the user
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: "Post not found or unauthorized" 
      });
    }

    // Delete image from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(post.cloudinaryId, {
      resource_type: 'image'
    });

    if (cloudinaryResult.result === 'not found') {
      console.warn(`Cloudinary image not found: ${post.cloudinaryId}`);
    }

    res.status(200).json({ 
      success: true,
      message: "Photo deleted successfully"
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      success: false, 
      message: "Deletion failed"
    });
  }
};