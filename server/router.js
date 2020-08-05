const express = require("express");
const router = new express.Router();

const authHandlers = require("./modules/auth");
const userHandlers = require("./modules/users");
const likeHandler = require("./modules/like-unlike");

router.post("/api/auth/sign-up", authHandlers.signUp);

router.post("/api/auth/sign-in", authHandlers.signIn);

router.post("/api/like-unlike", likeHandler.likeAndUnlike);

// User handler
router.get(
  "/api/users",
  userHandlers.getUsers,
  authHandlers.authenticatedMiddleware
);

module.exports = router;
