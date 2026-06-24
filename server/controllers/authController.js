const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aktu_copilot_super_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, branch, semester } = req.body;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const userExists = mockDb.users.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now() + Math.round(Math.random() * 100),
        name,
        email,
        password: hashedPassword,
        branch,
        semester: Number(semester),
      };

      mockDb.users.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          branch: newUser.branch,
          semester: newUser.semester,
          token: generateToken(newUser._id),
        },
      });
    }

    // --- STANDARD MONGO MODE ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      branch,
      semester,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          branch: user.branch,
          semester: user.semester,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const user = mockDb.users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          branch: user.branch,
          semester: user.semester,
          token: generateToken(user._id),
        },
      });
    }

    // --- STANDARD MONGO MODE ---
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.json({
          success: true,
          data: { _id: user._id, ...userWithoutPassword },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- STANDARD MONGO MODE ---
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, branch, semester, password } = req.body;

    // --- FAILOVER MODE ---
    if (!getStatus()) {
      const userIndex = mockDb.users.findIndex(u => u._id === req.user._id);
      if (userIndex !== -1) {
        const user = mockDb.users[userIndex];
        user.name = name || user.name;
        user.branch = branch || user.branch;
        user.semester = semester ? Number(semester) : user.semester;

        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }

        mockDb.users[userIndex] = user;

        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            branch: user.branch,
            semester: user.semester,
            token: generateToken(user._id),
          },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // --- STANDARD MONGO MODE ---
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.branch = branch || user.branch;
      user.semester = semester ? Number(semester) : user.semester;

      if (password) {
        user.password = password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          branch: updatedUser.branch,
          semester: updatedUser.semester,
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
