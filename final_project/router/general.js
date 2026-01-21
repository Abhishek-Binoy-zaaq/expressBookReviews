const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify(books, null, 4)));
    });
  
    get_books.then(() => console.log("Promise for Task 10 resolved"));
  });

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from request parameters
  res.send(books[isbn]);        // Send the book matching that ISBN
});
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const book_keys = Object.keys(books); // Obtain all keys for the 'books' object
  let filtered_books = [];

  // Iterate through the 'books' object and check if the author matches
  book_keys.forEach(key => {
    if (books[key].author === author) {
      filtered_books.push(books[key]);
    }
  });

  if (filtered_books.length > 0) {
    res.send(JSON.stringify(filtered_books, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const book_keys = Object.keys(books); // Get all ISBN keys
  let filtered_books = [];

  // Iterate through books to find matching titles
  book_keys.forEach(key => {
    if (books[key].title === title) {
      filtered_books.push(books[key]);
    }
  });

  if (filtered_books.length > 0) {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } else {
    return res.status(404).json({message: "Book title not found"});
  }
});

//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn];    // Find the book by ISBN
  
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "No reviews found for this ISBN"});
  }
});

module.exports.general = public_users;
