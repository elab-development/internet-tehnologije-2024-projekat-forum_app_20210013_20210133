const express = require("express");
const {
  fetchAllAnswers,
  fetchOneAnswer,
  fetchAllAnswersByQuestion,
  fetchAllAnswersByUser,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  voteOnAnswer,
} = require("../controllers/answerController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const banCheckMiddleware = require("../middleware/banCheckMiddleware.js");

const router = express.Router();

router.route("/").get(fetchAllAnswers);
router.route("/:id").get(fetchOneAnswer);
router.route("/byQuestion/:id").get(fetchAllAnswersByQuestion);
router.route("/byUser/:id").get(fetchAllAnswersByUser);
router.route("/").post(authMiddleware, banCheckMiddleware, addAnswer);
router.route("/:id").put(authMiddleware, banCheckMiddleware, updateAnswer);
router.route("/:id").delete(authMiddleware, banCheckMiddleware, deleteAnswer);
router
  .route("/:id/vote")
  .post(authMiddleware, banCheckMiddleware, voteOnAnswer);

module.exports = router;
