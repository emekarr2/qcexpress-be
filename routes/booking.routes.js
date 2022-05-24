const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const bookingSchema = require("../models/Booking");
const authorize = require("../middlewares/auth");
var mailgun = require("mailgun-js");
var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN }); // Sign-up

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

router.post("/create-booking", (req, res, next) => {
  console.log("booking");
  const tracking = between(10000001, 90000009);
  const email = req.body.email;
  const namee = req.body.name;

  const book = new bookingSchema({
    category: req.body.category,
    name: req.body.name,
    shipment_type: req.body.shipment_type,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    description: req.body.description,
    number_items: req.body.number_items,
    value: req.body.value,
    pickup_address: req.body.pickup_address,
    country: req.body.country,
    delivery_address: req.body.delivery_address,
    delivery_name: req.body.delivery_name,
    delivery_email: req.body.delivery_email,
    delivery_number: req.body.delivery_number,
    tracking_id: tracking,
  });
  mg.messages()
    .send({
      from: process.env.MAIL_SENDER_EMAIL,
      to: email,
      subject: "Booking Successful",
      template: "booking",
      "v:name": namee,
      "v:tracking": tracking,
    })
    .then((res) => console.log("res", res))
    .catch((err) => console.log("err", err));

  book
    .save()
    .then((response) => {
      res.status(201).json({
        message: "Booking successfully created!",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Get Users
router.route("/").get((req, res, next) => {
  bookingSchema.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).json(response);
    }
  });
});

router.route("/category/:category").get((req, res, next) => {
  let category = req.query.category;
  console.log(category)
  bookingSchema.find({
    category: category,
  }).then(data=>{
    return res.status(200).json(data);

  })
   });

// Get Single User
router.route("/user-profile/:id").get(authorize, (req, res, next) => {
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
