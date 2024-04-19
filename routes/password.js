const express = require('express');
const router = express.Router();

const passwordcontrollers = require('../controllers/password');

router.post('/password/forgotpassword',passwordcontrollers.forgotPwdEmail);

router.get('/password/resetpassword/:uniqueId',passwordcontrollers.resetPassword);

router.get('/password/updateNewPassword/:uniqueId',passwordcontrollers.updateNewPassword);

module.exports = router;