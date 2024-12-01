const express = require("express");
const {
  fetchOneAnswer,
  fetchAllAnswersByQuestion,
  fetchAllAnswersByUser,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  voteOnAnswer,
} = require("../controllers/answerController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/:id").get(fetchOneAnswer);
router.route("/byQuestion/:id").get(fetchAllAnswersByQuestion);
router.route("/byUser/:id").get(fetchAllAnswersByUser);
router.route("/").post(authMiddleware, addAnswer);
router.route("/:id").put(authMiddleware, updateAnswer);
router.route("/:id").delete(authMiddleware, deleteAnswer);
router.route("/:id/vote").post(authMiddleware, voteOnAnswer);

module.exports = router;
