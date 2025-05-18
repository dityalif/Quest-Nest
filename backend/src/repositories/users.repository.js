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
  const res = await db.query(
    'SELECT id, name, username, email, xp, level, avatar, created_at FROM users WHERE id = $1', 
    [id]
  );
  return res.rows[0];
};

exports.updateUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  
  const query = user.avatar 
    ? "UPDATE users SET name = $1, email = $2, password = $3, avatar = $5 WHERE id = $4 RETURNING *"
    : "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *";
  
  const params = user.avatar 
    ? [user.name, user.email, hashedPassword, user.id, user.avatar]
    : [user.name, user.email, hashedPassword, user.id];
  
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