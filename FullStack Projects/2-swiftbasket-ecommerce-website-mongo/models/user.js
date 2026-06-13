const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Guest', 'Admin'],
    default: 'Guest'
  }, 
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products"
  }]
});

module.exports = mongoose.model("Users", userSchema);