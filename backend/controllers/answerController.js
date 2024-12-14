const Answer = require("../models/answerModel.js");
const Question = require("../models/questionModel.js");
const {
  handleNewVote,
  handleExistingVote,
} = require("../utilities/voteUtility.js");

// @desc    Fetches all answers ( with optional filters and pagination).
// @route   GET /answers
// @access  Public
const fetchAllAnswers = async (req, res) => {
  const {
    createdAfter,
    createdBefore,
    updatedAfter,
    updatedBefore,
    minTotalVoteScore,
    maxTotalVoteScore,
    page,
    limit,
  } = req.query;

  try {
    const filter = {};

    // Filters for total vote score.
    if (minTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $gte: Number(minTotalVoteScore),
      };
    if (maxTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $lte: Number(maxTotalVoteScore),
      };

    // Filters for created at.
    if (createdAfter !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $gte: new Date(createdAfter),
      };
    if (createdBefore !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $lte: new Date(createdBefore),
      };

    // Filters for updated at.
    if (updatedAfter !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $gte: new Date(updatedAfter),
      };
    if (updatedBefore !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $lte: new Date(updatedBefore),
      };

    let answers = await Answer.find(filter)
      .populate("author", "username")
      .populate("question", "title")
      .populate("userVotes")
      .lean()
      .sort({ createdAt: -1 });

    if (!page || !limit || page <= 0 || limit <= 0)
      return res.status(200).json(answers);

    // Pagination
    const skip = (page - 1) * limit;
    const answersLength = answers.length;
    answers = answers.slice(skip, skip + Number(limit));

    res.status(200).json({
      total: answersLength,
      page: Number(page),
      totalPages: Math.ceil(answersLength / limit),
      answers,
    });
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
    const answer = await Answer.findById(answerId)
      .populate("author", "username")
      .populate("question", "title")
      .populate("userVotes");

    if (!answer) return res.status(404).json({ message: "Answer not found!" });

    res.status(200).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetches all answers on a question with id ( with optional filters and pagination).
// @route   GET /answers/ofQuestion/:id
// @access  Public
const fetchAllAnswersByQuestion = async (req, res) => {
  const {
    createdAfter,
    createdBefore,
    updatedAfter,
    updatedBefore,
    minTotalVoteScore,
    maxTotalVoteScore,
    page,
    limit,
  } = req.query;

  const { id: questionId } = req.params;

  try {
    const filter = {};

    // Filters for total vote score.
    if (minTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $gte: Number(minTotalVoteScore),
      };
    if (maxTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $lte: Number(maxTotalVoteScore),
      };

    // Filters for created at.
    if (createdAfter !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $gte: new Date(createdAfter),
      };
    if (createdBefore !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $lte: new Date(createdBefore),
      };

    // Filters for updated at.
    if (updatedAfter !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $gte: new Date(updatedAfter),
      };
    if (updatedBefore !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $lte: new Date(updatedBefore),
      };

    let answers = await Answer.find({ question: questionId, ...filter })
      .populate("userVotes")
      .populate("author", "username")
      .lean()
      .sort({ createdAt: -1 });

    if (!page || !limit || page <= 0 || limit <= 0)
      return res.status(200).json(answers);

    // Pagination
    const skip = (page - 1) * limit;
    const answersLength = answers.length;
    answers = answers.slice(skip, skip + Number(limit));

    res.status(200).json({
      total: answersLength,
      page: Number(page),
      totalPages: Math.ceil(answersLength / limit),
      answers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetches all answers of a user with id ( with optional filters and pagination).
// @route   GET /answers/ofUser/:id
// @access  Public
const fetchAllAnswersByUser = async (req, res) => {
  const {
    createdAfter,
    createdBefore,
    updatedAfter,
    updatedBefore,
    minTotalVoteScore,
    maxTotalVoteScore,
    page,
    limit,
  } = req.query;

  const { id: userId } = req.params;

  try {
    const filter = {};

    // Filters for total vote score.
    if (minTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $gte: Number(minTotalVoteScore),
      };
    if (maxTotalVoteScore !== undefined)
      filter.totalVoteScore = {
        ...(filter.totalVoteScore || {}),
        $lte: Number(maxTotalVoteScore),
      };

    // Filters for created at.
    if (createdAfter !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $gte: new Date(createdAfter),
      };
    if (createdBefore !== undefined)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $lte: new Date(createdBefore),
      };

    // Filters for updated at.
    if (updatedAfter !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $gte: new Date(updatedAfter),
      };
    if (updatedBefore !== undefined)
      filter.updatedAt = {
        ...(filter.updatedAt || {}),
        $lte: new Date(updatedBefore),
      };

    let answers = await Answer.find({ author: userId, ...filter })
      .populate("question", "title")
      .populate("userVotes")
      .lean()
      .sort({ createdAt: -1 });

    if (!page || !limit || page <= 0 || limit <= 0)
      return res.status(200).json(answers);

    // Pagination
    const skip = (page - 1) * limit;
    const answersLength = answers.length;
    answers = answers.slice(skip, skip + Number(limit));

    res.status(200).json({
      total: answersLength,
      page: Number(page),
      totalPages: Math.ceil(answersLength / limit),
      answers,
    });
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

    const populatedAnswer = await Answer.findById(newAnswer._id).populate(
      "author",
      "username"
    );

    res.status(201).json(populatedAnswer);
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
    const answer = await Answer.findById(answerId).populate("userVotes");
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
