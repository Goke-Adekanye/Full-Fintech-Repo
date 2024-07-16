const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization invalid" });
  }
  // extract token
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email: payload.email };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization invalid" });
  }
};

module.exports = auth;
