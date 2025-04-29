const mongoose = require('mongoose')
const express = require('express')
const { Author } = require('../models/index')

exports.GetAuthorPage = (req, res) => {
    return res.render('Authors')
}

exports.GetAddPage = (req, res) => {
   return res.render('addAuthor', { message: null })
}

exports.GetUpdateIdPage = (req, res) => {
    if (req.user.isAdmin) {
       return res.render('updateAuthorId', { message: null })
    }
    else {
       return res.render('adminPage',)
    }
}

exports.GetUpdatePage = (req, res) => {
   return res.render('updateAuthor')
}

exports.GetDeletePage = (req, res) => {
    if (req.user.isAdmin) {
       return res.render('deleteAuthor', { message: null })
    }
   return res.render('adminPage')
}

exports.GetDisplayPage = (req, res) => {
    return res.render('displayAuthor', { author: null, message: null })
}

const findAuthor = async (AuthorId) => {
    const author = await Author.findOne({ AuthorId })
    if (author) {
        return author
    }
    else {
        return null
    }
}

exports.PostAuthor = async (req, res) => {
    try {
        const { AuthorId, name, bio, nationality } = req.body;

        if (!AuthorId || !name || !bio || !nationality) {
            return res.status(400).render('addAuthor', { message: "Missing required fields (name, bio, nationality)." });
        }
        const author = await findAuthor(AuthorId);
        if (author) {
            return res.render('addAuthor', { message: "AuthorId already exists!" });
        }
        const sameAuthor = await Author.findOne({ name: name, bio: bio, nationality: nationality });
        if (sameAuthor) {
            return res.render('addAuthor', { message: 'Author having same details are already present in System' })
        }

        const newAuthor = new Author({
            AuthorId, name, bio, nationality
        });

        await newAuthor.save();

       return res.render('AuthorCreated');

    } catch (e) {
        console.error("Error occurred while creating author: ", e);
       return res.status(500).send({ message: "Something went wrong while creating the author. Please try again later." });
    }
}



exports.updateAuthorId = async (req, res) => {
    const { AuthorId } = req.body
    try {
        const author = await findAuthor(AuthorId)
        if (author) {
           return res.render('updateAuthor', { author })
        }
        else {
           return res.status(400).render('updateAuthorId', { message: "Author having this ID is not found!" })
        }
    } catch (err) {
        console.log(err)
        return res.render('updateAuthorId', { message: 'error in controller of updateAuthorId' })

    }
}

exports.updateAuthor = async (req, res) => {
    try {
        const { AuthorId, name, bio, nationality } = req.body

        const author = await Author.findByIdAndUpdate(AuthorId, { name, bio, nationality }, { new: true })
        if (author) {
           return res.render('updatePage', { author })
        }
    } catch (error) {
       return res.status(500).render('updateAuthor', { message: error.message })
    }

}
exports.DeleteAuthor = async (req, res) => {
    try {
        const { AuthorId } = req.body;
        const author = await Author.findOneAndDelete({ AuthorId });

        if (author) {
            return res.render('deleteAuthorPage'); // ✅ return kar diya
        } else {
            return res.render('deleteAuthor', { message: "Author having this id is not found!" }); 
        }

    } catch (error) {
        console.error("Delete Error:", error);

        if (!res.headersSent) {
            return res.status(500).render('deleteAuthor', { message: "Internal server error" }); 
        }
    }
}


exports.DisplayPage = async (req, res) => {
    try {
        const { AuthorId } = req.body
        const author = await findAuthor(AuthorId);
        if (author) {
            return res.render("displayAuthor", { author, message: null });
        }
        else {
           return res.render('displayAuthor', { author: null, message: "Author having this id is not found" })
        }
    } catch (error) {
        console.error("Error fetching authors:", error);
       return res.status(500).send("Error fetching authors");
    }
};

exports.displayAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.render('allAuthors', { message: null, author: null, authors: authors })

    }
    catch (err) {
        console.log(err)
    }
}
