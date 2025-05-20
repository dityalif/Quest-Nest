const db = require('../database/pg.database');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.register = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  const res = await db.query(
    "INSERT INTO users (name, username, email, password, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user.name, user.username, user.email, hashedPassword, user.avatar]
  );
  return res.rows[0];
};

exports.checkEmailExists = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows.length > 0;
};

exports.checkUsernameExists = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return res.rows.length > 0;
};

exports.login = async (email, password) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = res.rows[0];
  if (!user) return null;
  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) return null;
  return user;
};

exports.getUserByEmail = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

exports.getUserById = async (id) => {
  // First get basic user data
  const userRes = await db.query(
    'SELECT id, name, username, email, xp, level, avatar, created_at FROM users WHERE id = $1', 
    [id]
  );
  
  if (!userRes.rows[0]) return null;
  const user = userRes.rows[0];
  
  // Get completed challenges count
  const challengesRes = await db.query(
    `SELECT COUNT(*) as completed_count 
     FROM challenge_participants 
     WHERE user_id = $1 AND status = 'completed'`, 
    [id]
  );
  user.completedChallenges = parseInt(challengesRes.rows[0]?.completed_count || 0);
  
  // Get rank (position in leaderboard based on XP)
  const rankRes = await db.query(
    `SELECT COUNT(*) + 1 as rank 
     FROM users 
     WHERE xp > (SELECT xp FROM users WHERE id = $1)`, 
    [id]
  );
  user.rank = parseInt(rankRes.rows[0]?.rank || 0);
  
  // Calculate nextLevelXp based on current level (simple algorithm)
  user.nextLevelXp = user.level * 1000;
  
  return user;
};

exports.updateUser = async (user) => {
  // Ambil user lama
  const oldUser = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
  if (!oldUser.rows.length) return null;

  let query, params;
  if (user.password && user.password.length >= 6) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    query = "UPDATE users SET name = $1, email = $2, username = $3, password = $4 WHERE id = $5 RETURNING *";
    params = [user.name, user.email, user.username, hashedPassword, user.id];
  } else {
    query = "UPDATE users SET name = $1, email = $2, username = $3 WHERE id = $4 RETURNING *";
    params = [user.name, user.email, user.username, user.id];
  }
  const res = await db.query(query, params);
  return res.rows[0];
};

exports.deleteUser = async (id) => {
  const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  return res.rows[0];
};

exports.getAvatarUrl = function(user) {
  if (user?.avatar) return user.avatar;
  
  const name = user?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
};