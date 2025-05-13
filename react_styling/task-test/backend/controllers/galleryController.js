const Gallery = require('../models/Gallery');

// create new gallery
exports.createGallery = async (req, res) => {
  try {
    const { title, description, url } = req.body;

    // validate required fields
    if (!title || !description || !url) {
      return res.status(400).json({ message: "Title, description, and URL are required" });
    }

 // check if a gallery with the same URL already exists
    const existingGallery = await Gallery.findOne({ url });
    if (existingGallery) {
      return res.status(400).json({ message: "Gallery URL already exists" });
    }

    // create and save the new gallery
    const gallery = await Gallery.create({ 
      title, 
      description, 
      url, 
      user: req.user.id 
    });
    
    res.status(201).json(gallery);
  } catch (error) {
    console.error("Create gallery error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// fetch all galleries for current user
exports.getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ user: req.user.id })
      .populate('user', 'username email profilePic') // // user info
      .populate('photos'); // associated photos
    
    res.status(200).json(galleries);
  } catch (error) {
    console.error("Failed to fetch galleries:", error.message);
    res.status(500).json({ message: "Failed to fetch galleries" });
  }
};

// fetch single gallery by URL for current user 
exports.getGalleryByUrl = async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ 
      url: req.params.url,
      user: req.user.id // security(ensure user only accesses their own gallery)
    }).populate('photos');
    
    if (!gallery) {
      console.log(`Gallery not found: ${req.params.url}`);
      return res.status(404).json({ message: "Gallery not found" });
    }
    
    res.status(200).json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete gallery by its id
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findOneAndDelete({ 
      _id: req.params._id, 
      user: req.user.id // // Ensure only the owner can delete
    });
   
    if (!gallery) {
      console.log(`Delete failed - Gallery not found: ${req.params._id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Gallery not found or unauthorized" 
      });
    }
    
    console.log(`Gallery deleted: ${gallery._id}`);
    res.status(200).json({ 
      success: true, 
      message: "Gallery deleted successfully" 
    });
  } catch (error) {
    console.error("Delete gallery error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Deletion failed" 
    });
  }
};

// add a photo to a gallery by gallery URL
exports.addPhotoToGallery = async (req, res) => {
  try {
    const { photoId } = req.body;
    const gallery = await Gallery.findOne({ 
      url: req.params.url, 
      user: req.user.id 
    });
// find the gallery by URL
    if (!gallery) {
      console.log(`Gallery not found: ${req.params.url}`);
      return res.status(404).json({ message: "Gallery not found" });
    }
    
// Add photo if it's not already in the gallery
    if (!gallery.photos.includes(photoId)) {
      gallery.photos.push(photoId);
      await gallery.save();
      console.log(`Photo ${photoId} added to gallery ${gallery._id}`);
    }

    res.status(200).json({ success: true, gallery });
  } catch (error) {
    console.error('Add photo error:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};