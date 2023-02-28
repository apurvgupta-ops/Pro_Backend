const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  name: String,
  googleId: String,
  email: String,
});

module.exports = mongoose.model("Auth", authSchema);
