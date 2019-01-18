const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

// POSTS ROUTES
router.put('/edit/post/:id', contentsController.edit)
router.delete('/delete/post/:id', contentsController.delete)

// COMMENTS ROUTES
router.put('/edit/comment/:id', commentsController.edit)
router.delete('/delete/comment/:id', commentsController.delete)

// Content Routes
// router.get('/', contentsController.list)
// router.get('/content_id/:id', contentsController.getById)
// router.get('/create_text', contentsController.addTextView)
// router.post('/api/contents', contentsController.addText)

// // Users Routes
// router.get('/api/users', usersController.list)
// router.get('/search/users/:id', usersController.getById)
// router.post('/signup', usersController.add)

// // Comments Routes
// router.get('/api/comments', commentsController.list)
// router.post('/api/comments', commentsController.add)
// // router.get('/content_id/:id', commentsController.list)

module.exports = router
