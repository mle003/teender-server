const mongoose = require("mongoose");

// const EMAIL_VALID = function validateEmail(email) {
//   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// };

const schema = new mongoose.Schema({
  users: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  messages: [
    {
      content: {
        type: String,
        required: true,
      },
      owner: {
        type: String,
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = schema;
