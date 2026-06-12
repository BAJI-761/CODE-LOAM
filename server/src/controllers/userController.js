const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// GET /api/v1/users/profile/:id (Public/Private)
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  
  res.json(new ApiResponse(200, user, 'User profile fetched'));
});
