const { StatusCodes } = require("http-status-codes");
const { User } = require("../models/user");

const getLoggedInUser = async (req, res) => {
  const email = req.user.email;

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Not Authorized" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  getLoggedInUser,
};
