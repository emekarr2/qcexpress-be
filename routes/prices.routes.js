const express = require("express");
const router = express.Router();

const zonedata = require("./prices");
const contries = require("./countries");
const importdata = require("./import");

let newtotal;

const calculatePrice = (weight, zone) => {
  let rate;
  let price;

  let srate = zonedata.find((data) => data.weight == weight);
  console.log(srate);
  console.log(zone, "mm");
  switch (zone) {
    case "zone1":
      rate = srate.zone1.rate;
      price = srate.zone1.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);
      return newtotal;
    case "zone2":
      rate = srate.zone2.rate;
      price = srate.zone2.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);
      return newtotal;
    case "zone3":
      rate = srate.zone3.rate;
      price = srate.zone3.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);

      return newtotal;

    case "zone4":
      rate = srate.zone4.rate;
      price = srate.zone4.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);

      return newtotal;

    case "zone5":
      rate = srate.zone5.rate;
      price = srate.zone5.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;

    case "zone6":
      rate = srate.zone6.rate;
      price = srate.zone6.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);

      return newtotal;

    case "zone7":
      rate = srate.zone7.rate;
      price = srate.zone7.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal);

      return newtotal;

    case "zone8":
      rate = srate.zone8.rate;
      price = srate.zone8.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
  }
};
const calculateShipping = (country, weight, type) => {
  let zone = contries.find((zone) => zone.Countries === country);
  const newZone = zone.Zone;
  weight = parseFloat(weight);
  if (type == "Document" && weight <= 2) {
    if (weight <= 0.5) {
      switch (newZone) {
        case "zone1":
          var margin = 0.4 * 10360.61;
          var rate = margin * 0.075;
          newtotal = 10360.61 + margin + rate;
          return newtotal;
        case "zone2":
          var margin = 0.23 * 11704.17;
          var rate = margin * 0.075;
          newtotal = 11704.17 + rate + margin;
          return newtotal;
        case "zone3":
          var margin = 0.2 * 13047.72;
          var rate = margin * 0.075;
          newtotal = 13047.72 + margin + rate;
          return newtotal;
        case "zone4":
          var margin = 0.18 * 15286.99;
          var rate = margin * 0.075;
          newtotal = 15286.99 + rate + margin;
          return newtotal;
        case "zone5":
          var margin = 0.18 * 15734.84;
          var rate = margin * 0.075;
          newtotal = 15734.84 + rate + margin;
          return newtotal;
        case "zone6":
          var margin = 0.18 * 17078.41;
          var rate = margin * 0.075;
          newtotal = 17078.41 + rate + margin;
          return newtotal;
        case "zone7":
          var margin = 0.13 * 19411.93;
          var rate = margin * 0.075;
          newtotal = 19411.93 + rate + margin;
          return newtotal;
          break;
        case "zone8":
          var margin = 0.1 * 20307.61;
          var rate = margin * 0.075;
          newtotal = 20307.61 + rate + margin;
          return newtotal;
      }
    } else if (weight <= 1) {
      switch (newZone) {
        case "zone1":
          var margin = 0.4 * 10420.57;
          var rate = margin * 0.075;
          newtotal = 10420.57 + rate + margin;
          return newtotal;
        case "zone2":
          var margin = 0.23 * 11764.13;
          var rate = margin * 0.075;
          newtotal = 11764.13 + rate + margin;
          return newtotal;
        case "zone3":
          var margin = 0.2 * 13107.67;
          var rate = margin * 0.075;
          newtotal = 13107.67 + rate + margin;
          return newtotal;
        case "zone4":
          var margin = 0.18 * 15346.96;
          var rate = margin * 0.075;
          newtotal = 15346.96 + rate + margin;
          return newtotal;
        case "zone5":
          var margin = 0.18 * 15794.8;
          var rate = margin * 0.075;
          newtotal = 15794.8 + rate + margin;
          return newtotal;
        case "zone6":
          var margin = 0.18 * 17138.36;
          var rate = margin * 0.075;
          newtotal = 17138.36 + rate + margin;
          return newtotal;
        case "zone7":
          var margin = 0.13 * 20013.98;
          var rate = margin * 0.075;
          newtotal = 20013.98 + rate + margin;
          return newtotal;

        case "zone8":
          var margin = 0.1 * 20909.67;
          var rate = margin * 0.075;
          newtotal = 20909.67 + rate + margin;
          return newtotal;
      }
    } else if (weight <= 1.5) {
      switch (newZone) {
        case "zone1":
          var margin = 0.4 * 10480.53;
          var rate = margin * 0.075;
          newtotal = 10480.53 + rate + margin;
          return newtotal;
        case "zone2":
          var margin = 0.23 * 11824.08;
          var rate = margin * 0.075;
          newtotal = 11824.08 + rate + margin;
          return newtotal;
        case "zone3":
          var margin = 0.2 * 13167.63;
          var rate = margin * 0.075;
          newtotal = 13167.63 + rate + margin;
          return newtotal;
        case "zone4":
          var margin = 0.18 * 15406.91;
          var rate = margin * 0.075;
          newtotal = 15406.91 + rate + margin;
          return newtotal;
        case "zone5":
          var margin = 0.18 * 15854.75;
          var rate = margin * 0.075;
          newtotal = 15854.75 + rate + margin;
          return newtotal;
        case "zone6":
          var margin = 0.18 * 17198.32;
          var rate = margin * 0.075;
          newtotal = 17198.32 + rate + margin;
          return newtotal;
        case "zone7":
          var margin = 0.13 * 20616.03;
          var rate = margin * 0.075;
          newtotal = 20616.03 + rate + margin;
          return newtotal;

        case "zone8":
          var margin = 0.1 * 21511.72;
          var rate = margin * 0.075;
          newtotal = 21511.72 + rate + margin;
          return newtotal;
      }
    } else if (weight <= 2) {
      console.log("hello");
      switch (newZone) {
        case "zone1":
          var margin = 0.4 * 10540.49;
          var rate = margin * 0.075;
          newtotal = 10540.49 + rate + margin;
          return newtotal;
        case "zone2":
          var margin = 0.23 * 11884.04;
          var rate = margin * 0.075;
          newtotal = 11884.04 + rate + margin;
          return newtotal;
        case "zone3":
          var margin = 0.2 * 13220.0759;
          var rate = margin * 0.075;
          newtotal = 13220.0759 + rate + margin;
          return newtotal;
        case "zone4":
          var margin = 0.18 * 15466.87;
          var rate = margin * 0.075;
          newtotal = 15466.87 + rate + margin;
          return newtotal;
          break;
        case "zone5":
          var margin = 0.18 * 15914.71;
          var rate = margin * 0.075;
          newtotal = 15914.71 + rate + margin;

          return newtotal;
        case "zone6":
          var margin = 0.18 * 17258.28;
          var rate = margin * 0.075;
          newtotal = 17258.28 + rate + margin;
          console.log(newtotal, "newtotal6");

          return newtotal;
        case "zone7":
          var margin = 0.13 * 21218.09;
          var rate = margin * 0.075;
          newtotal = 21218.09 + rate + margin;

          return newtotal;
        case "zone8":
          var margin = 0.1 * 22113.78;
          var rate = margin * 0.075;
          newtotal = 22113.78 + rate + margin;
          console.log(newtotal, "newtotal8");
          return newtotal;
      }
    }
  } else {
    console.log("yes");
    calculatePrice(weight, zone);
  }
};


const calculateImpPrice = (weight, zone) => {
  let rate;
  let price;
  console.log(weight, zone);
  let srate = zonedata.find((data) => data.weight == weight);
  console.log(zone, "srate");
  switch (zone) {
    case "zone1":
      rate = srate.zone1.rate;
      price = parseInt(srate.zone1.price);
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal)
      return newtotal;
      break;
    case "zone2":
      rate = srate.zone2.rate;
      price = srate.zone2.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone3":
      rate = srate.zone3.rate;
      price = srate.zone3.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone4":
      rate = srate.zone4.rate;
      price = parseInt(srate.zone4.price);
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone5":
      rate = srate.zone5.rate;
      price = srate.zone5.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone6":
      rate = srate.zone6.rate;
      price = srate.zone6.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone7":
      rate = srate.zone7.rate;
      price = srate.zone7.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      return newtotal;
      break;
    case "zone8":
      rate = srate.zone8.rate;
      price = srate.zone8.price;
      var margin = rate * price;
      var wrate = margin * 0.075;
      newtotal = price + wrate + margin;
      console.log(newtotal,"kk")
      return newtotal;
      break;
  }
};

const calculateImpShipping = (country, weight, type) => {
  let zone = contries.find((zone) => zone.Countries === country);
  const newZone = zone.Zone;
  weight = parseFloat(weight);
  console.log(weight)
  if (type == "Document" && weight <= 2) {
    console.log(type,country,newZone)

    if (weight <= 0.5) {
      switch (newZone) {
        case "zone1":
          var margin = 0.25 * 11256.3;
          var rate = margin * 0.075;
          newtotal = 11256.3 + margin + rate;
          return newtotal;
          break;
        case "zone2":
          var margin = 0.25 * 12599.87;
          var rate = margin * 0.075;
          newtotal = 12599.87 + rate + margin;
          return newtotal;
          break;
        case "zone3":
          var margin = 0.25 * 13943.43;
          var rate = margin * 0.075;
          newtotal = 13943.43 + margin + rate;
          return newtotal;
          break;
        case "zone4":
          var margin = 0.25 * 16182.71;
          var rate = margin * 0.075;
          newtotal = 16182.71 + rate + margin;
          return newtotal;
          break;
        case "zone5":
          var margin = 0.25 * 16630.55;
          var rate = margin * 0.075;
          newtotal = 16630.55 + rate + margin;
          return newtotal;
          break;
        case "zone6":
          var margin = 0.25 * 17974.11;
          var rate = margin * 0.075;
          newtotal = 17974.11 + rate + margin;
          return newtotal;
          break;
        case "zone7":
          var margin = 0.25 * 20307.62;
          var rate = margin * 0.075;
          newtotal = 20307.62 + rate + margin;
          setTotal(newtotal);
          break;
        case "zone8":
          var margin = 0.25 * 21203.34;
          var rate = margin * 0.075;
          newtotal = 21203.34 + rate + margin;
          console.log(newtotal)
          return newtotal;
          break;
      }
    } else if (weight <= 1) {
      switch (newZone) {
        case "zone1":
          var margin = 0.25 * 11316.26;
          var rate = margin * 0.075;
          newtotal = 11316.26 + rate + margin;
          return newtotal;
          break;
        case "zone2":
          var margin = 0.25 * 12659.83;
          var rate = margin * 0.075;
          newtotal = 12659.83 + rate + margin;
          return newtotal;
          break;
        case "zone3":
          var margin = 0.25 * 14003.39;
          var rate = margin * 0.075;
          newtotal = 14003.39 + rate + margin;
          return newtotal;
          break;
        case "zone4":
          var margin = 0.25 * 16242.67;
          var rate = margin * 0.075;
          newtotal = 16242.67 + rate + margin;
          return newtotal;
          break;
        case "zone5":
          var margin = 0.25 * 16690.51;
          var rate = margin * 0.075;
          newtotal = 16690.51 + rate + margin;
          return newtotal;
          break;
        case "zone6":
          var margin = 0.25 * 18034.07;
          var rate = margin * 0.075;
          newtotal = 18034.07 + rate + margin;
          return newtotal;
          break;
        case "zone7":
          var margin = 0.25 * 20909.67;
          var rate = margin * 0.075;
          newtotal = 20909.67 + rate + margin;
          return newtotal;
          break;

        case "zone8":
          var margin = 0.25 * 21805.4;
          var rate = margin * 0.075;
          newtotal = 21805.4 + rate + margin;
          return newtotal;
          break;
      }
    }
  } else {
    calculateImpPrice(weight, zone);
  }
};

router.post("/", (req, res, next) => {
  const { weight, zone, type, country } = req.body;
  if (type == "Document" && weight <= 2) {
    var message = calculateShipping(country, weight, type);
    res.status(201).json({
      message: "success",
      result: Math.round(message),
    });
  } else {
    var message = calculatePrice(weight, zone);
    res.status(201).json({
      message: "success",
      result: Math.round(message),
    });
  }
});

router.post("/import", (req, res, next) => {
  const { weight, zone, type, country } = req.body;
  if (type == "Document" && weight <= 2) {
    var message = calculateImpShipping(country, weight, type);
    res.status(201).json({
      message: "success",
      result: Math.round(message),
    });
  } else {
    var message = calculateImpPrice(weight, zone);
    res.status(201).json({
      message: "success",
      result: Math.round(message),
    });
  }
});

router.post("/getimportPrice", (req, res, next) => {
  
})

module.exports = router;
