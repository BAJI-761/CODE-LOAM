const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { registerSchema, loginSchema } = require('../validators/auth.validation');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(new ApiError(400, validationResult.error.errors[0].message));
  }

  const { name, email, password, role } = validationResult.data;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, 'User already exists'));
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'User registered successfully')
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(new ApiError(400, validationResult.error.errors[0].message));
  }

  const { email, password } = validationResult.data;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'User logged in successfully')
  );
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, 'User data retrieved'));
});

// @desc    Update profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar) user.avatar = avatar;

  await user.save();
  res.json(new ApiResponse(200, { user }, 'Profile updated'));
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new ApiError(400, 'Current and new passwords are required'));
  }
  if (newPassword.length < 6) {
    return next(new ApiError(400, 'New password must be at least 6 characters'));
  }

  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ApiError(401, 'Current password is incorrect'));
  }

  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, {}, 'Password changed successfully'));
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'User logged out'));
});

module.exports = { register, login, getMe, updateProfile, changePassword, logout };
