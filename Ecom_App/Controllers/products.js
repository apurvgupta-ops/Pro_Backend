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

exports.getAProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new Error("Product is not found"));
  }
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

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// TODO: CHECKING THE BUG : DESTROY IMAGE IS NOT WORKING
exports.adminUpdateAProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  // For images
  let imagesArray = [];

  if (!product) {
    return next(new Error("Product is not found"));
  }
  if (!req.files) {
    return next(new Error("Photos not found"));
  }
  if (req.files) {
    //For destroy the image
    for (let index = 0; index < product.photos.length; index++) {
      console.log(product.photos[index].id);
      const res = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
      // console.log("result-----------", res);
    }

    //upload the new image;
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        { folder: "products" }
      );
      imagesArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  console.log(imagesArray);
  req.body.photos = imagesArray;

  product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteAProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  //For multiple deletion
  for (let index = 0; index < product.photos.length; index++) {
    const imageid = product.photos[index].id;
    await cloudinary.v2.uploader.destroy(imageid);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Deletion Successful",
  });
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const AlreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (AlreadyReview) {
    product.reviews.forEach((review) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (review.rating = rating)((review.comment = comment));
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.review.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.deleteReviews = BigPromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const review = await Product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  const noOfReviews = review.length;
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.review.length;

  await Product.findByIdAndUpdate(
    productId,
    { review, noOfReviews, ratings },
    { new: true, useFindAndModify: false, runValidators: true }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getReviewForOneProduct = BigPromise(async (req, res, next) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);
  const review = product.review;
  res.status(200).json({ success: true, review });
});
