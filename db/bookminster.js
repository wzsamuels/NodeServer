import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config( {path: './.env'});
import BookSchema from '../schemas/bookminster/book.js'
import getCover from '../lib/bookcover.js';

// initialize database connection
//const env = process.env.NODE_ENV || "development"
//const { connectionString } = credentials.mongo[env]

const db = mongoose.createConnection(process.env.BOOK_URI, { useNewUrlParser: true, useUnifiedTopology: true})
//const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log(`MongoDB connection established to database ${db.name}`))

const Book = db.model('Book', BookSchema);

Book.find((err, books) => {
  if(err) return console.error(err)
  //if(books.length) return

  let title = 'The Lord of the Rings';
  getCover(title)
    .then(url => {
      console.log(url);
      new Book({
        title: title,
        author: 'J.R.R. Tolkein',
        cover: url,
      }).save()
    })
    .catch(err => console.error(err));
  //let cover;
  //coverPromise.then(data => cover);
  
  title = 'Catcher in the Rye';
  getCover(title)
    .then(url => {
      console.log(url);
      new Book({
        title: title,
        author: 'J.D. Salinger',
        cover: url,
      }).save()
    })
    .catch(err => console.error(err));

  title = 'A Scanner Darkly';
  getCover(title)
    .then(url => {
      console.log(url);
      new Book({
        title: title,
        author: 'Philip K. Dick',
        cover: url,
      }).save()
    })
    .catch(err => console.error(err));
})

export default Book;