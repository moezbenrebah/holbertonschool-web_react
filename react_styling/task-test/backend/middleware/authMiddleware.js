const jwt = require('jsonwebtoken');
const User = require('../models/User');

//protect routes by verifying JWT & attaching user request
const authMiddleware = async (req, res, next) => {
  try {
    // get token from  Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If token is missing, deny access
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

     // Verify token + check expiry
     const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: false });
    
    // find user by id & attach to request
    const user = await User.findById(decoded.id).select('-password');
    
    // if user doesn't exist, deny access
    if (!user) {
      return res.status(401).json({ message: 'Invalid token, user not found' });
    }
    //user to request object for access in next routes
    req.user = user;
    next();
  } catch (err) {

    // handle token errors
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;