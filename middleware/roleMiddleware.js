const restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perfom this action",
      });
    }
    next();
  };
};
module.exports = {
  restrictTo,
};
