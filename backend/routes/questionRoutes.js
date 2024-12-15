const express = require("express");
const {
  fetchAllQuestions,
  fetchOneQuestion,
  fetchAllQuestionsByUser,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  updateViewCountOnQuestion,
} = require("../controllers/questionController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const banCheckMiddleware = require("../middleware/banCheckMiddleware.js");

const router = express.Router();

router.route("/").get(fetchAllQuestions);
router.route("/:id").get(fetchOneQuestion);
router.route("/byUser/:id").get(fetchAllQuestionsByUser);
router.route("/").post(authMiddleware, banCheckMiddleware, addQuestion);
router.route("/:id").put(authMiddleware, banCheckMiddleware, updateQuestion);
router.route("/:id").delete(authMiddleware, banCheckMiddleware, deleteQuestion);
router.route("/:id/viewed").post(updateViewCountOnQuestion);

module.exports = router;
