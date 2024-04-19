const express = require('express');
const router = express.Router();

const premiumcontrollers = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');

router.get('/premium/leaderBoard',userAuthentication.authenticate,premiumcontrollers.premiumLeaderBoard);

module.exports = router;