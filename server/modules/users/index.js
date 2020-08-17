let userModel = require('../auth/model')
const template = require('../template');

const handlers = {
  async getCards(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 10,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)

      let user = req.user

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

      let validId = await userModel.exists({_id: likeId})
      if (!validId) 
        throw new Error('Invalid userId')

      let user = req.user;
      let userId = req.user._id;

      let myMetUsers = [...req.user.like, ...req.user.unlike]
      if (myMetUsers.includes(likeId))
        throw new Error('This person has already be in your list. Something went wrong.')
      if (likeId == userId)
        throw new Error('The person you have swiped is you. Something went wrong.')

      let data = []
      switch (status) {
        case "like":
          await userModel.updateOne(
            { _id: userId },
            { $push: { like: { $each: [likeId], $position: 0 } } }
          );
          await userModel.updateOne(
            { _id: likeId },
            { $push: { likedBy: { $each: [userId], $position: 0 } } }
          );

          data = user.like
          if (!data.includes(likeId)) data.unshift(likeId)
          console.log(data)

          // --------------------
          let thatUser = await userModel.findById(likeId);
          if (thatUser.like.includes(userId)) {

            // template match Data
            function matchData(id) {
              return {
                _id: id,
                createdAt: new Date().toISOString()
              }
            }

            await userModel.updateOne(
              { _id: userId },
              { $push: { match: { $each: [matchData(likeId)], $position: 0 } } }
            );
            await userModel.updateOne(
              { _id: likeId },
              { $push: { match: { $each: [matchData(userId)], $position: 0 } } }
            );
          }
          // --------------------
          break;
        case "unlike":
          await userModel.updateOne(
            { _id: userId },
            { $push: { unlike: { $each: [likedId], $position: 0 } } }
          );
          data = user.unlike
          if (!data.includes(likeId)) data.unshift(likeId)
          break;
        default: 
          throw new Error('Invalid value. Must be either "like" or "unlike".')
      }
      res.json(template.successRes(data));
    } catch (err) {
      err.status = 400
      next(err);
    }
  },
  async getMatches(req, res, next) {
    try {
      let { 
        pageIndex = 1, 
        pageSize = 10,
      } = req.query

      let skip = eval((pageIndex - 1) * pageSize)
      let limit = eval(pageSize)
      let user = req.user

      // let match = []
      // for (let item in user.like) {
      //   if (user.likedBy.includes(item)) {
      //     match.unshift(item)
      //   }
      // }
      let listMatchId = user.match.map(el => el._id)
      let conditions = {
        '_id': {$in: listMatchId}
      }
      let matchItems = await userModel
        .find(conditions, {info: 1})
        .skip(skip)
        .limit(limit)

      res.json(template.successRes(matchItems));
    } catch(err) {
      next(err)
    }
  }
}

module.exports = handlers