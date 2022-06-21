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
const axios = require('axios').default;

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const Dhl=(name,email)=>{

  var data = JSON.stringify({
  "plannedShippingDateAndTime": "2022-06-23T09:00:00GMT+01:00",
  "productCode": "P",
  "accounts": [
    {
      "number": "365022156",
      "typeCode": "shipper"
    }
  ],
  "pickup": {
    "isRequested": false
  },
  "outputImageProperties": {
    "allDocumentsInOneImage": true,
    "encodingFormat": "pdf",
    "imageOptions": [
      {
        "templateName": "ECOM26_84_A4_001",
        "typeCode": "label"
      },
      {
        "templateName": "ARCH_8X4_A4_002",
        "isRequested": true,
        "hideAccountNumber": true,
        "typeCode": "waybillDoc"
      },
      {
        "templateName": "COMMERCIAL_INVOICE_P_10",
        "invoiceType": "proforma",
        "languageCode": "eng",
        "isRequested": true,
        "typeCode": "invoice"
      }
    ]
  },
  "customerDetails": {
    "shipperDetails": {
      "postalAddress": {
        "postalCode": "",
        "cityName": "Ikeja",
        "countryCode": "NG",
        "addressLine1": "Test address 1",
        "countyName": "Lagos"
      },
      "contactInformation": {
        "phone": "+234800000000",
        "companyName": "Test Company 1",
        "fullName": name,
        "email": email
      },
      "typeCode": "business"
    },
    "receiverDetails": {
      "postalAddress": {
        "postalCode": "",
        "cityName": "Accra",
        "countryCode": "GH",
        "addressLine1": "Test address 2",
        "countyName": "Accra"
      },
      "contactInformation": {
        "phone": "+233000000000",
        "companyName": "Digicomme",
        "fullName": name,
        "email": email
      },
      "typeCode": "business"
    }
  },
  "content": {
    "exportDeclaration": {
      "lineItems": [
        {
          "number": 1,
          "quantity": {
            "unitOfMeasurement": "PCS",
            "value": 1
          },
          "price": 20,
          "description": "Bag of Rice x1",
          "weight": {
            "netValue": 50,
            "grossValue": 50
          },
          "commodityCodes": [
            {
              "typeCode": "outbound",
              "value": "HS1234567890"
            }
          ],
          "exportReasonType": "permanent",
          "manufacturerCountry": "NG"
        },
        {
          "number": 2,
          "quantity": {
            "unitOfMeasurement": "PCS",
            "value": 1
          },
          "price": 15,
          "description": "Bag of Tomatoes x1",
          "weight": {
            "netValue": 50,
            "grossValue": 50
          },
          "commodityCodes": [
            {
              "typeCode": "outbound",
              "value": "HS9876543210"
            }
          ],
          "exportReasonType": "permanent",
          "manufacturerCountry": "NG"
        }
      ],
      "exportReason": "Permanent",
      "additionalCharges": [
        {
          "value": 20,
          "typeCode": "freight"
        }
      ],
      "invoice": {
        "number": "invoice number 01",
        "date": "2022-04-12"
      },
      "placeOfIncoterm": "Accra",
      "exportReasonType": "permanent",
      "shipmentType": "personal"
    },
    "unitOfMeasurement": "metric",
    "isCustomsDeclarable": true,
    "incoterm": "DAP",
    "description": "Shipment descriptiom",
    "packages": [
      {
        "weight": 50,
        "description": "Bag of Rice x1",
        "dimensions": {
          "length": 15,
          "width": 15,
          "height": 40
        }
      },
      {
        "weight": 50,
        "description": "Bag of Tomatoes x1",
        "dimensions": {
          "length": 15,
          "width": 15,
          "height": 40
        }
      }
    ],
    "declaredValueCurrency": "USD",
    "declaredValue": 50
  },
  "valueAddedServices": [
    {
      "serviceCode": "II",
      "value": 50,
      "currency": "USD"
    }
  ],
  "customerReferences": [
    {
      "value": "Customer Reference",
      "typeCode": "CU"
    }
  ]
});

var config = {
  method: 'post',
  url: 'https://express.api.dhl.com/mydhlapi/test/shipments',
  headers: { 
    'Authorization': 'Basic cXVhcnR6Y2xhc3NORzpVIzB5R140clZeMnZEJDR1', 
    'Content-Type': 'application/json', 
    'Cookie': 'BIGipServer~WSB~pl_wsb-express-chd.dhl.com_443=292047013.64288.0000; TS0136675b=012d4839b35db23a6543a3ec3cbe18a85c27f24bfb06c8a29dca215d3cac9250ec4e00bda42df603723d9fe734d7b481902220558c'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data.documents));

  mg.messages()
    .send({
      from: process.env.MAIL_SENDER_EMAIL,
      to: email,
      subject: 'Attachment', // Subject line                                                 
      text: 'Booking attachment', // plaintext body                                                 
      html: '<b>Hello world attachment test HTML</b>', // html body                                               
      attachments: [
          {
              filename: 'fileName.pdf',                                         
              contentType: 'application/pdf'
          }]
  
    })
    .then((res) => console.log("res", res))
    .catch((err) => console.log("err", err));
})
.catch(function (error) {
  console.log(error);
});
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
 Dhl(namee,email)
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
