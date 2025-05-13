const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// POST route for creating new posts
router.post("/", authMiddleware, postController.createPost);

// GET route for fetching posts
router.get("/", authMiddleware, postController.getPosts);

// route to delete photo by ID
router.delete('/:id', authMiddleware, postController.deletePost);

// router to be used in the main app
module.exports = router;