const express = require("express");
const router = express.Router();
const serviceSchema = require("../models/Service");

router.post("/", (req, res, next) => {
  const newservice = new serviceSchema({
    message: req.body.message,
  });
  newservice
    .save()
    .then((response) => {
      res.status(201).json({
        message: "success",
        result: response,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/", (req, res, next) => {
    const item=serviceSchema.findOne().sort({'_id':-1})
    item.then((data)=>{
        res.status(201).json({
            message: "success",
            result: data,
          });    })
});
module.exports = router;
