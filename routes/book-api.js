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
router.post("/add", (req, res) => {
  if(!req.body.author)
    req.body.author = "Anonymous";
  getCover(req.body.title)
    .then(data => {
      console.log(data.cover);
      console.log(data.summary);
      console.log(data.published);
      Book.create({ title: req.body.title, author: req.body.author, cover: data.cover,
          summary: data.summary, published: data.published}, (err, book) => {
        if (err) {
          console.log("Something went wrong creating Book");
        }
        else {      
          res.send(book.toJSON());
        }
      })
    })
    .catch(err => console.error(err));
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

export default router;