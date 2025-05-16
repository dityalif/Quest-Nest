const db = require('../database/pg.database');

async function getTopUsers(limit = 10) {
  const result = await db.query(
    'SELECT id, name, xp FROM users ORDER BY xp DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

async function getTopTeams(limit = 10) {
  const result = await db.query(
    'SELECT id, name, xp FROM teams ORDER BY xp DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

async function getLeaderboard(period = null, limit = 10) {
  let field = 'xp';
  if (period === 'weekly') field = 'xp_weekly';
  else if (period === 'monthly') field = 'xp_monthly';
  else if (period === 'daily') field = 'xp_daily';

  const result = await db.query(
    `SELECT id, name, ${field} as xp FROM users ORDER BY ${field} DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function getUserOrTeamById(id) {
  let result = await db.query('SELECT id, name, xp FROM users WHERE id = $1', [id]);
  if (result.rows.length > 0) return { type: 'user', data: result.rows[0] };

  result = await db.query('SELECT id, name, xp FROM teams WHERE id = $1', [id]);
  if (result.rows.length > 0) return { type: 'team', data: result.rows[0] };

  return null;
}

async function searchLeaderboardByName(q, limit = 10) {
  const users = await db.query(
    'SELECT id, name, xp FROM users WHERE LOWER(name) LIKE LOWER($1) ORDER BY xp DESC LIMIT $2',
    [`%${q}%`, limit]
  );
  const teams = await db.query(
    'SELECT id, name, xp FROM teams WHERE LOWER(name) LIKE LOWER($1) ORDER BY xp DESC LIMIT $2',
    [`%${q}%`, limit]
  );
  return { users: users.rows, teams: teams.rows };
}

module.exports = {
  getTopUsers,
  getTopTeams,
  getLeaderboard,
  getUserOrTeamById,
  searchLeaderboardByName,
};