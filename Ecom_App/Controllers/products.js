const cloudinary = require("cloudinary");
const Product = require("../Models/products");
const BigPromise = require("../Middlewares/BigPromise");
const WhereClause = require("../Utils/WhereClause.js");

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

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;

  const totalProducts = await Product.countDocuments();

  //Where Clause return an Object
  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;

  productsObj.pager(resultPerPage);

  //if we dont use clone then it show an error "query is aleady executed" and this error when we put await in productsObj.base without await query is running perfect
  products = await productsObj.base.clone();

  const filteredProducts = await products.length;

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    filteredProducts,
  });
});
