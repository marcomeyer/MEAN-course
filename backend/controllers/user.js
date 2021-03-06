const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { env } = require("process");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(200).json({
            message: 'User created!',
            result
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "Invalid signup credentials!"
          })
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User
    .findOne({ email:req.body.email })
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        env.JWT_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(error => {
      console.log(error);
      res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
