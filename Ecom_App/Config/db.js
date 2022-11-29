const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      usenewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB connected"))
    .catch((error) => {
      console.log("DB failed");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connect;
