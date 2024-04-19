const sequelize = require("../util/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/Users");

const postUserSignin = async (req, res, next) => {
  // const t = await sequelize.transaction();
  const name = req.body.fname;
  const email = req.body.femail;
  const password = req.body.fpassword;

  const user = await User.findOne({ email: email });
  if (user) {
    console.log("USER ALREADY EXISTS");
    res.status(401).json({
      error: {
        success: "false",
        message: "User already exists",
      },
    });
  } else {
    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        const user = await User({
          name: name,
          email: email,
          password: hash,
        });
        user.save();
        console.log("USER CREATED");
        // await t.commit();
        res.status(200).json({
          success: "true",
          message: "Successfully created new user",
        });
      } catch (err) {
        // await t.rollback();
        console.log(err);
      }
    });
  }
};

function generateAccessToken(id) {
  console.log(process.env.SECRET_TOKEN);
  return jwt.sign({ id: id }, process.env.SECRET_TOKEN);
}

const postUserLogin = async (req, res, next) => {
  const email = req.body.femail;
  const password = req.body.fpassword;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response === true) {
          return res.status(200).json({
            success: "true",
            message: "Successfully logged in",
            token: generateAccessToken(user._id),
          });
        }

        if (err) {
          console.log("Something went wrong");
          res.status(500).json({
            error: {
              success: "false",
              message: "Something went wrong",
            },
          });
        } else {
          console.log("User not authorised");
          res.status(401).json({
            error: {
              success: "false",
              message: "User not authorised",
            },
          });
        }
      });
    } else {
      console.log("User not found");
      res.status(404).json({
        error: {
          success: "false",
          message: "User not found",
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserByToken = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findOne({ _id: id });
    console.log("GET CALL");
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  postUserSignin,
  postUserLogin,
  getUserByToken,
};
