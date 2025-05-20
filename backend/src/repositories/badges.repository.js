const db = require('../database/pg.database');

// Get all badges
exports.getAllBadges = async () => {
  const res = await db.query('SELECT * FROM badges ORDER BY name ASC');
  return res.rows;
};

// Get badges by user
exports.getUserBadges = async (user_id) => {
  // Ambil semua badge
  const badgesRes = await db.query(
    `SELECT b.*, ub.earned_at
     FROM badges b
     LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
     ORDER BY b.name ASC`,
    [user_id]
  );
  const badges = badgesRes.rows;

  // Ambil data user
  const userRes = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
  const user = userRes.rows[0] || {};

  // Hitung jumlah challenge yang sudah diselesaikan user
  const completedRes = await db.query(
    `SELECT COUNT(*) as completed FROM challenge_participants WHERE user_id = $1 AND status = 'completed'`,
    [user_id]
  );
  const completedChallenges = parseInt(completedRes.rows[0]?.completed || 0);

  // Hitung progress untuk setiap badge
  const badgesWithProgress = badges.map(badge => {
    const value = Number(badge.value); 
    let progress = '';
    if (badge.type === 'xp') {
      progress = `${Math.min(user.xp || 0, value)}/${value}`;
    } else if (badge.type === 'challenge') {
      progress = `${Math.min(completedChallenges, value)}/${value}`;
    }
    return {
      ...badge,
      value, // kirim sebagai number
      progress,
      earned: !!badge.earned_at,
    };
  });

  return badgesWithProgress;
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

// Cek dan klaim badge yang memenuhi syarat untuk user
exports.checkAndClaimBadges = async (user_id) => {
  // Ambil semua badge
  const badges = await exports.getAllBadges();
  // Ambil data user
  const userRes = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
  const user = userRes.rows[0];
  if (!user) return [];

  // Ambil jumlah challenge yang sudah diselesaikan user
  const completedRes = await db.query(
    `SELECT COUNT(*) as completed FROM challenge_participants WHERE user_id = $1 AND status = 'completed'`,
    [user_id]
  );
  const completedChallenges = parseInt(completedRes.rows[0]?.completed || 0);

  // Ambil badges yang sudah diklaim user
  const userBadgesRes = await db.query(
    `SELECT badge_id FROM user_badges WHERE user_id = $1`,
    [user_id]
  );
  const claimedBadgeIds = userBadgesRes.rows.map(r => r.badge_id);

  // Check if user is a team founder
  const teamFounderRes = await db.query(
    `SELECT COUNT(*) as founder_count FROM teams WHERE creator_id = $1`,
    [user_id]
  );
  const isTeamFounder = parseInt(teamFounderRes.rows[0]?.founder_count || 0) > 0;

  const newlyClaimed = [];

  // A more comprehensive badge checking approach
  const badgeCheckers = {
    'xp': (user, badge) => user.xp >= badge.value,
    'challenge': (user, completedChallenges) => completedChallenges >= badge.value,
    'team_founder': (user, _, isTeamFounder) => isTeamFounder,
    // Add more badge types as needed
  };

  for (const badge of badges) {
    // Contoh rule: badge.type = 'xp', badge.value = 1000, badge.type = 'challenge', badge.value = 10
    let eligible = false;
    if (badgeCheckers[badge.type] && 
        badgeCheckers[badge.type](user, completedChallenges, isTeamFounder)) {
      eligible = true;
    }

    if (eligible && !claimedBadgeIds.includes(badge.id)) {
      // Klaim badge
      await exports.claimBadge(user_id, badge.id);
      newlyClaimed.push(badge);
    }
  }
  return newlyClaimed;
};

exports.getTeamMembers = async (team_id) => {
  const res = await db.query(
    `SELECT u.* FROM users u
     JOIN team_members tm ON tm.user_id = u.id
     WHERE tm.team_id = $1`,
    [team_id]
  );
  return res.rows;
};