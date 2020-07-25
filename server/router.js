const express = require("express");
const router = new express.Router();
const path = "path";

const authHandlers = require("./modules/auth");

router.post("/api/auth/sign-up", authHandlers.signUp);

router.post("/api/auth/sign-in", authHandlers.signIn);

module.exports = router;
