const challengeRepo = require('../repositories/challenges.repository');

const baseResponse = (res, success, code, message, data) => {
  res.status(code).json({ success, message, data });
};

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await challengeRepo.createChallenge(req.body);
    baseResponse(res, true, 201, "Challenge created", challenge);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await challengeRepo.getAllChallenges();
    baseResponse(res, true, 200, "All challenges", challenges);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await challengeRepo.getChallengeById(req.params.id);
    if (!challenge) return baseResponse(res, false, 404, "Challenge not found", null);
    baseResponse(res, true, 200, "Challenge found", challenge);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.updateChallenge = async (req, res) => {
  const { id, title, description } = req.body;
  if (!id || !title) {
    return baseResponse(res, false, 400, "id and title are required", null);
  }
  try {
    const challenge = await challengeRepo.updateChallenge({ id, title, description });
    baseResponse(res, true, 200, "Challenge updated", challenge);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await challengeRepo.deleteChallenge(req.params.id);
    if (!challenge) return baseResponse(res, false, 404, "Challenge not found", null);
    baseResponse(res, true, 200, "Challenge deleted", challenge);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.joinChallenge = async (req, res) => {
  const { challenge_id, user_id, team_id } = req.body;
  if (!challenge_id || (!user_id && !team_id)) {
    return baseResponse(res, false, 400, "challenge_id and user_id or team_id are required", null);
  }
  try {
    const participant = await challengeRepo.joinChallenge({ challenge_id, user_id, team_id });
    baseResponse(res, true, 201, "Joined challenge", participant);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const { challenge_id, user_id, team_id } = req.body;
    const participant = await challengeRepo.completeChallenge({ challenge_id, user_id, team_id });
    if (!participant) return baseResponse(res, false, 404, "Participation not found", null);

    // Get challenge data for XP/points
    const challenge = await challengeRepo.getChallengeById(challenge_id);
    if (!challenge) return baseResponse(res, false, 404, "Challenge not found", null);

    // Update XP for user or team
    if (user_id) {
      await challengeRepo.addXpToUser(user_id, challenge.points);
      // Check for badges (like First Blood)
      const newBadges = await badgeRepo.checkAndClaimBadges(user_id);
      participant.newBadges = newBadges;
    }
    
    if (team_id) {
      await challengeRepo.addXpToTeam(team_id, challenge.points);
    }

    baseResponse(res, true, 200, "Challenge completed", participant);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getParticipants = async (req, res) => {
  try {
    const participants = await challengeRepo.getParticipants(req.params.id);
    baseResponse(res, true, 200, "Challenge participants", participants);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getUserChallenges = async (req, res) => {
  try {
    const challenges = await challengeRepo.getUserChallenges(req.params.user_id);
    baseResponse(res, true, 200, "User's challenges", challenges);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getTeamChallenges = async (req, res) => {
  try {
    const challenges = await challengeRepo.getTeamChallenges(req.params.team_id);
    baseResponse(res, true, 200, "Team's challenges", challenges);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};