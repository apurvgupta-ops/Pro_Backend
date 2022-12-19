const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " Please enter the name field"],
      maxlength: [15, "Please Enter your name under 40 characters"],
    },
    email: {
      type: String,
      required: [true, " Please enter an email"],
      validate: [
        validator.isEmail,
        "Please enter your email in correct format",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, " Please enter a password"],
      minlength: [5, "Please Enter your password more than 5 characters"],
      select: false, // this same as password == undefined it means password is not showing in the results
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

//pre hook => take actions before saving in database
//change the password in hash format before saving
// isModified is used because when only this field get change then only this hook calls, without this when ever any field get chaanged then this hooks calls and the encryption cycles again and again and create the mess, thats why we use isModified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//compare the password
userSchema.methods.isPasswordMatch = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

//jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//Random strings for forget Password
userSchema.methods.getForgetPasswordToken = async function () {
  const forgetToken = crypto.randomBytes(20).toString("hex");

  //creating hash so that we can store in the database
  this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(forgetToken)
    .digest("hex");

  return forgetToken;
};

module.exports = mongoose.model("User", userSchema);
