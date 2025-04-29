const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/jwt')
const controller = require('../controllers/AuthorCon')

router.get('/', verifyToken, controller.GetAuthorPage)

router.get('/add', verifyToken, controller.GetAddPage)

router.get('/update', verifyToken, controller.GetUpdatePage)

router.get('/updateAuthorId', verifyToken, controller.GetUpdateIdPage)

router.get('/delete', verifyToken, controller.GetDeletePage)

router.get('/display', verifyToken, controller.GetDisplayPage)

router.post('/addAuthor', verifyToken, controller.PostAuthor)

router.post("/updateAuthorId", verifyToken, controller.updateAuthorId)

router.post("/updateAuthor", verifyToken, controller.updateAuthor)

router.post("/deleteAuthor", verifyToken, controller.DeleteAuthor)

router.post("/displayAuthor", verifyToken, controller.DisplayPage)

router.get("/displayAll", verifyToken, controller.displayAllAuthors)

module.exports = router;
