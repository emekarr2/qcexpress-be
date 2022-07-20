const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
// start services
require('./startups/index');

// Express APIs
const api = require('./routes/auth.routes');
const booking = require('./routes/booking.routes');
const emailsend = require('./routes/email.routes');
const serviceupdate = require('./routes/service.routes');
const price = require('./routes/prices.routes');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(cors());

// Serve static resources
app.use('/public', express.static('public'));
app.use('/api', api);
app.use('/api/book/', booking);
app.use('/api/email/', emailsend);
app.use('/api/service-update/', serviceupdate);
app.use('/api/getprice/', price);

const server = app.listen(process.env.PORT, () => {
	console.log('Connected to port ' + process.env.PORT);
});

app.use(function (err, req, res, next) {
	console.error(err.message);
	if (!err.statusCode) err.statusCode = 500;
	res.status(err.statusCode).send(err.message);
});
