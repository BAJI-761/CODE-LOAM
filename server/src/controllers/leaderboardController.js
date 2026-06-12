const asyncHandler = require('../utils/asyncHandler');
const Leaderboard = require('../models/Leaderboard');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/v1/leaderboard
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const topUsers = await Leaderboard.find()
    .populate('user', 'name avatar')
    .sort({ totalPoints: -1 })
    .limit(Number(limit));

  res.json(new ApiResponse(200, topUsers, 'Leaderboard fetched'));
});

// GET /api/v1/leaderboard/me
exports.getMyRank = asyncHandler(async (req, res) => {
  const myEntry = await Leaderboard.findOne({ user: req.user._id }).populate('user', 'name avatar');
  
  if (!myEntry) {
    return res.json(new ApiResponse(200, { rank: null, entry: null }, 'Not ranked yet'));
  }

  // Calculate rank
  const higherCount = await Leaderboard.countDocuments({ totalPoints: { $gt: myEntry.totalPoints } });
  
  res.json(new ApiResponse(200, { rank: higherCount + 1, entry: myEntry }, 'My rank fetched'));
});
