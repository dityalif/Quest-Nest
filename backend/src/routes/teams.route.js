const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teams.controller');

router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.post('/add-member', teamController.addMember);
router.post('/remove-member', teamController.removeMember);
router.get('/user/:user_id', teamController.getTeamsByUser);
router.get('/:id', teamController.getTeamById);
router.put('/', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.get('/:team_id/members/stats', teamController.getTeamMembersStats);

module.exports = router;

