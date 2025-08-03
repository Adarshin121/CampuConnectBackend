const User = require("../model/userModel");

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
