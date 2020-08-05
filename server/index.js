require("./connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const router = require("./router");
const template = require("./modules/template");
const cors = require("cors");

const {
  readTokenMiddleware,
  authenticatedMiddleware,
} = require("./modules/auth");

const app = express();

const port = 9000;
app.use(cors());

app.use(bodyParser.json());
app.use(
  session({
    secret: "my secret string",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 12 * 60 * 60 }, //12 hours
  })
);

app.use(readTokenMiddleware);

app.use(router);

app.use((err, req, res, next) => {
  res.status(500).json(template.failedRes(err.message));
});

app.listen(port, (err) => {
  console.log(err || `Server opened at port '${port}'`);
});
