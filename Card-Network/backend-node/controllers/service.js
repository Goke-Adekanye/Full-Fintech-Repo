const { StatusCodes } = require("http-status-codes");

const createService = async (req, res) => {
  const email = req.user.email;

  res.status(StatusCodes.OK).json({ email, message: "Create" });
};

const listService = async (req, res) => {
  const email = req.user.email;

  res.status(StatusCodes.OK).json({ email, message: "List" });
};

const updateService = async (req, res) => {
  const email = req.user.email;

  res.status(StatusCodes.OK).json({ email, message: "Update" });
};

module.exports = {
  createService,
  listService,
  updateService,
};
