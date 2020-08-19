const chatModel = require("./model");
const template = require("../template");

const chatHandler = {
  async chat(req, res, next) {
    try {
      let data = req.body;
      let users = await chatModel.findOne({ users: data.users });
      if (users) {
        await chatModel.updateOne(
          { users: data.users },
          { $push: { messages: data.messages } }
        );
      } else {
        await chatModel.create(data);
      }
      let a = await chatModel.findOne({ users: data.users });
      res.json(a);
    } catch (error) {
      next(error);
    }
  },
  async findUsersChat(req, res, next) {
    try {
      let data = req.body;
      let users = await chatModel.findOne({ users: data.users });
      console.log(users);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = chatHandler;
