const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Apply authMiddleware to ALL routes in this file
router.use(authMiddleware);

// POST route for creating galleries
router.post("/create", galleryController.createGallery);

// GET route for fetching all galleries
router.get("/", galleryController.getGalleries);

// GET route for fetching a single gallery by URL
router.get("/:url", galleryController.getGalleryByUrl);

// DELETE route for galleries (using _id from MongoDB)
router.delete('/:_id', galleryController.deleteGallery);

// POST route for adding photos to galleries (using gallery's URL)
router.post('/:url/add-photo', galleryController.addPhotoToGallery);

module.exports = router;