const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password and role are required' });
  }
  if (!['buyer', 'supplier'].includes(role)) {
    return res.status(400).json({ message: 'Role must be buyer or supplier' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role, phone });
  const token = generateToken(user._id, user.role);

  res.status(201).json({ user: user.toSafeObject(), token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);
  res.json({ user: user.toSafeObject(), token });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  await user.save();
  res.json({ user: user.toSafeObject() });
});

module.exports = { register, login, getMe, updateMe };
