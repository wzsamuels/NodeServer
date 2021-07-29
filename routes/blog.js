import express from 'express';
import path, { dirname } from 'path';
import Post from '../db/blog.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../blog/build', 'index.html'));
});

// Get all the posts
router.get('/api/list', (req, res) => {
  Post.find().exec(function (err, list_posts) {
    if (err) {return next(err)} 
    else {
        res.send(list_posts);
      }
    });
  })

// Add a new blog post to the database and return it
router.post("/api/add", (req, res) => {
  Post.create({ title: req.body.title, text: req.body.text}, (err, post) => {
    if (err) {
      console.log("Something went wrong creating Post");
    }
    else {
      res.send(post.toJSON());
    }
  })
})

router.delete("/api/delete:id", (req, res) => {
  Post.deleteOne({ _id: req.params['id'] }, (err, deleteResults) => {
    if (err) {
      console.log("Something went wrong deleting Post");
    }
    else {
      res.send(`Delete record ${deleteResults}`);
    }
  });
})

export default router;