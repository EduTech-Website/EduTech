//check if demo user
exports.isDemo = async (req, res, next) => {
  console.log(req.user.email);
  if (req.user.email === "" || req.user.email === "") {
    return res.status(401).json({
      success: false,
      message: "This is a Demo User",
    });
  }
  next();
};
