const express = require("express");
const router = express.Router();
const {
  createService,
  listService,
  updateService,
} = require("../controllers/service");

router.route("/create/:type").post(createService);
router.route("/list").get(listService);
router.route("/update/:type").patch(updateService);

module.exports = router;
