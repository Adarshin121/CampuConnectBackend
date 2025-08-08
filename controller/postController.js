const Post = require("../model/postModel");
const User = require("../model/userModel");

// 1. Create a Post
exports.addPost = async (req, res) => {
  try {
     await Post(req.body).save();
    res.send({ message: "Post created"});
  } catch (error) {
    res.send({ error: error.message });
  }
};

// 2. View All Posts by Self + Connected Users
exports.getVisiblePosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("connections");

    if (!user) return res.send({ error: "User not found" });

    const allVisibleUserIds = [user._id, ...user.connections.map(conn => conn._id)];

    const posts = await Post.find({ userId: { $in: allVisibleUserIds } })
      .populate("userId", "name profilePic branch")
      .sort({ createdAt: -1 });

    res.json(posts)
  } catch (err) {
    res.json({ error: err.message });
  }
};



// 3. View Posts by Branch
exports.getPostsByBranch = async (req, res) => {
  try {
    const users = await User.find({ branch: req.params.branch }, "_id");
    const userIds = users.map(u => u._id);

    const posts = await Post.find({ userId: { $in: userIds } })
      .populate("userId", "name branch profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// 4. Like Post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.json({ error: "Post not found" });

    const userId = req.body.userId;
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }

    res.json({ message: "Post liked", likes: post.likes.length });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// 5. Add Comment
exports.commentPost = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.json({ error: "Post not found" });

    post.comments.push({ userId, text });
    await post.save();

    res.json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// 6. Update Post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    if (!post) return res.json({ error: "Post not found" });

    res.json({ message: "Post updated", post });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// 7. Delete Post
exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.postId);
    if (!deleted) return res.json({ error: "Post not found" });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
