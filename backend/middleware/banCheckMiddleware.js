const banCheckMiddleware = (req, res, next) => {
  try {
    if (req.user.isBanned && !req.user.isAdmin)
      return res.status(403).json({ message: "Your account has been banned!" });

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while checking if user is banned!" });
  }
};

module.exports = banCheckMiddleware;
