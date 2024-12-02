const checkIfAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "Only admins can perform this operation!" });

    next();
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = checkIfAdmin;
