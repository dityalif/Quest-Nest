const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/', leaderboardController.getGeneralLeaderboard);
router.get('/users', leaderboardController.getUserLeaderboard);
router.get('/teams', leaderboardController.getTeamLeaderboard);
router.get('/search', leaderboardController.searchLeaderboard);

router.get('/weekly', (req, res) => leaderboardController.getPeriodLeaderboard({ ...req, params: { period: 'weekly' } }, res));
router.get('/monthly', (req, res) => leaderboardController.getPeriodLeaderboard({ ...req, params: { period: 'monthly' } }, res));

router.get('/:id', leaderboardController.getById);

module.exports = router;