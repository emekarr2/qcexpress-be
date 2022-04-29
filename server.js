const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config();

// Express APIs
const api = require('./routes/auth.routes')
const booking = require('./routes/booking.routes')
const emailsend= require('./routes/email.routes')
const serviceupdate= require('./routes/service.routes')

mongoose
  .connect(`mongodb+srv://${process.env.SQL_DB_NAME}:${process.env.SQL_PASSWORD}@cluster0.9zbdr.mongodb.net/qc-app?retryWrites=true&w=majority`)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

// Express settings
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())

// Serve static resources
app.use('/public', express.static('public'))
app.use('/api', api)
app.use('/api/book/', booking)
app.use('/api/email/', emailsend)
app.use('/api/service-update/', serviceupdate)




// Define PORT
const port = process.env.PORT || 4000

const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Express error handling
// app.use((req, res, next) => {
//     setImmediate(() => {
//       next(new Error('Something went wrong'))
//     })  
 
// })

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
