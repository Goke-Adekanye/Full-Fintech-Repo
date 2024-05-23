const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Joi = require("joi");
const { validateRequestBody } = require("../utils/utils");

const getLoggedInUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Not authorized to access resources" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

const usernameSchema = Joi.object({
  username: Joi.string().required(),
});

const updateUsername = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(usernameSchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const userId = req.user.userId;
    const { username } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error updating username" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

module.exports = {
  getLoggedInUser,
  updateUsername,
};
