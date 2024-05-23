const express = require("express");
const router = express.Router();
const { getLoggedInUser, updateUsername } = require("../controllers/user");

router.route("/me").get(getLoggedInUser);
router.route("/username").patch(updateUsername);

module.exports = router;
