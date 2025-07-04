const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    jobTitle: { type: String },
    gender: { type: String },
  },
  { timestamps: true }
);

// Create User Model
const User = mongoose.model("User", userSchema);
module.exports = User;
