const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  try {
    console.log('Registering user:', { nom, prenom, email }); // Debug log
    
    // Check if user already exists using Sequelize syntax
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Create user with Sequelize
    const newUser = await User.create({ 
      nom, 
      prenom, 
      email, 
      password, // Will be hashed by beforeCreate hook
      role: 'user'
    });

    console.log('User saved to database:', newUser.email); // Debug log

    // Generate JWT token for immediate login - UPDATED TO USE userId
    const token = jwt.sign(
      { userId: newUser.user_id }, 
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with user info (excluding password)
    const userResponse = {
      user_id: newUser.user_id,
      email: newUser.email,
      nom: newUser.nom,
      prenom: newUser.prenom,
      profileImage: newUser.profileImage,
      role: newUser.role
    };

    res.status(201).json({
      success: true, 
      message: 'Inscription réussie !',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Error during registration:', err); // Debug log with full error
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'inscription. Veuillez réessayer.' 
    });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email using Sequelize syntax
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Generate JWT token - UPDATED TO USE userId
    const token = jwt.sign(
      { userId: user.user_id }, 
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Return user info (excluding password)
    const userResponse = {
      user_id: user.user_id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      profileImage: user.profileImage,
      role: user.role
    };

    res.status(200).json({ 
      success: true,
      message: 'Connexion réussie !',
      user: userResponse,
      token 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la connexion. Veuillez réessayer.' 
    });
  }
};

// Get current user details
exports.me = async (req, res) => {
  try {
    // User ID should come from the auth middleware - use user_id not id
    const userId = req.user.user_id;
    
    console.log('Getting user details for ID:', userId);
    
    const user = await User.findByPk(userId, {
      attributes: ['user_id', 'email', 'nom', 'prenom', 'profileImage', 'role', 'createdAt']
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des informations utilisateur' 
    });
  }
};
