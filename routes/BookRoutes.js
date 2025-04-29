const express = require('express')
const { verifyToken } = require('../middleware/jwt')
const router = express.Router()
const controller = require('../controllers/BookCon')

router.get('/', verifyToken, controller.GetBookPage)

router.get('/add', verifyToken, controller.GetAddPage)

router.get('/update', verifyToken, controller.GetUpdatePage)

router.get('/updateBookId', verifyToken, controller.GetUpdateIdPage)

router.get('/delete', verifyToken, controller.GetDeletePage)

router.get('/display', verifyToken, controller.GetDisplayPage)

router.post('/addBook', verifyToken, controller.PostBook)

router.post("/updateBookId", verifyToken, controller.updateBookId)

router.post("/updateBook", verifyToken, controller.updateBook)

router.post("/deleteBook", verifyToken, controller.DeleteBook)

router.post("/displayBook", verifyToken, controller.DisplayPage)

router.get("/displayAll", verifyToken, controller.displayAllBooks)

module.exports = router;
