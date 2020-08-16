require("./connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cors = require('cors')

const router = require("./router");
const template = require("./modules/template");

const {
  readTokenMiddleware,
  authenticatedMiddleware,
} = require("./modules/auth");

const app = express();

const port = 9000;

app.use(bodyParser.json({
  extended: true,
  limit: '50mb'
}));

app.use(cors())
app.use(
  session({
    secret: "my secret string",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 12 * 60 * 60}, //12 hours
  })
);

app.use(readTokenMiddleware);

app.use(router);

app.use((err, req, res, next) => {
  if (err)
    res.json(template.failedRes(err.message));
});

app.use(express.static("public"));

// when deploy, use this
// app.get('/', function(req, res) {
//   res.render(path.join(__dirname, "public", "index.html"));
// });

app.listen(port, (err) => {
  console.log(err || `Server opened at port '${port}'`);
});
