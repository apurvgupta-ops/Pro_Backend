const mongoose = require("mongoose");

const socialAuthSchema = mongoose.Schema({
  name: String,
  googleId: String,
  email: String,
});

module.exports = mongoose.model("SocialAuth", socialAuthSchema);
