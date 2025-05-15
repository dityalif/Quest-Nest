const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teams.controller');

router.post('/', teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/add-member', teamController.addMember);
router.post('/remove-member', teamController.removeMember);
router.get('/user/:user_id', teamController.getTeamsByUser);
router.put('/', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;

