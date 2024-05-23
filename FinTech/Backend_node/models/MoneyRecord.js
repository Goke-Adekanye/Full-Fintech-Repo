const mongoose = require("mongoose");

const moneyRecordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reference: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },
  status: {
    type: String,
    // enum: ["declined", "success", "pending"],
    default: "pending",
    maxlength: 50,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("MoneyRecord", moneyRecordSchema);
