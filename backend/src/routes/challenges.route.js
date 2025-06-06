const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenges.controller');

router.post('/', challengeController.createChallenge);
router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallengeById);
router.put('/', challengeController.updateChallenge);
router.delete('/:id', challengeController.deleteChallenge);

router.post('/join', challengeController.joinChallenge);
router.post('/complete', challengeController.completeChallenge);

router.get('/:id/participants', challengeController.getParticipants);

router.get('/user/:user_id', challengeController.getUserChallenges);
router.get('/team/:team_id', challengeController.getTeamChallenges);

module.exports = router;