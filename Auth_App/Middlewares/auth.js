const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  //   console.log(req.cookies);
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer", "");
  //   console.log(token);

  if (!token) {
    res.status(400).send("Token is missing");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    console.log(decode);
  } catch (error) {
    console.log(error);
  }
  return next();
};

module.exports = auth;
