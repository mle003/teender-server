const express = require("express");
const router = new express.Router();

const authHandlers = require("./modules/auth");
const userHandlers = require("./modules/users");
const settingHandlers = require("./modules/setting");

const uploadImage = require("./modules/external/uploadImage");
const dev = require('./modules/dev')

router.get("/api/auth/check-user", authHandlers.checkUser); 
router.post("/api/auth/sign-up", authHandlers.signUp);
router.post("/api/auth/sign-in", authHandlers.signIn);

// User handler 
let authen = authHandlers.authenticatedMiddleware

router.get("/api/cards", authen, userHandlers.getCards);
router.post("/api/like-unlike", authen, userHandlers.likeAndUnlike);
router.get("/api/match", authen, userHandlers.getMatches);

// setting handler
router.post("/api/reset-password", authen, settingHandlers.resetPassword);

// other handler
router.post("/api/upload-image", authen, uploadImage);
// router.get("/api/dev", dev);
module.exports = router;
