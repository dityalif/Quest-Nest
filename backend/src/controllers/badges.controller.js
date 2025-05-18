const badgeRepo = require('../repositories/badges.repository');

const baseResponse = (res, success, code, message, data) => {
  res.status(code).json({ success, message, data });
};

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await badgeRepo.getAllBadges();
    baseResponse(res, true, 200, "All badges", badges);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getUserBadges = async (req, res) => {
  try {
    const { user_id } = req.params;
    const badges = await badgeRepo.getUserBadges(user_id);
    baseResponse(res, true, 200, "User badges", badges);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getBadgeById = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await badgeRepo.getBadgeById(id);
    if (!badge) return baseResponse(res, false, 404, "Badge not found", null);
    baseResponse(res, true, 200, "Badge found", badge);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.claimBadge = async (req, res) => {
  try {
    const { user_id, badge_id } = req.body;
    if (!user_id || !badge_id) return baseResponse(res, false, 400, "user_id and badge_id required", null);
    const result = await badgeRepo.claimBadge(user_id, badge_id);
    if (!result) return baseResponse(res, false, 400, "Badge already claimed or not found", null);
    baseResponse(res, true, 200, "Badge claimed", result);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};