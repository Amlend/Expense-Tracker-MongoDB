const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const authenticate = (req,res, next) => {

    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token,process.env.SECRET_TOKEN);
        User.findById(user.id).then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        })
    }

    catch(err){
        console.log(err);
       return  res.status(401).json({success: false})
    }
}


module.exports = {
    authenticate};