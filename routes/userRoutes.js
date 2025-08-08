const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendRequest,
  acceptRequest,
  getReceivedRequests,
  getSentRequests,
  rejectRequest,
  cancelRequest,
  getConnections
} = require("../controller/userController");

router.post("/signup", signup);
router.post("/login", login);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/send-request", sendRequest);
router.post("/accept-request", acceptRequest);

router.get('/requests/:userId', getReceivedRequests);
router.get('/sent-requests/:userId',getSentRequests);
router.post('/reject-request', rejectRequest);
router.post('/cancel-request', cancelRequest);
router.get('/connections/:userId', getConnections);

module.exports = router;
