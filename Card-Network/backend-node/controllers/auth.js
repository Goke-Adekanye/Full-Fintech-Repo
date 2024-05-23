const { StatusCodes } = require("http-status-codes");

const register = (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Register" });
};

const login = (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Login" });
};

module.exports = {
  register,
  login,
};
