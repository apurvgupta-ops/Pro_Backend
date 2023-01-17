const cloudinary = require("cloudinary");
const Product = require("../Models/products");
const BigPromise = require("../Middlewares/BigPromise");

exports.addProduct = BigPromise(async (req, res, next) => {
  let imageArray = [];
  if (!req.files) {
    return next(new Error("Images are requried"));
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        { folder: "products" }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});
