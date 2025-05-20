const db = require('../database/pg.database');

// Create team
exports.createTeam = async ({ name, description, creator_id }) => {
  const res = await db.query(
    `INSERT INTO teams (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *`,
    [name, description, creator_id]
  );
  return res.rows[0];
};

// Get all teams
exports.getAllTeams = async () => {
  const res = await db.query(`SELECT * FROM teams ORDER BY created_at DESC`);
  return res.rows;
};

// Add member to team
exports.addMember = async ({ team_id, user_id, role = 'member' }) => {
  const res = await db.query(
    `INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3) RETURNING *`,
    [team_id, user_id, role]
  );
  return res.rows[0];
};

// Remove member from team
exports.removeMember = async ({ team_id, user_id }) => {
  const res = await db.query(
    `DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 RETURNING *`,
    [team_id, user_id]
  );
  return res.rows[0];
};

// Get teams by user
exports.getTeamsByUser = async (user_id) => {
  const res = await db.query(
    `SELECT t.* FROM teams t
     JOIN team_members tm ON t.id = tm.team_id
     WHERE tm.user_id = $1`,
    [user_id]
  );
  return res.rows;
};

// Get team by ID 
exports.getTeamById = async (team_id) => {
  const teamRes = await db.query(`SELECT * FROM teams WHERE id = $1`, [team_id]);
  if (teamRes.rows.length === 0) return null;
  const membersRes = await db.query(
    `SELECT u.id, u.name, u.email, tm.role, tm.joined_at
     FROM team_members tm
     JOIN users u ON tm.user_id = u.id
     WHERE tm.team_id = $1`,
    [team_id]
  );
  return { ...teamRes.rows[0], members: membersRes.rows };
};

exports.getTeamMembersStats = async (team_id) => {
  const res = await db.query(
    `SELECT 
        u.id, u.name, u.username, u.xp,
        COUNT(cp.id) FILTER (WHERE cp.status = 'completed') AS "completedChallenges"
     FROM team_members tm
     JOIN users u ON tm.user_id = u.id
     LEFT JOIN challenge_participants cp ON cp.user_id = u.id AND cp.status = 'completed'
     WHERE tm.team_id = $1
     GROUP BY u.id
     ORDER BY u.xp DESC`,
    [team_id]
  );
  return res.rows;
};

// Update team info
exports.updateTeam = async ({ id, name, description }) => {
  const res = await db.query(
    `UPDATE teams SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id]
  );
  return res.rows[0];
};

// Delete team
exports.deleteTeam = async (id) => {
  const res = await db.query(
    `DELETE FROM teams WHERE id = $1 RETURNING *`,
    [id]
  );
  return res.rows[0];
};