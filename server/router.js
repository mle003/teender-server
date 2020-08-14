const express = require("express");
const router = new express.Router();

const authHandlers = require("./modules/auth");
const userHandlers = require("./modules/users");

router.get("/api/auth/check-user", authHandlers.checkUser); 

router.post("/api/auth/sign-up", authHandlers.signUp);

router.post("/api/auth/sign-in", authHandlers.signIn);

// User handler 
router.get("/api/cards", userHandlers.getCards, authHandlers.authenticatedMiddleware);
router.post("/api/like-unlike", userHandlers.likeAndUnlike, authHandlers.authenticatedMiddleware);

module.exports = router;
