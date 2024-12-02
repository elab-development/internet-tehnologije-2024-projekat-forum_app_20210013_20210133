const Answer = require("../models/answerModel.js");
const Question = require("../models/questionModel.js");
const {
  handleNewVote,
  handleExistingVote,
} = require("../utilities/voteUtility.js");

// @desc    Fetches all answers.
// @route   GET /answers
// @access  Public
const fetchAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find().populate("author", "username").exec();
    res.status(200).send(answers);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// @desc    Fetches answer with id.
// @route   GET /answers/:id
// @access  Public
const fetchOneAnswer = async (req, res) => {
  const { id: answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId).populate(
      "author",
      "username"
    );

    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    res.status(200).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetches all answers on a question with id.
// @route   GET /answers/ofQuestion/:id
// @access  Public
const fetchAllAnswersByQuestion = async (req, res) => {
  const { id: questionId } = req.params;

  try {
    const answers = await Answer.find({ question: questionId }).populate(
      "author",
      "username"
    );

    res.status(200).json(answers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetches all answers of a user with id.
// @route   GET /answers/ofUser/:id
// @access  Public
const fetchAllAnswersByUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const answers = await Answer.find({ author: userId }).populate(
      "question",
      "title"
    );

    res.status(200).json(answers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Adds a new answer.
// @route   POST /answers
// @access  User only
const addAnswer = async (req, res) => {
  const { body, questionId } = req.body;

  try {
    const newAnswer = new Answer({
      body,
      author: req.user._id, // authMiddleware populates req.user field.
      question: questionId,
    });
    await newAnswer.save();

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });

    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Updates an answer with id.
// @route   PUT /answers/:id
// @access  User only
const updateAnswer = async (req, res) => {
  const { id: answerId } = req.params;
  const { body } = req.body;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    // Checks if user is the author. authMiddleware populates req.user field.
    if (answer.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this answer!" });

    answer.body = body;
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Deletes an answer with id.
// @route   DELETE /answers/:id
// @access  User only
const deleteAnswer = async (req, res) => {
  const { id: answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    // Checks if user is admin or the author. authMiddleware populates req.user field.
    if (
      !req.user.isAdmin &&
      answer.author.toString() !== req.user._id.toString()
    )
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this answer!" });

    await Answer.findByIdAndDelete(answerId);

    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answerId },
    });

    res.status(200).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Updates the votes on an answer with id.
// @route   POST /answers/:id/vote
// @access  User only
const voteOnAnswer = async (req, res) => {
  const { id: answerId } = req.params;
  const { vote } = req.body;
  const userId = req.user._id; // authMiddleware populates req.user field.

  if (vote !== "upvote" && vote !== "downvote")
    return res.status(400).json({ message: "Invalid vote option!" });

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    const existingVote = answer.userVotes.find(
      (v) => v.userId.toString() === userId.toString()
    );

    if (!existingVote) return await handleNewVote(vote, userId, answer, res);

    return await handleExistingVote(existingVote, vote, userId, answer, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  fetchAllAnswers,
  fetchOneAnswer,
  fetchAllAnswersByQuestion,
  fetchAllAnswersByUser,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  voteOnAnswer,
};
