const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const err_middleware = require("./middlewares/error");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
// start services
require("./startups/index");
const routes = require("./routes");
const ServerResponse = require("./utils/response");

// Express APIs
// const api = require('./routes/auth.routes');
// const booking = require('./routes/booking.routes');
// const emailsend = require('./routes/email.routes');
// const serviceupdate = require('./routes/service.routes');
// const price = require('./routes/prices.routes');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use(helmet());

// Serve static resources
app.use("/public", express.static("public"));
// app.use('/api', api);
// app.use('/api/book/', booking);
// app.use('/api/email/', emailsend);
// app.use('/api/service-update/', serviceupdate);
// app.use('/api/getprice/', price);

app.use("/api", routes);

app.use("*", (req, res) => {
  ServerResponse.message(
    `the route ${req.method} ${req.originalUrl} does not exist`
  )
    .success(false)
    .statusCode(404)
    .respond(res);
});

app.use(err_middleware);

const server = app.listen(process.env.PORT, () => {
  console.log("Connected to port " + process.env.PORT);
});
