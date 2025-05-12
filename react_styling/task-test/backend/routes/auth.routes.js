const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateJWT } = require('../middlewares/auth');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, nom, prenom, profileImage, role } = req.body;

    // Validate required fields
    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const userData = {
      email,
      password, // Will be hashed by the model hook
      nom,
      prenom,
      profileImage: profileImage || 'default-profile.png',
      role: role || 'user'
    };

    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const userResponse = {
      user_id: user.user_id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      profileImage: user.profileImage,
      role: user.role
    };

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Return user data without password
    const userData = {
      user_id: user.user_id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      profileImage: user.profileImage,
      role: user.role
    };
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: userData 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const userData = {
      user_id: req.user.user_id,
      email: req.user.email,
      nom: req.user.nom,
      prenom: req.user.prenom,
      profileImage: req.user.profileImage,
      role: req.user.role
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});

// New endpoint: Refresh expired JWT token
router.post('/refresh-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    try {
      // Verify the token regardless of expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      
      // Find the user
      const user = await User.findOne({ where: { user_id: decoded.userId } });
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Generate a new token
      const newToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      // Return user data without password
      const userData = {
        user_id: user.user_id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        profileImage: user.profileImage,
        role: user.role
      };
      
      res.json({
        message: 'Token refreshed successfully',
        token: newToken,
        user: userData
      });
    } catch (error) {
      // If there's an error other than expiration, return unauthorized
      if (error.name !== 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const user = req.user;
    
    // Update fields
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    
    // If password change is requested
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    await user.save();
    
    const userData = {
      user_id: user.user_id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      profileImage: user.profileImage,
      role: user.role
    };
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: userData 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
