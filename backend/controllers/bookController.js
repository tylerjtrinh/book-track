import pool from '../config/db.js';

// @desc     Get all books in users database
// @route    GET /api/books
// @access   Private
const getAllBooks = async (req, res, next) => {

};

// @desc     Get filtered books in users database. Ex: completed books
// @route    GET /api/books/:status
// @access   Private
const getFilteredBooks = async (req, res, next) => {

};

// @desc     Get data from one book. First check if the book is in the users book table. 
//           If not in database then fetch from google book API.
// @route    GET /api/books/:googleBookId
// @access   Private
const getBook = async (req, res, next) => {
    const { googleBookId } = req.params;
    const userId = req.user.user_id; //get the id from the jwt

    //Check if book is in database in the book table
    

    //If book is not in database then fetch the book information from the google book api

};

// @desc     Add book to database. Add to book table
// @route    POST /api/books
// @access   Private
const addBook = async (req, res, next) => {

};

// @desc     Edit book status. Ex: want_to_read, currently_reading, completed
// @route    PUT /api/books/:id/status
// @access   Private
const updateBookStatus = async (req, res, next) => {

};

// @desc     Add or remove books from favorites
// @route    PUT /api/books/:id/favorite
// @access   Private
const toggleBookFavorite = async (req, res, next) => {

};

// @desc     Delete book from user's reading list
// @route    PUT /api/books/:id/favorite
// @access   Private
const deleteBook = async (req, res, next) => {

};

export { 
    getAllBooks, 
    getFilteredBooks,
    getBook, 
    addBook, 
    updateBookStatus, 
    toggleBookFavorite, 
    deleteBook 
};
