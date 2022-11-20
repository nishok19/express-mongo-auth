const mongoose = require("mongoose");
const { URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the Database");
    })
    .catch((err) => {
      console.log("Error connecting to the database -> ", err);
      process, exit(1);
    });
};
