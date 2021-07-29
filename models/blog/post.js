import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: {type: String, maxLength: 1000}
})

export default mongoose.model('Post', PostSchema);