const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Registers a new user.
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

    res.status(201).json({ message: "User registered successfully!" });
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

    res.status(200).json({ token });
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

module.exports = { registerUser, loginUser, logoutUser };
