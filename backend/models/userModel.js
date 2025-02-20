const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  aadharCard: String,
  drivingLicense: String,
});

module.exports = mongoose.model("User", UserSchema);
