const chatModel = require("./model");
const template = require("../template");
const { findByIdAndUpdate } = require("./model");

const chatHandler = {
  async getListChat(req, res, next) {
    try {
      let {
        getAll = false
      } = req.query

      let userId = String(req.user._id) // string, not an ObjectId

      let list = []

      if(getAll) {
        list = await chatModel.find(
          {users: {$all: [userId]}}, // chat which has length
          {_id: 1, users: 1, createdAt: 1, messages: 1}
        )
      } else {
        list = await chatModel.find(
          {users: {$all: [userId]}, "messages.0": {$exists: true}}, // chat which has length
          {_id: 1, users: 1, createdAt: 1, messages: {$slice: 1}}
        )
      }
      
      res.json(template.successRes(list))
    } catch(err) {
      next(err);
    }
  },
  async sendMessage(req, res, next) {
    try {
      let userId = String(req.user._id) // string, not an ObjectId
      let chatId = req.body.chatId.trim()
      let content = req.body.content.trim()
      let type = req.body.type
      let createdAt = new Date().toISOString()

      if (typeof(content) != "string")
        throw new Error("Content is not valid, must be a string")

      // let partnerId = req.user._id
      // if (!partnerId || typeof(partnerId) != 'string')
      //   throw new Error('Sending message failed!') 

      // let validId = await chatModel.exists({_id: chatId})
      //   if (!validId) 
      //     throw new Error('Invalid channel chat')
      let newMess = {
        owner: userId, 
        type: type,
        content: content,
        createdAt: createdAt
      }

      let data = await chatModel.findByIdAndUpdate(
        {_id: chatId},
        {$push: {messages: { $each: [newMess], $position: 0 }}},
        {
          fields: {_id: 1, users: 1, createdAt: 1, messages: {$slice: [0, 20]}},
          new: true
        }
      )
      // return 20 latest messages
      res.json(template.successRes(data));
    } catch (error) {
      next(error);
    }
  },
  async getMessage(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 20,
        chatId
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      if (!chatId)
        throw new Error("Missing chat id!")
        
      let data = await chatModel.findById(
        {_id: chatId},
        {_id: 1, users: 1, createdAt: 1, messages: {$slice: [skip, limit]}}
      )
      res.json(template.successRes(data));
    } catch (error) {
      next(error);
    }
  },
};

module.exports = chatHandler;