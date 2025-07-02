const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword
      })
      user.save()
        .then((result) => {
          res.status(201).json({
            message: "User created successfully",
            user: result
          })
        })
        .catch(err => {
          res.status(400).json({
            message: "User creation failed",
            error: err
          })
        })
    })
})

router.post("/login", (req, res) => {
  let fetchedUser = null;

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, fetchedUser.password)
    })
    .then(result => {
      if (!result) {
         return res.status(401).json({
          message: "Auth failed",
          error: err
        })
      }

      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'dev-test-secret', {
        expiresIn: '1h'
      })

      res.status(200).json({
        message: "Auth success",
        token: token,
        user: fetchedUser,
        expiresIn: 3600
      })
    })
    .catch(err => {
      res.status(401).json({
        message: "Auth failed",
        error: err
      })
    })
})

module.exports = router;
