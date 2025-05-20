const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badges.controller');

router.get('/', badgeController.getAllBadges);
router.get('/user/:user_id', badgeController.getUserBadges);
router.get('/:id', badgeController.getBadgeById);
router.post('/claim', badgeController.claimBadge);

module.exports = router;