const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next) {
  try {
    // Find a user
    let user = await db.User.findOne({
      email: req.body.email
    });
    // Checking if their password matches what was sent to the server
    let { id, username, profileImageUrl } = user;
    let isMatch = await user.comparePassword(req.body.password);
    // If it all matches, log them in
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
          profileImageUrl
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password."
      });
    }
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid Email/Password."
    });
  }
};

exports.signup = async function(req, res, next) {
  try {
    // Create a user
    let user = await db.User.create(req.body);
    let { id, username, profileImageUrl } = user;
    // Create a token
    let token = jwt.sign(
      { id, username, profileImageUrl },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch (err) {
    // If a validation fails
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is taken.";
    }
    return next({
      status: 400,
      message: err.message
    });
    // See what kind of error
    // if it is a certain error
    // respond with username/email already taken
    // otherwise just send back a generic 400
  }
};
