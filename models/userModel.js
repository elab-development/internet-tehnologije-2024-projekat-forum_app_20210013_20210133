const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long!"],
      maxlength: [30, "Username cannot exceed 30 characters!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    reputation: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastQuestionReward: {
      type: Date,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields.

module.exports = mongoose.model("User", userSchema);
