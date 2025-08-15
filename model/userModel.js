// importing mongoose
var mongoose = require("mongoose");

// schema creation
var userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: Number },
  profilePic: { type: String, default: "" }, // profile image URL
  bio: { type: String, default: "" },
  branch: { type: String }, // e.g., CSE, ECE, etc.
  year: { type: String }, // e.g., "3rd Year"
  skills: { type: [String], default: [] },

  // Connection system
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  requestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  requestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

  // userType: admin or user
  userType: { type: String, enum: ["admin", "user"], default: "user" },

  // timestamps
}, { timestamps: true });

// model creation
var userModel = mongoose.model("user", userSchema);
module.exports = userModel;


