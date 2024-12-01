const express = require("express");
const {
  fetchAllQuestions,
  fetchOneQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  updateViewCountOnQuestion,
} = require("../controllers/questionController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").get(fetchAllQuestions);
router.route("/:id").get(fetchOneQuestion);
router.route("/").post(authMiddleware, addQuestion);
router.route("/:id").put(authMiddleware, updateQuestion);
router.route("/:id").delete(authMiddleware, deleteQuestion);
router.route("/:id/viewed").post(updateViewCountOnQuestion);

module.exports = router;
