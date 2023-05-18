const mongoose = require('mongoose');

const mongoDB = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "chatingDB"
  };
  
  mongoose.connect(process.env.MONGO_DB_CLIENT_URL, connectionParams)
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((error) => {
      console.log('MongoDB connection error:', error);
    });
};




module.exports = mongoDB;
