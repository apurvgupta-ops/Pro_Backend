const mongoose = require("mongoose");

const { MONGO_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then(console.log(`DB CONNECTED SUCCESSFULLY`))
    .catch((error) => {
      console.log(`DB CONNECTION FAILED`);
      console.log(error);
      process.exit(1);
    });
};
