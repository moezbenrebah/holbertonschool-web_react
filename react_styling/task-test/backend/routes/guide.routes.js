const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const Guide = require('../models/guide');
const User = require('../models/user');

// Get all guides - for admin dashboard
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.findAll({
      include: [{
        model: User,
        attributes: ['nom', 'prenom', 'email', 'profileImage']
      }]
    });
    
    // Parse specialites and langues JSON strings
    const formattedGuides = guides.map(guide => ({
      ...guide.toJSON(),
      specialites: JSON.parse(guide.specialites || '[]'),
      langues: JSON.parse(guide.langues || '[]')
    }));
    
    res.json(formattedGuides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ message: 'Error fetching guides', error: error.message });
  }
});

// Create guide profile
router.post('/', authenticateJWT, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Use the authenticated user directly
    const user = req.user;
    
    const guide = await Guide.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      specialites: JSON.stringify(req.body.specialites),
      langues: JSON.stringify(req.body.langues),
      price: req.body.price,
      user_id: user.user_id
    });
    
    // Set user role to guide
    user.role = 'guide';
    await user.save();
    
    console.log('Guide saved to database:', guide);
    res.status(201).json({ message: 'Guide profile created successfully', guide });
  } catch (error) {
    console.error('Error creating guide profile:', error);
    res.status(500).json({ message: 'Failed to create guide profile', error: error.message });
  }
});

// Update guide profile
router.put('/', authenticateJWT, async (req, res) => {
  try {
    // Use the authenticated user directly
    const user = req.user;
    
    // Find guide associated with this user
    const guide = await Guide.findOne({ where: { user_id: user.user_id } });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide profile not found' });
    }

    // Update fields
    const updateFields = [
      'title',
      'description',
      'location',
      'specialites',
      'langues',
      'price'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'specialites' || field === 'langues') {
          guide[field] = JSON.stringify(req.body[field]);
        } else {
          guide[field] = req.body[field];
        }
      }
    });

    await guide.save();

    res.json({
      message: 'Guide profile updated successfully',
      guide
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    res.status(500).json({ message: 'Error updating guide profile' });
  }
});

// Get guide profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    // Use the authenticated user directly
    const user = req.user;
    
    const guide = await Guide.findOne({ where: { user_id: user.user_id } });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide profile not found' });
    }

    res.json({ guide: {
      ...guide.toJSON(),
      specialites: JSON.parse(guide.specialites || '[]'),
      langues: JSON.parse(guide.langues || '[]')
    }});
  } catch (error) {
    console.error('Error retrieving guide:', error);
    res.status(500).json({ message: 'Error retrieving guide profile' });
  }
});

// Search guides by various criteria
router.get('/search', async (req, res) => {
  try {
    const {
      location,
      specialites,
      langues,
      maxPrice,
      minRating,
    } = req.query;

    // Build query
    const whereClause = { status: 'active' };

    // Location filter
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    // Price filter
    if (maxPrice) {
      whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    // Rating filter
    if (minRating) {
      whereClause.rating = { [Op.gte]: parseFloat(minRating) };
    }

    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: guides } = await Guide.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['rating', 'DESC']]
    });

    res.json({
      guides,
      page,
      totalPages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error('Error searching guides:', error);
    res.status(500).json({ message: 'Error searching guides' });
  }
});

// Get guide details by ID
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['nom', 'prenom', 'profileImage']
      }]
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.json({ guide: {
      ...guide.toJSON(),
      specialites: JSON.parse(guide.specialites || '[]'),
      langues: JSON.parse(guide.langues || '[]')
    }});
  } catch (error) {
    console.error('Error retrieving guide:', error);
    res.status(500).json({ message: 'Error retrieving guide' });
  }
});

// Delete guide by ID - for admin functionality
router.delete('/:id', async (req, res) => {
  try {
    const guideId = req.params.id;
    
    // Find the guide
    const guide = await Guide.findByPk(guideId);
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    
    // Get the user_id to update the user role
    const userId = guide.user_id;
    
    // Delete the guide
    await guide.destroy();
    
    // Update user role if needed
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        // Only change role if the user doesn't have other roles like admin
        if (user.role === 'guide') {
          user.role = 'user';
          await user.save();
        }
      }
    }
    
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ message: 'Error deleting guide', error: error.message });
  }
});

module.exports = router;
