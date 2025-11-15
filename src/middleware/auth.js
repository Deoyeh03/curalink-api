import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Authenticate user with JWT token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided', code: 'NO_TOKEN' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid token', code: 'INVALID_TOKEN' }
    });
  }
};

// Authorize specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required', code: 'NOT_AUTHENTICATED' }
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { 
          message: `Access denied. Required role: ${roles.join(' or ')}`, 
          code: 'FORBIDDEN' 
        }
      });
    }

    next();
  };
};

// Alternative: Single role authorization (for backwards compatibility)
export const authorizeRole = (...roles) => {
  return authorizeRoles(...roles);
};

// Protect alias (if used elsewhere)
export const protect = authenticate;

// Default export
export default {
  authenticate,
  authorizeRoles,
  authorizeRole,
  protect
};