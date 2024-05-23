const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transferSchema = new Schema({
  from_account_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Account",
  },
  to_account_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Account",
  },
  amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transfer", transferSchema);
