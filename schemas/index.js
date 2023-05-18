const mongoose = require("mongoose");

const mongoDB = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.MONGO_DB_CLIENT_URL, connectionParams);
    console.log("mongo connected");
  } catch (error) {
    console.log(error);
    console.log("mongo connect error");
  }
};
module.exports = mongoDB;
