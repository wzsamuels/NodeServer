import express from 'express';
import path, { dirname } from 'path';
import Book from '../db/bookminster.js'
import { fileURLToPath } from 'url';
import getCover from '../lib/bookcover.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Get all the posts
router.get('/list', (req, res) => {
  Book.find().exec(function (err, list_books) {
    if (err) {return next(err)} 
    else {
        res.send(list_books);
      }
    });
  })

// Add a new book to the database and return it
router.post("/data", (req, res) => {
  if(!req.body.author)
    req.body.author = "Anonymous";
  getCover(req.body.title)
    .then(data => {
      console.log(data.cover);
      console.log(data.summary);
      console.log(data.published);
      res.send(JSON.stringify(
        {title: req.body.title , author: req.body.author, cover: data.cover, summary: data.summary,
        published: data.published}));
    })
    .catch(err => {
      console.error(err)
      // TODO: send error to client
    });
})

router.post("/add", (req, res) => {
  console.log(JSON.stringify({ title: req.body.title, author: req.body.author, cover: req.body.cover,
    summary: req.body.summary, published: req.body.published}));
  Book.create({ title: req.body.title, author: req.body.author, cover: req.body.cover,
    summary: req.body.summary, published: req.body.published}, (err, book) => {
    if (err) {
      console.log("Something went wrong creating Book");
    }
    else {
      res.send(book.toJSON());
    }
  })
})

router.delete("/delete:id", (req, res) => {
  Book.deleteOne({ _id: req.params['id'] }, (err, deleteResults) => {
    if (err) {
      console.log("Something went wrong deleting Book");
    }
    else {
      res.send(`Delete record ${deleteResults}`);
    }
  });
})

router.post('/update:id', (req,res) => {
  Book.findByIdAndUpdate({_id: req.params['id']}, {title: req.body.title, author: req.body.author,
    cover: req.body.cover, summary: req.body.summary, published: req.body.published}, (err, result) => {
    if(err){
      res.send(err)
    }
    else{
      res.send(result)
    }
  })
})

export default router;