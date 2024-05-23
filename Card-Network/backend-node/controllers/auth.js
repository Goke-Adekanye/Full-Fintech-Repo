const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { CreateUser, GetUser } = require("../db/user");
const { validateRequestBody } = require("../utils/utils");

const userValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const register = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(userValidation, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    await CreateUser(req.body);
    res.status(StatusCodes.CREATED).json();
  } catch (err) {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let errorMessage = err.message;

    if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
      errorMessage = "Registration failed. Please try again.";
    }
    res.status(statusCode).json({ error: errorMessage });
  }
};

const login = async (req, res) => {
  try {
    // Validate the request body
    const validationError = validateRequestBody(userValidation, req.body);
    if (validationError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validationError });
    }

    const { email, password } = req.body;
    const { user, userFound } = await GetUser(email);
    if (!userFound) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid credentials" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Login failed. Please try again." });
  }
};

module.exports = {
  register,
  login,
};
