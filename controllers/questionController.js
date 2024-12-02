const Question = require("../models/questionModel.js");

// @desc    Fetches all questions.
// @route   GET /questions
// @access  Public
const fetchAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author").exec();
    res.status(200).send(questions);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// @desc    Fetches question with id.
// @route   GET /questions/:id
// @access  Public
const fetchOneQuestion = async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await Question.findById(questionId)
      .populate("author")
      .exec();

    if (!question) return res.status(404).send("Question not found!");

    res.status(200).send(question);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// @desc    Adds a new question.
// @route   POST /questions
// @access  Public
const addQuestion = async (req, res) => {
  const { title, body } = req.body;

  try {
    const newQuestion = new Question({
      title,
      body,
      author: req.user._id, // authMiddleware populates req.user field.
    });

    await newQuestion.save();
    res.status(201).send(newQuestion);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @desc    Updates a question with id.
// @route   PUT /questions/:id
// @access  Public
const updateQuestion = async (req, res) => {
  const questionId = req.params.id;
  const { title, body } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).send("Question not found!");

    // Checks if user is the author. authMiddleware populates req.user field.
    if (question.author.toString() !== req.user._id.toString())
      return res.status(403).send("Unauthorized to update this question!");

    question.title = title;
    question.body = body;
    await question.save();

    res.status(200).send(question);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @desc    Deletes a question with id.
// @route   DELETE /questions/:id
// @access  Public
const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).send("Question not found!");

    // Checks if user is admin or the author. authMiddleware populates req.user field.
    if (
      !req.user.isAdmin &&
      question.author.toString() !== req.user._id.toString()
    )
      return res.status(403).send("Unauthorized to delete this question!");

    await question.deleteOne();
    res.status(200).send(question);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @desc    Updates the view count for question with id.
// @route   POST /questions/:id/viewed
// @access  Public
const updateViewCountOnQuestion = async (req, res) => {
  const questionId = req.params.id;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedQuestion)
      return res.status(404).json({ message: "Question not found!" });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  fetchAllQuestions,
  fetchOneQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  updateViewCountOnQuestion,
};
