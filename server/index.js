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
const port = process.env.PORT || 9000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
// server.listen NOT app.listen
server.listen(port, (err) => {
  console.log(err || `Server opened at port '${port}'`);
});

let onlineUsers = {}

io.on('connection', function(socket){ // socket = 1 session of user A
  // console.log(socket.id + ": connected");

  socket.on("disconnect", function() {
    // console.log(socket.id + ": disconnected");
    if (socket.hasOwnProperty("matchesIds")) {
      loop1:
      for (let matchId of socket.matchesIds) { // loop thru Ids of matches of user A
        loop2:
        for(let socketId in onlineUsers) { // loop thru socketId of ALL online users
          if(onlineUsers[socketId]._id == matchId) { // if one of user A's matches is online
            io.to(socketId).emit("a-match-offline", matchId) 
            // emit to this online match that A is offline
            break loop2 // breaks loop when found A
          }
        }
      }
    }
    delete onlineUsers[socket.id] // delete user out of online users list
  })

  socket.on("online", function(userId, matchesIds){
    // console.log(matchesIds)
    socket.matchesIds = matchesIds // array
    let userData = {
      _id: userId
    }
    onlineUsers[socket.id] = userData // save to list ALL online users

    let myOnlineMatches = [] // init online matches Object of userA
    loop1:
    for (let matchId of socket.matchesIds) { // loop thru Ids of matches of user A
      loop2:
      for(let socketId in onlineUsers) { // loop thru socketId of ALL online users
        if(onlineUsers[socketId]._id == matchId) { // if one of user A's matches is online
          //myOnlineMatches[socketId] = {_id: matchId}; // set to list online matches of A
          myOnlineMatches.push(matchId)
          io.to(socketId).emit("a-match-online", userId) // emit to all this online match that A is online
          break loop2 // breaks loop when found
        }
      }
    }
    socket.emit("matches-online", myOnlineMatches) // after loop, send to user A list of his online matches
  })  

  socket.on('send-message', function(newMess, chatId, matchId) {
    for(let socketId in onlineUsers) {
      if(onlineUsers[socketId]._id == matchId) {
        io.to(socketId).emit('receive-message', newMess, chatId, matchId)
        break;
      }
    }
  })
});
