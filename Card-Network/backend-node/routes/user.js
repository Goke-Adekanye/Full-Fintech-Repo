const express = require("express");
const router = express.Router();
const { getLoggedInUser } = require("../controllers/user");

router.route("/me").get(getLoggedInUser);

module.exports = router;
