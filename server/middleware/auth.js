const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aktu_copilot_super_secret_key');

      if (getStatus()) {
        // Find user in MongoDB
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Find user in-memory
        const found = mockDb.users.find(u => u._id === decoded.id);
        if (found) {
          // Remove password field
          const { password, ...userWithoutPassword } = found;
          req.user = { _id: found._id, ...userWithoutPassword };
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
