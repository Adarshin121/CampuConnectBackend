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
} = require("../controller/userController");

router.post("/signup", signup);
router.post("/login", login);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/send-request", sendRequest);
router.post("/accept-request", acceptRequest);

module.exports = router;
