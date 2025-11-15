import ForumPost from '../models/ForumPost.model.js';

export const getPosts = async (req, res) => {
  const posts = await ForumPost.find().populate('author', 'name');
  res.json({ success: true, data: posts });
};

export const createPost = async (req, res) => {
  const post = await ForumPost.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: post });
};

export const addComment = async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();

  res.json({ success: true, data: post });
};
