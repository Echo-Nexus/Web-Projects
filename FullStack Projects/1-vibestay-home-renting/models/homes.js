const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

module.exports = class Home {
  constructor(_id, homeName, image, description, location, price) {
    this.homeName = homeName;
    this.image = image;
    this.description = description;
    this.location = location;
    this.price = price;
    if (_id) {
      this._id = _id;
    }
  }

  save() {
    const db = getDb();

    if(this._id) {
      const updateData = {
        homeName: this.homeName, 
        image: this.image,
        description: this.description,
        location: this.location,
        price: this.price
      };

      return db.collection("homes").updateOne({_id: new ObjectId(String(this._id))}, {$set: updateData});
    }
    else {
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll(callback) {
    const db = getDb();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDb();
    return db.collection("homes").find({ _id: new ObjectId(String(homeId))}).next();
  }

  static deleteById(homeId, callback) {
    const db = getDb();
    return db.collection("homes").deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
