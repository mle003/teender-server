const request = require("request");
let template = require("../template");
const IMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5"

async function uploadImage(req, res, next) {
  try {
    let base64Code = req.body.source
    const api = "https://freeimage.host/api/1/upload" + "?key=" + IMAGE_API_KEY

    request.post(
      {url: api, formData: {source: base64Code}}, 
      function optionalCallback(err, httpResponse, body) {
        if (err) 
          throw err
      let response = JSON.parse(body)

      if (response.status_code != 200)
        throw new Error(response.error.message || "Something went wrong")

      res.json(template.successRes(response.image.image))
    });

  } catch (err) {
    console.log(err)
    next(err)
  }
}


module.exports = uploadImage;