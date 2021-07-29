import Post from '../models/blog/post.js'

export function listPosts(req, res) {
  const posts = Post.find();
  return posts;
}