const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { validateRequestBody } = require("../utils/utils");
const User = require("../models/User");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const register = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(userSchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const { email } = req.body;
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email already in use!" });
    }

    const newUser = await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).json();
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Registration failed. Please try again." });
  }
};

const login = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(userSchema, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid email, Try again!" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid password, Try again!" });
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Login failed, Try again!" });
  }
};

module.exports = {
  register,
  login,
};
