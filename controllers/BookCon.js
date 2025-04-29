const express = require('express')
const mongoose = require('mongoose')
const { Book } = require('../models/index')
const { Author } = require('../models/index')

exports.GetBookPage = (req, res) => {
    res.render('Books')
}

exports.GetAddPage = async (req, res) => {
    try {
        const authors = await Author.find();
        res.render('addBook', { authors, message: null });
    } catch (err) {
        res.status(500).render('addBook', { message: 'error in addBook' });
    }
}

exports.GetUpdateIdPage = (req, res) => {
    if (req.user.isAdmin) {
        res.render('updateBookId', { message: null })
    }
    else {
        res.render('adminPage2',)
    }

}

exports.GetUpdatePage = (req, res) => {
    res.render('updateBook')
}

exports.GetDeletePage = (req, res) => {
    if (req.user.isAdmin) {
        res.render('deleteBook', { message: null })
    }
    res.render('adminPage2')
}

exports.GetDisplayPage = (req, res) => {    
    res.render('displayBook', {book: null, message: null })
}

const findBook = async (BookId) => {
    const book = await Book.findOne({ BookId });
    if (book) {
        return book;
    } else {
        return null;
    }
}


exports.PostBook = async (req, res) => {
    try {
        const { BookId, title, genre, publication_year, AuthorId } = req.body;

        if (!BookId || !title || !genre || !publication_year || !AuthorId) {
            const authors = await Author.find();
            return res.status(400).render('addBook', {
                authors,
                message: "Missing required fields (title,genre,publication_year,AuthorId)."
            });
        }

        const book = await findBook(BookId);
        const authors = await Author.find();
        if (book) {
            return res.render('addBook', { authors, message: "BookId already exists!" });
        }

        const author = await Author.findOne({ AuthorId });
        if (!author) {
            console.log('Author not found');  // Debugging line
            return res.render('addBook', { authors, message: "Author with this ID not found!" });
        }
        const newBook = new Book({
            BookId,
            title,
            genre,
            publication_year,
            AuthorId
        });

        await newBook.save();

       return res.render('bookCreated');
    } catch (e) {
        console.error("Error occurred while creating book: ", e);
      return  res.status(500).send({
            message: "Something went wrong while creating the book. Please try again later."
        });
    }
};

exports.updateBookId = async (req, res) => {
    const { BookId } = req.body;
    try {
        const book = await findBook(BookId);
        if (book) {
            return res.render('updateBook', { book });
        } else {
           return res.status(400).render('updateBookId', { message: "Book with this ID is not found!" });
        }
    } catch (err) {
        console.log(err);
       return res.render('updateBookId', { message: 'Error in controller of updateBookId' });
    }
}


exports.updateBook = async (req, res) => {
    try {
        const { BookId, title, genre, publication_year, AuthorId } = req.body;
        const book = await Book.findOneAndUpdate({ BookId }, { $set: { title, genre, publication_year, AuthorId } }, { new: true });
        if (book) {
            return res.render('updateBookPage', { book });  // Pass the updated book to the view
        }
    } catch (error) {
        return res.status(500).render('updateBook', { message: error.message });
    }
}
exports.DeleteBook = async (req, res) => {
    try {
        const { BookId } = req.body;
        const book = await Book.findOneAndDelete({ BookId });
        if (book) {
           return res.render('deleteBookPage');
        } else {
           return res.render('deleteBook', { message: "Book with this ID is not found!" });
        }
    } catch (error) {
       return res.status(500).json({ message: "Error deleting book", error });
    }
}

exports.DisplayPage = async (req, res) => {
    try {
        const { BookId } = req.body
        const book = await findBook(BookId);
        if (book) {
          return  res.render("displayBook", { book, message: null });
        }
        else {
          return  res.render('displayBook', { book: null, message: "Book having this id is not found!!!" })
        }
    } catch (error) {
        console.error("Error fetching authors:", error);
        return res.status(500).send("Error fetching books");
    }
};

exports.displayAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.render('allBooks', { message: null,  books: books })

    }
    catch (err) {
        console.log(err)
    }
}