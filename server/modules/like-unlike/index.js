const userModel = require("../auth/model");
const { verifyToken } = require("../utils");
const template = require("../template");

let likeHandler = {
  async likeAndUnlike(req, res, next) {
    try {
      let status = req.body.status;
      let likeId = req.body._id;
      let accessToken = req.headers.authorization;

      if (accessToken) {
        let userData = verifyToken(accessToken);
        req.user = await userModel.findById(userData._id);
      } else {
        throw new Error("Nguời dùng chưa xác thực");
      }
      let userId = req.user._id;

      let user = await userModel.findById(userId);
      

      switch (status) {
        case "like":
          await userModel.updateOne(
            { _id: userId },
            { $addToSet: { like: likeId } }
          );
          // let user = await userModel.updateOne({_id: userId},{ like: []  });
          await userModel.updateOne(
            { _id: likeId },
            { $addToSet: { likedBy: userId } }
          );
          // let likeBy = await userModel.updateOne({ _id: likeId }, { likedBy: [] });

          break;

        case "unlike":
          // let like = user.like;
          // if (!like.indexOf(likeId)) {
          //   like.splice(like.indexOf(likeId), 1);
          //   await userModel.updateOne({ _id: userId }, { like: like });
          // }
          await userModel.updateOne(
            { _id: userId },
            { $addToSet: { unlike: likeId } }
          );
          break;
      }

      res.json(template.successRes(user.toObject()));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = likeHandler;
