let userModel = require('../auth/model')
const authHandlers = require("../auth");
const template = require('../template');
const { verifyToken } = require('../utils');

const handlers = {
  async getCards(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 10,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      let user = await userModel.findById(req.user._id);

      let interest = user.info.interest
      let gender = user.info.gender

      if(!user.like) 
        user.like = []
      if(!user.unlike) 
        user.unlike = []
      
      let like = user.like
      let unlike = user.unlike
      let metUsers = [...like, ...unlike, user._id]
      let conditions = {
        'info.gender': interest, 
        'info.interest': gender, 
        '_id': {$nin: metUsers}
      }
      let items = await userModel
        .find(conditions, {info: 1})
        .skip(skip)
        .limit(limit)

      res.json(template.successRes(items))
    } catch(e) {next(e)}
  },
  async likeAndUnlike(req, res, next) {
    try {
      let status = req.body.status;
      let likeId = req.body._id;

      let user = req.user;
      let userId = req.user._id;
      let data = []
      
      switch (status) {
        case "like":
          await userModel.updateOne(
            { _id: userId },
            { $addToSet: { like: likeId } }
          );
          await userModel.updateOne(
            { _id: likeId },
            { $addToSet: { likedBy: userId } }
          );
          data = user.like
          if (!data.includes(likeId)) data.push(likeId)
          break;

        case "unlike":
          await userModel.updateOne(
            { _id: userId },
            { $addToSet: { unlike: likeId } }
          );
          data = user.unlike
          if (!data.includes(likeId)) data.push(likeId)
          break;
        default: 
          throw new Error('Invalid value. Must be either "like" or "unlike".')
      }
      res.json(template.successRes(data));
    } catch (err) {
      next(err);
    }
  },
}

module.exports = handlers