const userModel = require("./model");
const { hashMd5, signToken, verifyToken } = require("../utils");

const crypto = require("crypto");
const { LoaderOptionsPlugin } = require("webpack");

const handler = {
  async signIn(req, res, next) {
    try {
      let data = req.body;
      let { email, password } = data;

      if (!email) {
        throw new Error("Missing Email!");
      }
      if (!password) {
        throw new Error("Missing Password!");
      }

      let formattedEmail = String(email).toLowerCase().trim();
      let hashedPassword = hashMd5(String(password)); // crypto pass

      let user = await userModel.findOne({ email: formattedEmail });

      if (!user) {
        throw new Error("Invalid email or password");
      }
      if (user.password != hashedPassword) {
        throw new Error("Invalid email or password");
      }

      let userData = user.toObject();
      delete userData.password;

      let accessToken = signToken(userData);
      userData.accessToken = accessToken;
      res.json(userData);
    } catch (err) {
      next(err);
    }
  },

  async signUp(req, res, next) {
    try {
      let data = req.body;

      if (
        typeof data.password != "string" ||
        !(data.password.length >= 6 && data.password.length <= 30)
      ) {
        throw new Error("Invalid password! Password must be between 6 and 30");
      }

      data.password = hashMd5(data.password);
      data.email = String(email).toLowerCase().trim();
      data.state = "available";
      let user = await userModel.create(data);
      let userData = user.toObject();

      delete userData.password;

      res.json(userData);
    } catch (err) {
      next(err);
    }
  },
  async readTokenMiddleware(req, res, next) {
    try {
      let accessToken = req.headers.authorization;
      if (accessToken) {
        let userData = verifyToken(accessToken);
        req.user = userData;
      }
      next();
    } catch (error) {
      next(new Error("invalid access token!"));
    }
  },
  async authenticatedMiddleware(req, res, next) {
    try {
      let user = req.user;
      if (!user || !user._id) {
        throw new Error("Unauthenticated");
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handlers;
