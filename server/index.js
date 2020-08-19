require("./connect-mongo");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const socketIo = require("socket.io");

const router = require("./router");
const template = require("./modules/template");
const chatHandler = require("./modules/chat");

const {
  readTokenMiddleware,
  authenticatedMiddleware,
} = require("./modules/auth");

const app = express();

const port = 9000;

app.use(bodyParser.json());
app.use(cors());
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
  if (err) res.json(template.failedRes(err.message));
});

const server = app.listen(port, (err) => {
  console.log(err || `Server opened at port '${port}'`);
});

setupSocket(server);

function setupSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("some one connect to server");
    // send mess from server to client
    socket.on("Input Chat Message", function (messages) {
      // console.log(messages);
      socket.emit("Output Chat Message", messages);
    });
  });
}
