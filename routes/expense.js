const express = require('express');
const router = express.Router();

const expensecontrollers = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');



router.post('/expense/expenses',userAuthentication.authenticate,expensecontrollers.postAddExpense);

router.get('/expense/expenses',userAuthentication.authenticate,expensecontrollers.getAllExpense);

router.get('/expense/downloadfile',userAuthentication.authenticate,expensecontrollers.downloadFile);

router.get('/expense/filehistory',userAuthentication.authenticate,expensecontrollers.fileHistory);

router.delete('/expense/:expenseId',userAuthentication.authenticate,expensecontrollers.deleteExpenseById);


module.exports = router;