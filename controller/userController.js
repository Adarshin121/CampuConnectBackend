const User = require("../model/userModel");
const mongoose = require('mongoose');
const Message = require("../model/chatModel");

// Register new user
exports.signup = async (req, res) => {
  try {
    await User(req.body).save();
    res.json({ message: "User created", User });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.json({ error: "Invalid credentials" });
    res.json({ message: "Login success", user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "User updated", updated });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Send connection request
exports.sendRequest = async (req, res) => {
  const { fromId, toId } = req.body;
  try {
    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);
    if (!fromUser || !toUser) return res.json({ error: "Users not found" });

    fromUser.requestsSent.push(toId);
    toUser.requestsReceived.push(fromId);
    await fromUser.save();
    await toUser.save();

    res.json({ message: "Request sent" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Accept connection request
exports.acceptRequest = async (req, res) => {
  const { fromId, toId } = req.body;
  try {
    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);

    if (!fromUser || !toUser) return res.json({ error: "Users not found" });

    // Add to connections
    fromUser.connections.push(toId);
    toUser.connections.push(fromId);

    // Remove from requests
    fromUser.requestsSent = fromUser.requestsSent.filter(id => id != toId);
    toUser.requestsReceived = toUser.requestsReceived.filter(id => id != fromId);

    await fromUser.save();
    await toUser.save();

    res.json({ message: "Connection request accepted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
// Additional needed APIs for connection system

// Get received requests for a user
exports.getReceivedRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('requestsReceived', 'name profilePic branch year')
      .select('requestsReceived');
    
    res.json(user.requestsReceived);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get sent requests for a user
exports.getSentRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('requestsSent', 'name profilePic branch year')
      .select('requestsSent');
    
    res.json(user.requestsSent);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Reject connection request
exports.rejectRequest = async (req, res) => {
  const { requestId, userId } = req.body;
  try {
    const requester = await User.findById(requestId);
    const receiver = await User.findById(userId);

    if (!requester || !receiver) return res.json({ error: "Users not found" });

    // Remove from requests
    requester.requestsSent = requester.requestsSent.filter(id => id != userId);
    receiver.requestsReceived = receiver.requestsReceived.filter(id => id != requestId);

    await requester.save();
    await receiver.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Cancel sent request
exports.cancelRequest = async (req, res) => {
  const { requestId, userId } = req.body;
  try {
    const requester = await User.findById(userId);
    const receiver = await User.findById(requestId);

    if (!requester || !receiver) return res.json({ error: "Users not found" });

    // Remove from requests
    requester.requestsSent = requester.requestsSent.filter(id => id != requestId);
    receiver.requestsReceived = receiver.requestsReceived.filter(id => id != userId);

    await requester.save();
    await receiver.save();

    res.json({ message: "Request cancelled" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get user connections
exports.getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('connections', 'name profilePic branch year');
    res.json(user.connections || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Chat History
exports.getChatHistory = async (req, res) => {
  try {
    const userId1 = new mongoose.Types.ObjectId(req.params.userId1);
    const userId2 = new mongoose.Types.ObjectId(req.params.userId2);

    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender recipient", "name profilePic");

    res.json(messages || []);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ message: err.message });
  }
};