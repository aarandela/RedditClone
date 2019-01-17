const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

// Content Routes
router.get('/', contentsController.list)
router.get('/api/contents/:id', contentsController.getById)
router.get('/create_text', contentsController.addTextView)
router.post('/api/contents', contentsController.addText)

// Users Routes
router.get('/api/users', usersController.list)
router.get('/search/users/:id', usersController.getById)
router.post('/signup', usersController.add)

// Comments Routes
router.get('/comments', commentsController.list)
router.post('/api/comments', commentsController.add)
// router.put('/api/comments_update', commentsController.update)
// router.delete()

module.exports = router
