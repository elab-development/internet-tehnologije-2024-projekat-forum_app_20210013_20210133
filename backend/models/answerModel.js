const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Answer body is required!"],
      minlength: [1, "Body must be at least 1 character long!"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    totalVoteScore: {
      type: Number,
      default: 0,
    },
    userVotes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        vote: { type: String, enum: ["upvote", "downvote"], required: true },
      },
    ],
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields.

module.exports = mongoose.model("Answer", answerSchema);
