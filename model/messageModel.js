var mongoose = require("mongoose");

// schema creation
var messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// model creation
var messageModel = mongoose.model("message", messageSchema);
module.exports = messageModel;
