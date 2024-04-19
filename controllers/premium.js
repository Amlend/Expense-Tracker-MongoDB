
const User = require('../models/Users');


const premiumLeaderBoard = async (req, res, next) => {

    try {
     const leadBoardUsers = await User.find()
     .sort({ totalExpense: -1 }) 
   //   .exec((err, documents) => {
   //    })
     
      res.status(200).json(leadBoardUsers);
     }

    catch(err) {
     console.log(err);
    }
 }

 module.exports = {
    premiumLeaderBoard
 }