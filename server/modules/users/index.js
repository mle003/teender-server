let model = require('../auth/model')
const { verifyToken } = require("../utils");
const template = require('../template')

const handlers = {
  async getUsers(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 10,
      } = req.query

      let accessToken = req.headers.authorization;

      if (accessToken) {
        let userData = verifyToken(accessToken);
        req.user = await model.findById(userData._id);
      } else {
        throw new Error('Nguời dùng chưa xác thực')
      }
      // count = !!count
      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      let interest = req.user.info.interest
      let gender = req.user.info.gender

      if(!req.user.like) 
        req.user.like = []
      if(!req.user.unlike) 
        req.user.unlike = []
      
      let like = req.user.like
      let unlike = req.user.unlike
      let metUsers = [...like, ...unlike, req.user._id]
      let conditions = {
        'info.gender': interest, 
        'info.interest': gender, 
        '_id': {$nin: metUsers}
      }
      let items = await model
        .find(conditions, {info: 1})
        .skip(skip)
        .limit(limit)

      res.json(template.successRes(items))
    } catch(e) {next(e)}
  }
}

module.exports = handlers