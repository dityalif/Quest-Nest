const db = require('../database/pg.database');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.checkEmailExists = async (email) => {
  const res = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
  return res.rowCount > 0;
};

exports.register = async ({ email, password, name }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const res = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );
  return res.rows[0];
};

exports.login = async (email, password) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = res.rows[0];
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return { id: user.id, name: user.name, email: user.email };
};