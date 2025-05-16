const db = require('../database/pg.database');

// Get all badges
exports.getAllBadges = async () => {
  const res = await db.query('SELECT * FROM badges ORDER BY name ASC');
  return res.rows;
};

// Get badges by user
exports.getUserBadges = async (user_id) => {
  const res = await db.query(
    `SELECT b.*, ub.earned_at, ub.progress
     FROM badges b
     LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
     ORDER BY b.name ASC`,
    [user_id]
  );
  return res.rows;
};

// Get badge detail by id
exports.getBadgeById = async (id) => {
  const res = await db.query('SELECT * FROM badges WHERE id = $1', [id]);
  return res.rows[0];
};

// Claim badge for user (manual claim, optional)
exports.claimBadge = async (user_id, badge_id) => {
  const res = await db.query(
    `INSERT INTO user_badges (user_id, badge_id, earned_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id, badge_id) DO NOTHING
     RETURNING *`,
    [user_id, badge_id]
  );
  return res.rows[0];
};