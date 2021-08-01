import express from 'express';
import path, { dirname } from 'path';
import Book from '../db/bookminster.js'
import { fileURLToPath } from 'url';
//import getCover from '../lib/bookcover.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../bookminster/build', 'index.html'));
});

// Get all the posts
router.get('/api/list', (req, res) => {
  Book.find().exec(function (err, list_books) {
    if (err) {return next(err)} 
    else {
        res.send(list_books);
      }
    });
  })

// Add a new book to the database and return it
router.post("/api/add", (req, res) => {
  //const cover = getCover(req.body.title);
  const cover ="#";
  Book.create({ title: req.body.title, author: req.body.author, cover: cover}, (err, book) => {
    if (err) {
      console.log("Something went wrong creating Book");
    }
    else {      
      res.send(book.toJSON());
    }
  })
})

router.delete("/api/delete:id", (req, res) => {
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