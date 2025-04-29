const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const SECRET_KEY = 'library';


function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Verification Error:", err.message);
    return res.send('Invalid token'); // send error message
  }
}

module.exports = { verifyToken };

