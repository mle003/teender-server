const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const JWT_SECRET = "my secret string";
/**
 * @summary this function will hash a string by algorithm md5
 * @param {String} str
 */

function hashMd5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}
function signToken(object) {
  return jwt.sign(object, JWT_SECRET, {
    expiresIn: "6h",
  });
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Add headers
function allowCrossOrigin(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
};

module.exports = { hashMd5, signToken, verifyToken, allowCrossOrigin };
