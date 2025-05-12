const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with extensive debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('Token decoded successfully:', JSON.stringify(decoded));
    
    if (!decoded || typeof decoded.userId === 'undefined') {
      console.error('Decoded token missing userId field:', decoded);
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    // Find the user using the userId from the token
    console.log('Looking for user with ID:', decoded.userId);
    const user = await User.findOne({ 
      where: { 
        user_id: decoded.userId 
      }
    });
    
    if (!user) {
      console.error('No user found with ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('User authenticated successfully:', user.email);
    
    // Attach user to request object with DataValues to ensure all properties are accessible
    req.user = user.toJSON ? user.toJSON() : user;
    next();
  } catch (error) {
    console.error('Authentication error details:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

exports.isGuide = (req, res, next) => {
  if (!req.user || req.user.role !== 'guide') {
    return res.status(403).json({ message: 'Access denied: Guide privileges required' });
  }
  next();
};
