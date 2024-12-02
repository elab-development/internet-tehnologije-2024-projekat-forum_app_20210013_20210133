const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Fetches all users ( with optional filters).
// @route   GET /users
// @access  Public
const fetchAllUsers = async (req, res) => {
  const { isAdmin, isBanned } = req.query;

  try {
    const filter = {};

    if (isAdmin !== undefined) filter.isAdmin = isAdmin === "true";
    if (isBanned !== undefined) filter.isBanned = isBanned === "true";

    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetches user with id.
// @route   GET /users/:id
// @access  Public
const fetchOneUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password").exec();

    if (!user) return res.status(404).send("User not found!");

    res.status(200).send(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// @desc    Registers a user in.
// @route   POST /users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (password.length < 5) {
      return res
        .status(401)
        .json({ message: "Password must be at least 5 characters long!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const userToSend = newUser.toObject();
    delete userToSend.password;

    res.status(201).json(userToSend);
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc    Logs a user in.
// @route   POST /users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });

    const userToSend = user.toObject();
    delete userToSend.password;

    res.status(200).json({ user: userToSend, token: token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc    Logs a user out.
// @route   POST /users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({ message: "User successfully logged out!" });
};

// @desc    Promotes user to an admin.
// @route   PUT /users/:id/promote
// @access  Admin only
const promoteUserToAdmin = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.isAdmin)
      return res.status(200).json({ message: "User already an admin!" });

    if (user.isBanned)
      return res.status(200).json({
        message: "This user is banned! Unban them first then promote to admin!",
      });

    user.isAdmin = true;
    await user.save();

    const userToSend = user.toObject();
    delete userToSend.password;

    res.status(200).json(userToSend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bans a user.
// @route   PUT /users/:id/ban
// @access  Admin only
const banUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.isAdmin)
      return res
        .status(401)
        .json({ message: "Operation illegal because user is an admin!" });

    if (user.isBanned)
      return res.status(200).json({ message: "User already banned!" });

    user.isBanned = true;
    await user.save();

    const userToSend = user.toObject();
    delete userToSend.password;

    res.status(200).json(userToSend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unbans a user.
// @route   PUT /users/:id/unban
// @access  Admin only
const unbanUser = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.isAdmin)
      return res
        .status(401)
        .json({ message: "Operation illegal because user is an admin!" });

    if (!user.isBanned)
      return res.status(200).json({ message: "User was not banned!" });

    user.isBanned = false;
    await user.save();

    const userToSend = user.toObject();
    delete userToSend.password;

    res.status(200).json(userToSend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  fetchAllUsers,
  fetchOneUser,
  registerUser,
  loginUser,
  logoutUser,
  promoteUserToAdmin,
  banUser,
  unbanUser,
};
