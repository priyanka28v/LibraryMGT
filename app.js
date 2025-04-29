const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const connection = require('./config/db')

//routes
const BookRoutes = require('./routes/BookRoutes')
const AuthorRoutes = require('./routes/AuthorRoutes')
const signupRoutes = require('./routes/signupRoutes')

//middleware to handel json data and url encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/authors', AuthorRoutes);
app.use('/books', BookRoutes);
app.use('/', signupRoutes)

app.set('view engine', 'ejs')

connection();

app.listen(3000, () => {
    console.log("server is running on port 3000")
})