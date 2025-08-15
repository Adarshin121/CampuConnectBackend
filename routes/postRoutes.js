const express = require("express");
const router = express.Router();
const {
  addPost,
  getVisiblePosts,
  getPostsByBranch,
  likePost,
  commentPost,
  updatePost,
  deletePost,
  getUserPosts
} = require("../controller/postController");


router.post("/add", addPost);
router.get("/users/:userId", getVisiblePosts);
router.get("/branch/:branch", getPostsByBranch);
router.post("/like/:postId", likePost);
router.post("/comment/:postId", commentPost);
router.put("/update/:postId", updatePost);
router.delete("/delete/:postId", deletePost);
router.get("/user/:userId", getUserPosts);


module.exports = router;
