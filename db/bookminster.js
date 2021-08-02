import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config( {path: './.env'});
import BookSchema from '../schemas/bookminster/book.js'
import getCover from '../lib/bookcover.js';

// initialize database connection
//const env = process.env.NODE_ENV || "development"
//const { connectionString } = credentials.mongo[env]

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


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
  if(books.length) return

  const bookQueue = [{title: 'The Lord of the Rings', author: 'J.R.R Tolkein'}, {title: 'Catcher in the Rye',
    author: 'J.D.  Salinger'}, {title: 'A Scanner Darkly', author: 'Philip K. Dick'}];
 
  series(fetchCover, bookQueue);

  
})

function series(work, queue) {
  if (queue.length <= 0) return;
  work(queue.shift()).then(function() {
    if (queue.length > 0) return series(work, queue);
  });
}

async function fetchCover({title, author}) {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(1000);
  getCover(title)
  .then(data => {
    console.log(data.cover);
    console.log(data.summary);
    console.log(data.published);
    new Book({
      title: title,
      author: author,
      cover: data.cover,
      summary: data.summary,
      published: data.published
    }).save()
  })
  .catch(err => console.error(err));
}

export default Book;