const db = require('../database/pg.database');

// Create Challenge
exports.createChallenge = async ({
  title, description, category, difficulty, points, type, deadline, creator_id
}) => {
  const res = await db.query(
    `INSERT INTO challenges (title, description, category, difficulty, points, type, deadline, creator_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, description, category, difficulty, points, type, deadline, creator_id]
  );
  return res.rows[0];
};

// Get All Challenges
exports.getAllChallenges = async () => {
  const res = await db.query(`SELECT * FROM challenges ORDER BY created_at DESC`);
  return res.rows;
};

// Get Challenge by ID
exports.getChallengeById = async (challenge_id) => {
  const res = await db.query(`SELECT * FROM challenges WHERE id = $1`, [challenge_id]);
  return res.rows[0];
};

// Update Challenge
exports.updateChallenge = async ({ id, title, description }) => {
  const res = await db.query(
    `UPDATE challenges SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
    [title, description, id]
  );
  return res.rows[0];
};

// Delete Challenge
exports.deleteChallenge = async (challenge_id) => {
  const res = await db.query(`DELETE FROM challenges WHERE id = $1 RETURNING *`, [challenge_id]);
  return res.rows[0];
};

// Join Challenge
exports.joinChallenge = async ({ challenge_id, user_id = null, team_id = null }) => {
  const res = await db.query(
    `INSERT INTO challenge_participants (challenge_id, user_id, team_id, status)
     VALUES ($1, $2, $3, 'ongoing') RETURNING *`,
    [challenge_id, user_id, team_id]
  );
  return res.rows[0];
};

// Complete Challenge
exports.completeChallenge = async ({ challenge_id, user_id = null, team_id = null }) => {
  const res = await db.query(
    `UPDATE challenge_participants
     SET status = 'completed', completed_at = NOW()
     WHERE challenge_id = $1 AND user_id IS NOT DISTINCT FROM $2 AND team_id IS NOT DISTINCT FROM $3
     RETURNING *`,
    [challenge_id, user_id, team_id]
  );
  return res.rows[0];
};

// Get Participants
exports.getParticipants = async (challenge_id) => {
  const res = await db.query(
    `SELECT * FROM challenge_participants WHERE challenge_id = $1`,
    [challenge_id]
  );
  return res.rows;
};

// Get User Challenges
exports.getUserChallenges = async (user_id) => {
  const res = await db.query(
    `SELECT c.*, cp.status, cp.completed_at FROM challenges c
     JOIN challenge_participants cp ON c.id = cp.challenge_id
     WHERE cp.user_id = $1`,
    [user_id]
  );
  return res.rows;
};

// Get Team Challenges
exports.getTeamChallenges = async (team_id) => {
  const res = await db.query(
    `SELECT c.*, cp.status, cp.completed_at FROM challenges c
     JOIN challenge_participants cp ON c.id = cp.challenge_id
     WHERE cp.team_id = $1`,
    [team_id]
  );
  return res.rows;
};
