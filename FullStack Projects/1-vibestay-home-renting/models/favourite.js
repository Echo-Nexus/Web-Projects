const {getDb} = require("../utils/database");

module.exports = class Favourite {
   constructor(homeId) {
   this.homeId = homeId;
  }

  save() {
    const db = getDb();
    return db.collection("favourites").findOne({homeId: this.homeId}).then(existingFavourite => {
      if(!existingFavourite) {
           return db.collection("favourites").insertOne(this);
      }
      return Promise.resolve();
    });
  }

  static getFavourites(callback) {
    const db = getDb();
    return db.collection("favourites").find().toArray();
  }

  static deleteFromFavourite(homeId, callback) {
   const db = getDb();
   return db.collection("favourites").deleteOne({ homeId: homeId});
  }
};