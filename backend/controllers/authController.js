const User = require('../models/User');
const Group = require('../models/Group');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`[AUTH] Registering user: ${username}`);
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log(`[AUTH] Registration failed: User ${username} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a default group for the user if it doesn't exist
    let group = await Group.findOne({ name: username });
    if (!group) {
      group = await Group.create({ name: username });
    }

    const user = await User.create({
      username,
      password, // Hashed automatically by User model pre-save hook
      primaryGroup: group._id
    });

    // Add user to their own group
    group.members.push(user._id);
    group.createdBy = user._id;
    await group.save();

    console.log(`[AUTH] User registered successfully: ${username}`);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      primaryGroup: user.primaryGroup,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(`[AUTH] Registration error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`[AUTH] Login attempt: ${username}`);
    const user = await User.findOne({ username });

    if (!user) {
      console.log(`[AUTH] Login failed: User ${username} not found`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log(`[AUTH] Password match for ${username}: ${isMatch}`);

    if (isMatch) {
      console.log(`[AUTH] Login success: ${username}`);
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        primaryGroup: user.primaryGroup,
        token: generateToken(user._id)
      });
    } else {
      console.log(`[AUTH] Login failed: Incorrect password for ${username}`);
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(`[AUTH] Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('primaryGroup');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
