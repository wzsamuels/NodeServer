import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config( {path: './.env'});
import PostSchema from '../schemas/blog/post.js'


// initialize database connection
//const env = process.env.NODE_ENV || "development"
//const { connectionString } = credentials.mongo[env]

const db = mongoose.createConnection(process.env.BLOG_URI, { useNewUrlParser: true, useUnifiedTopology: true})
//const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log(`MongoDB connection established to database ${db.name}`))

const Post = db.model('Post', PostSchema);

Post.find((err, posts) => {
  if(err) return console.error(err)
  if(posts.length) return

  new Post({
    title: 'Test Title 1',
    text: 'Test Text 1'
  }).save()

  new Post({
    title: 'Test Title 2',
    text: 'Test Text 2'
  }).save()

  new Post({
    title: 'Test Title 3',
    text: 'Test Text 3'
  }).save()
})

export default Post;