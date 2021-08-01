import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100, default: "Untitled" },
  author: {type: String, required: true, maxLength: 100, default: 'Anonymous'},
  cover: {type: String, default: "#" },
  published: {type: String, default: "None"},
  summary: {type: String, default: "None"}
});

export default BookSchema;