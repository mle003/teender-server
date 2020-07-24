const mongooes = require("mongoose");

const userSchema = require("./schema");
const MODEL_NAME = "userProfile";
const COLLECTION_NAME = "user-profile";
const model = mongooes.model(MODEL_NAME, userSchema, COLLECTION_NAME);

module.exports = model;
