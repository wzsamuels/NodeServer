import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: {type: String, maxLength: 1000},
  author: {type: String, maxLength: 100, default: 'Guest'},
  created: {type: Date, default: Date.now}
});

export default PostSchema;