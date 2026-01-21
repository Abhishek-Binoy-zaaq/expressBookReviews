const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const get_book_details = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(res.send(JSON.stringify(books[isbn], null, 4)));
        } else {
            reject(res.status(404).json({ message: "ISBN not found" }));
        }
    });

    get_book_details
        .then(() => console.log("Promise for Task 11 resolved"))
        .catch(() => console.log("ISBN not found"));
});

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const get_author_books = new Promise((resolve, reject) => {
        const book_keys = Object.keys(books);
        let filtered_books = [];

        book_keys.forEach(key => {
            if (books[key].author === author) {
                filtered_books.push(books[key]);
            }
        });

        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "No books found by this author" });
        }
    });

    get_author_books
        .then((filtered) => {
            res.send(JSON.stringify(filtered, null, 4));
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

// Get book details based on title using Promises - Task 13
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Task 13: Wrapping the filtering logic in a Promise
    const get_title_books = new Promise((resolve, reject) => {
        const book_keys = Object.keys(books);
        let filtered_books = [];

        book_keys.forEach(key => {
            if (books[key].title === title) {
                filtered_books.push(books[key]);
            }
        });

        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "Book title not found" });
        }
    });

    get_title_books
        .then((filtered) => {
            res.send(JSON.stringify(filtered, null, 4));
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "No reviews found for this ISBN" });
    }
});

module.exports.general = public_users;

// Task 10: Get the list of books available in the shop
async function getBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

// Task 11: Get book details based on ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error("Book not found");
        } else {
            console.error("Error fetching book:", error.message);
        }
    }
}

// Task 12: Get book details based on Author
async function getBookByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error("No books found for this author.");
        } else {
            console.error("Error fetching books by author:", error.message);
        }
    }
}

// Task 13: Get book details based on Title
async function getBookByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error("No books found for this title.");
        } else {
            console.error("Error fetching books by title:", error.message);
        }
    }
}

module.exports.getBooks = getBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;