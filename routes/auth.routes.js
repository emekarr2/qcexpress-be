const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User");
const authorize = require("../middlewares/auth");
require("dotenv").config();
var mailgun = require("mailgun-js");
var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

router.post("/register-user", (req, res, next) => {
  console.log("referral");
  const referral = Math.random().toString(36).substring(2, 7);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new userSchema({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      phonenumber: req.body.phonenumber,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      password: hash,
      referral: referral,
    });
    user
      .save()
      .then((response) => {
        res.status(201).json({
          message: "User successfully created!",
          result: response,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
});

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

router.post("/verify_token", (req, res, next) => {
  const token = between(1001, 9009);
  try {
    const email = req.body.email;
    userSchema
      .findOne({
        email: req.body.email,
      })
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS:", result.username);
          return res.status(200).json({
            message: "User already exist!",
          });
        } else {
          mg.messages()
            .send({
            })
            .then((response) => {
              console.log(response);
              return res.status(200).json({
                message: token,
              });
            });
        }
      });
  } catch (e) {
    console.log(e);
  }
});
// Sign-in
router.post("/signin", (req, res, next) => {
  let getUser;
  userSchema
    .findOne({
      email: req.body.email,
    })
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed, wrong email",
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(async (response) => {
      if (!response) {
        return res.status(401).json({
          message: "Authentication failed,wrong password",
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        "longer-secret-is-better",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        firstname: getUser.firstname,
        lastname: getUser.lastname,
        email: getUser.email,
        referral: getUser.referral,
        phonenumber: getUser.phonenumber,
        address: getUser.address,
        id: getUser._id,
      });
    })
    .catch((err) => {
      console.log(err);

      return res.status(401).json({
        message: "Authentication failed",
      });
    });
});

// Get Users
router.route("/").get((req, res, next) => {
  userSchema.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).json(response);
    }
  });
});
router.post("/forgot", async (req, res) => {
  let getUser;
  try {
    const email = req.body.email;
    const user = await userSchema.findOne({ email: email }).then((data) => {
      getUser = data;
    });
    if (!getUser) {
      return res.status(401).json({
        message: "Email doesn't Exist",
        type: "fail",
      });
    }
    const link = `https://qcexpress.co/reset`;

    mg.messages()
      .send({
        from: process.env.MAIL_SENDER_EMAIL,
        to: email,
        subject: "Forgot Password",
        template: "forgot",
        "v:token": link,
      })
      .then((response) => {
        console.log(response)
        return res.status(200).json({
          message: "Reset link have been sent",
          id: getUser._id,
        });
      });
  } catch (error) {
    console.log(error);
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/reset/:userId", async (req, res) => {
  try {
    console.log(req.params.userId);
    const user = await userSchema.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");
    bcrypt.hash(req.body.password, 10).then((hash) => {
      user.password = hash;
      user.save();


    });
    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

// Get Single User
router.route("/user-profile/:id").get((req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

// Update User
router.route("/update-user/:id").put((req, res, next) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
        console.log("User successfully updated!");
      }
    }
  );
});

// Delete User
router.route("/delete-user/:id").delete((req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
