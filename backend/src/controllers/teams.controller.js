const teamRepo = require('../repositories/teams.repository');

const baseResponse = (res, success, code, message, data) => {
  res.status(code).json({ success, message, data });
};

exports.createTeam = async (req, res) => {
  const { name, description, creator_id } = req.body;
  if (!name || !creator_id) {
    return baseResponse(res, false, 400, "Name and creator_id are required", null);
  }
  try {
    const team = await teamRepo.createTeam({ name, description, creator_id });
    baseResponse(res, true, 201, "Team created", team);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await teamRepo.getAllTeams();
    baseResponse(res, true, 200, "All teams", teams);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.addMember = async (req, res) => {
  const { team_id, user_id, role } = req.body;
  if (!team_id || !user_id) {
    return baseResponse(res, false, 400, "team_id and user_id are required", null);
  }
  try {
    const member = await teamRepo.addMember({ team_id, user_id, role });
    baseResponse(res, true, 201, "Member added", member);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.removeMember = async (req, res) => {
  const { team_id, user_id } = req.body;
  if (!team_id || !user_id) {
    return baseResponse(res, false, 400, "team_id and user_id are required", null);
  }
  try {
    const member = await teamRepo.removeMember({ team_id, user_id });
    baseResponse(res, true, 200, "Member removed", member);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getTeamsByUser = async (req, res) => {
  try {
    const teams = await teamRepo.getTeamsByUser(req.params.user_id);
    baseResponse(res, true, 200, "User's teams", teams);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await teamRepo.getTeamById(req.params.id);
    if (!team) return baseResponse(res, false, 404, "Team not found", null);
    baseResponse(res, true, 200, "Team found", team);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.updateTeam = async (req, res) => {
  const { id, name, description } = req.body;
  if (!id || !name) {
    return baseResponse(res, false, 400, "id and name are required", null);
  }
  try {
    const team = await teamRepo.updateTeam({ id, name, description });
    baseResponse(res, true, 200, "Team updated", team);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await teamRepo.deleteTeam(req.params.id);
    if (!team) return baseResponse(res, false, 404, "Team not found", null);
    baseResponse(res, true, 200, "Team deleted", team);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};

exports.getTeamMembersStats = async (req, res) => {
  try {
    const team_id = req.params.team_id;
    const members = await teamRepo.getTeamMembersStats(team_id);
    baseResponse(res, true, 200, "Team members stats", members);
  } catch (err) {
    baseResponse(res, false, 500, err.message, null);
  }
};