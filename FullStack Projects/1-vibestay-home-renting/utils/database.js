const mongo = require("mongodb").MongoClient;
const url =
  "mongodb+srv://sparky:PasserBy@sparky.xsjatfd.mongodb.net/?appName=Sparky";

  let _db;
const connect_db = (callback) => {
  mongo.connect(url)
    .then((client) => {
      callback();
      _db = client.db('vibestay');
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
    });
};

const getDb = () => {
    if(!_db) {
        throw new Error("Database not connected");
    }
    return _db;
}


exports.getDb = getDb;
exports.connect_db = connect_db;