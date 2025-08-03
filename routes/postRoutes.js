const express = require("express");
const router = express.Router();
const {
  addPost,
  getVisiblePosts,
  getPostsByBranch,
  likePost,
  commentPost,
  updatePost,
  deletePost
} = require("../controller/postController");

router.post("/add", addPost);
router.get("/user/:userId", getVisiblePosts);
router.get("/branch/:branch", getPostsByBranch);
router.post("/like/:postId", likePost);
router.post("/comment/:postId", commentPost);
router.put("/update/:postId", updatePost);
router.delete("/delete/:postId", deletePost);

module.exports = router;
