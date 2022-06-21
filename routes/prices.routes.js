const express = require("express");
const router = express.Router();

const zonedata = require("./prices");
const contries = require("./countries");
const importdata = require("./import");
const stateprice = require("./statesprice");

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
        rate = srate.zone1.rate;
        price = srate.zone1.price;
        var margin = rate * price;
        var wrate = margin * 0.075;
        newtotal = price + wrate + margin;
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
        price = srate.zone4.price;
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
        console.log("here")
        rate = srate.zone8.rate;
        console.log(rate)

        price = srate.zone8.price;
        console.log(price)

        var margin = rate * price;
        var wrate = margin * 0.075;
        console.log(wrate)

        newtotal = price + wrate + margin;
        console.log(newtotal)

        return newtotal;
        break;
    }
  };
  const calculateShipping = (country, weight, type) => {
    let zone = contries.find((zone) => zone.Countries === country);
    console.log(zone,country, weight, type);
    const newZone = zone.Zone;
    console.log(type, weight);
    weight = parseFloat(weight);
    if (type == "Document" && weight <= 2) {
      if (weight <= 0.5) {
        switch (newZone) {
          case "zone1":
            var margin = 0.4 * 11261.53875;
            var rate = margin * 0.075;
            newtotal = 11261.53875 + margin + rate;
            return newtotal;
            break;
          case "zone2":
            var margin = 0.23 * 12721.92625;
            var rate = margin * 0.075;
            newtotal = 12721.92625 + rate + margin;
            return newtotal;
            break;
          case "zone3":
            var margin = 0.2 * 14182.3003125;
            var rate = margin * 0.075;
            newtotal = 14182.3003125 + margin + rate;
            return newtotal;
            break;
          case "zone4":
            var margin = 0.18 * 16616.301875;
            var rate = margin * 0.075;
            newtotal = 16616.301875 + rate + margin;
            return newtotal;
            break;
          case "zone5":
            var margin = 0.18 * 17103.08875;
            var rate = margin * 0.075;
            newtotal = 17103.08875 + rate + margin;
            return newtotal;
            break;
          case "zone6":
            var margin = 0.18 * 18563.4896875;
            var rate = margin * 0.075;
            newtotal = 18563.4896875 + rate + margin;
            return newtotal;
            break;
          case "zone7":
            var margin = 0.13 * 21099.9253125;
            var rate = margin * 0.075;
            newtotal = 21099.9253125 + rate + margin;
            setTotal(newtotal);
            break;
          case "zone8":
            var margin = 0.1 * 21484.2646875;
            var rate = margin * 0.075;
            newtotal = 21484.2646875+ rate + margin;
            return newtotal;
            break;
        }
      } else if (weight <= 1) {
        switch (newZone) {
          case "zone1":
            var margin = 0.4 * 11326.710625;
            var rate = margin * 0.075;
            newtotal = 11326.710625 + rate + margin;
            return newtotal;
            break;
          case "zone2":
            var margin = 0.23 * 12787.098125;
            var rate = margin * 0.075;
            newtotal = 12787.098125 + rate + margin;
            return newtotal;
            break;
          case "zone3":
            var margin = 0.2 * 14247.4721875;
            var rate = margin * 0.075;
            newtotal = 14247.4721875 + rate + margin;
            return newtotal;
            break;
          case "zone4":
            var margin = 0.18 * 16681.47375;
            var rate = margin * 0.075;
            newtotal = 16681.47375 + rate + margin;
            return newtotal;
            break;
          case "zone5":
            var margin = 0.18 * 17168.260625;
            var rate = margin * 0.075;
            newtotal = 17168.260625 + rate + margin;
            return newtotal;
            break;
          case "zone6":
            var margin = 0.18 * 18628.6615625;
            var rate = margin * 0.075;
            newtotal = 18628.6615625 + rate + margin;
            return newtotal;
            break;
          case "zone7":
            var margin = 0.13 * 21754.3315625;
            var rate = margin * 0.075;
            newtotal = 21754.3315625 + rate + margin;
            return newtotal;
            break;

          case "zone8":
            var margin = 0.1 * 21549.4365625;
            var rate = margin * 0.075;
            newtotal = 21549.4365625 + rate + margin;
            return newtotal;
            break;
        }
      } else if (weight <= 1.5) {
        switch (newZone) {
          case "zone1":
            var margin = 0.4 * 11391.8825;
            var rate = margin * 0.075;
            newtotal = 11391.8825 + rate + margin;
            return newtotal;
            break;
          case "zone2":
            var margin = 0.23 * 12852.27;
            var rate = margin * 0.075;
            newtotal = 12852.27 + rate + margin;
            return newtotal;
            break;
          case "zone3":
            var margin = 0.2 * 14312.6440625;
            var rate = margin * 0.075;
            newtotal = 14312.6440625 + rate + margin;
            return newtotal;
            break;
          case "zone4":
            var margin = 0.18 * 16746.645625;
            var rate = margin * 0.075;
            newtotal = 16746.645625 + rate + margin;
            return newtotal;
            break;
          case "zone5":
            var margin = 0.18 * 17233.4325;
            var rate = margin * 0.075;
            newtotal = 17233.4325 + rate + margin;
            return newtotal;
            break;
          case "zone6":
            var margin = 0.18 * 18693.8334375;
            var rate = margin * 0.075;
            newtotal = 18693.8334375 + rate + margin;
            return newtotal;
            break;
          case "zone7":
            var margin = 0.13 * 22408.7378125;
            var rate = margin * 0.075;
            newtotal = 22408.7378125 + rate + margin;
            return newtotal;
            break;

          case "zone8":
            var margin = 0.1 * 21614.6084375;
            var rate = margin * 0.075;
            newtotal = 21614.6084375 + rate + margin;
            return newtotal;
            break;
        }
      } else if (weight <= 2) {
        switch (newZone) {
          case "zone1":
            var margin = 0.4 * 11457.054375;
            var rate = margin * 0.075;
            newtotal = 11457.054375 + rate + margin;
            console.log(newtotal, "newtotal1");

            return newtotal;
            break;
          case "zone2":
            var margin = 0.23 * 12917.441875;
            var rate = margin * 0.075;
            newtotal = 12917.441875 + rate + margin;
            console.log(newtotal, "newtotal2");

            return newtotal;
            break;
          case "zone3":
            var margin = 0.2 * 14377.8159375;
            var rate = margin * 0.075;
            newtotal = 14377.8159375 + rate + margin;
            console.log(newtotal, "newtotal3");

            return newtotal;
            break;
          case "zone4":
            var margin = 0.18 * 16811.8175;
            var rate = margin * 0.075;
            newtotal = 16811.8175 + rate + margin;
            console.log(newtotal, "newtotal");
            return newtotal;
            break;
          case "zone5":
            var margin = 0.18 * 17298.604375;
            var rate = margin * 0.075;
            newtotal = 17298.604375 + rate + margin;
            console.log(newtotal, "newtotal5");

            return newtotal;
            break;
          case "zone6":
            var margin = 0.18 * 18759.0053125;
            var rate = margin * 0.075;
            newtotal = 18759.0053125 + rate + margin;
            console.log(newtotal, "newtotal6");

            return newtotal;
            break;
          case "zone7":
            var margin = 0.13 * 23063.1440625;
            var rate = margin * 0.075;
            newtotal = 23063.1440625 + rate + margin;
            console.log(newtotal, "newtotal7");

            return newtotal;
            break;
          case "zone8":
            var margin = 0.1 * 21679.7803125;
            var rate = margin * 0.075;
            newtotal = 21679.78 + rate + margin;
            console.log(newtotal, "newtotal8");

            return newtotal;
            break;
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
      console.log(newtotal);
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
      console.log(newtotal, "kk");
      return newtotal;
      break;
  }
};

const calculateImpShipping = (country, weight, type) => {
  let zone = contries.find((zone) => zone.Countries === country);
  const newZone = zone.Zone;
  weight = parseFloat(weight);
  console.log(weight);
  if (type == "Document" && weight <= 2) {
    console.log(type, country, newZone);

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
          return newtotal;
          break;
        case "zone8":
          var margin = 0.25 * 21203.34;
          var rate = margin * 0.075;
          newtotal = 21203.34 + rate + margin;
          console.log(newtotal);
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

router.post("/domestic", (req, res, next) => {
  const { weight, delivery_state, pickup_state } = req.body;
  const southwest = ["Ogun", "Oyo", "Osun", "Ekiti", "Ondo"];
  try {
    if (delivery_state === pickup_state) {
      let srate = stateprice.find((data) => data.weight == weight);
      var margin = 0.1 * parseInt(srate.Intracity);
      var rate = margin * 0.075;
      newtotal = parseInt(srate.Intracity) + rate + margin;

      res.status(201).json({
        message: "success",
        result: Math.round(newtotal),
        sres: Math.ceil(newtotal),
      });
    } else if (delivery_state === "Lagos" && southwest.includes(pickup_state)) {
      let srate = stateprice.find((data) => data.weight == weight);
      var margin = 0.12 * parseInt(srate.IntraRegion);
      var rate = margin * 0.075;
      newtotal = parseInt(srate.IntraRegion) + rate + margin;

      res.status(201).json({
        message: "success",
        result: Math.round(newtotal),
        sres: Math.ceil(newtotal),
      });
    } else if (delivery_state !== "Lagos" && delivery_state !== pickup_state) {
      let srate = stateprice.find((data) => data.weight == weight);
      var margin = 0.1 * parseInt(srate.Interstate);

      var rate = Math.ceil(parseInt(margin * 0.075));

      newtotal = parseInt(srate.Interstate) + rate + margin;

      res.status(201).json({
        message: "success",
        result: Math.round(newtotal),
        sres: Math.ceil(newtotal),
      });
    } else {
      let srate = stateprice.find((data) => data.weight == weight);
      var margin = 0.10 * parseInt(srate.ZoneC);

      var rate = margin * 0.075;

      newtotal = parseInt(srate.ZoneC) + rate + margin;

      res.status(201).json({
        message: "success",
        result: Math.round(newtotal),
        sres: Math.ceil(newtotal),
      });
    }
  } catch (e) {
    console.log;
  }
});

module.exports = router;
