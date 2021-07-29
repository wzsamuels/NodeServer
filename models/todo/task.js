import mongoose from 'mongoose';
import Schema from 'mongoose.schema';


const TaskSchema = new Schema({
  task_title = { type: String, required: true, maxLength: 100 },
  due_date: {type: Date}
})

export default mongoose.model('Task', TaskSchema);