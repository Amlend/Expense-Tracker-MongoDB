const express = require('express');
const router = express.Router();

const purchasecontrollers = require('../controllers/purchase');
const userAuthentication = require('../middleware/auth');


router.post('/purchase/updateTransaction',userAuthentication.authenticate,purchasecontrollers.premiumTransaction);

router.get('/purchase/premium',userAuthentication.authenticate,purchasecontrollers.premiumPurchase);

module.exports = router;