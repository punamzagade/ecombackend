const mongoose = require("mongoose");

const ForgotPassSchema = new mongoose.Schema({
  uid:{ type: String, required:true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("ForgotPass", ForgotPassSchema);
