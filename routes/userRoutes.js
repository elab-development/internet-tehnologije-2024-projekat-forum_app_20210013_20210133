const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  promoteUserToAdmin,
} = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminCheckMiddleware = require("../middleware/adminCheckMiddleware.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router
  .route("/:id/promote")
  .put(authMiddleware, adminCheckMiddleware, promoteUserToAdmin);

module.exports = router;
