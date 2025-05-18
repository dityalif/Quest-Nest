const leaderboardRepo = require('../repositories/leaderboard.repository');

const baseResponse = (res, success, code, message, data) => {
  res.status(code).json({ success, message, data });
};

exports.getGeneralLeaderboard = async (req, res) => {
  try {
    const users = await leaderboardRepo.getTopUsers();
    const teams = await leaderboardRepo.getTopTeams();
    baseResponse(res, true, 200, "General leaderboard", { users, teams });
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getUserLeaderboard = async (req, res) => {
  try {
    const users = await leaderboardRepo.getTopUsers();
    baseResponse(res, true, 200, "User leaderboard", users);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getTeamLeaderboard = async (req, res) => {
  try {
    const teams = await leaderboardRepo.getTopTeams();
    baseResponse(res, true, 200, "Team leaderboard", teams);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getPeriodLeaderboard = async (req, res) => {
  try {
    const { period } = req.params;
    const leaderboard = await leaderboardRepo.getLeaderboard(period);
    baseResponse(res, true, 200, `Leaderboard for period: ${period}`, leaderboard);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await leaderboardRepo.getUserOrTeamById(id);
    if (!result) return baseResponse(res, false, 404, "Not found", null);
    baseResponse(res, true, 200, "Detail found", result);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.searchLeaderboard = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return baseResponse(res, false, 400, "Query parameter q is required", null);
    const result = await leaderboardRepo.searchLeaderboardByName(q);
    baseResponse(res, true, 200, "Search result", result);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};