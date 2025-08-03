var mongoose = require("mongoose");

// schema creation
var suggestionSchema = mongoose.Schema({
  suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  suggestedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "post", default: null }, // optional
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// model creation
var suggestionModel = mongoose.model("suggestion", suggestionSchema);
module.exports = suggestionModel;
