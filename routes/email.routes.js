const express = require('express')
const router = express.Router()
const EmailSchema = require('../models/Email')
var mailgun = require('mailgun-js')
var API_KEY = process.env.MAILGUN_API_KEY 
var DOMAIN = process.env.MAILGUN_DOMAIN
const mg =mailgun({apiKey: API_KEY, domain: DOMAIN});// Sign-up


router.post(
  '/create-email',(req, res, next) => { 
        const {name,email,subject,message}=req.body  
        const newemail = new EmailSchema({
        name:req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        mesage: req.body.message,
        })
        mg.
        messages().
        send({
          from: process.env.MAIL_SENDER_EMAIL,
          to: process.env.MAIL_SENDER_EMAIL,
            subject: 'New Customer Support',
            text: `Hi Admin, Incoming message from ${name},with subject ${subject} and ${message}`
        }).
        then(res => console.log('res',res)).
        catch(err => console.log('err',err))
        
        newemail
          .save()
          .then((response) => {
            res.status(201).json({
              message: 'success',
              result: response,
            })
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            })
          })
    }
)
module.exports = router
