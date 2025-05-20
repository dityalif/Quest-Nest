const badgeRepo = require('../repositories/badges.repository');
const challengeRepo = require('../repositories/challenges.repository');
const teamRepo = require('../repositories/teams.repository');

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

exports.completeChallenge = async (req, res) => {
  try {
    const { challenge_id, user_id, team_id } = req.body;
    const participant = await challengeRepo.completeChallenge({ challenge_id, user_id, team_id });
    if (!participant) return baseResponse(res, false, 404, "Participation not found", null);

    // Ambil data challenge untuk mendapatkan nilai XP/points
    const challenge = await challengeRepo.getChallengeById(challenge_id);
    if (!challenge) return baseResponse(res, false, 404, "Challenge not found", null);

    // Update XP user atau tim
    if (user_id) {
      await challengeRepo.addXpToUser(user_id, challenge.points);
      await badgeRepo.checkAndClaimBadges(user_id);
    }
    if (team_id) {
      await challengeRepo.addXpToTeam(team_id, challenge.points);
    }

    baseResponse(res, true, 200, "Challenge completed", participant);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getUserTeams = async (req, res) => {
  try {
    const teams = await teamRepo.getUserTeams(req.params.user_id);
    // Untuk setiap tim, ambil jumlah member dan total XP
    const teamsWithStats = await Promise.all(teams.map(async (team) => {
      // Ambil anggota tim
      const members = await teamRepo.getTeamMembers(team.id);
      // Hitung total XP anggota
      const totalXp = members.reduce((sum, member) => sum + (member.xp || 0), 0);
      return {
        ...team,
        member_count: members.length,
        xp: totalXp,
        members, // jika ingin tampilkan avatar anggota
      };
    }));
    baseResponse(res, true, 200, "User's teams", teamsWithStats);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};