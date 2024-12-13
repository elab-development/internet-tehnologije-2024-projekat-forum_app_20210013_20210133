const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      minlength: [5, "Title must be at least 5 characters long!"],
      maxlength: [100, "Title cannot exceed 100 characters!"],
    },
    body: {
      type: String,
      required: [true, "Body is required!"],
      minlength: [5, "Body must be at least 5 characters long!"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields.

module.exports = mongoose.model("Question", questionSchema);
