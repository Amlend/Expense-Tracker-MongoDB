const express = require('express');
const router = express.Router();

const usercontrollers = require('../controllers/user');
const userAuthentication = require('../middleware/auth');


router.post('/user/signup',usercontrollers.postUserSignin);

router.post('/user/login',usercontrollers.postUserLogin);

router.get('/user/userbytoken',userAuthentication.authenticate,usercontrollers.getUserByToken);

module.exports = router;