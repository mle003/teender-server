let userModel = require('../auth/model')
const template = require('../template');
const { hashMd5, signToken, verifyToken } = require("../utils");

const handlers = {
  async resetPassword(req, res, next) {
    try {
      let user = req.user
      let oldPw = req.body.old_password
      let newPw = req.body.new_password

      let hashedOldPassword = hashMd5(String(oldPw));
      let hashedNewPassword = hashMd5(String(newPw)); 

      if (!oldPw)
        throw new Error("Old password is required") 
      if (!newPw)
        throw new Error("New password is required") 
      if (hashedOldPassword != user.password)
        throw new Error("Old password is not correct!") 
      if (typeof newPw != "string" || !(newPw.length >= 6 && newPw.length <= 30))
        throw new Error("Invalid password! Password must be between 6 and 30");

      await userModel.updateOne(
        {_id: user._id },
        { password: hashedNewPassword}
      )
      
      res.json(template.successRes(''))
    } catch(e) {next(e)}
  },
}

module.exports = handlers