const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

// POSTS ROUTES
router.put('/edit/post/:id', contentsController.edit)
router.delete('/delete/post/:id', contentsController.delete)

// COMMENTS ROUTES
router.post('/post/comments/:id', commentsController.add)
router.get('/post/comments/:id', commentsController.list)
router.put('/edit/comment/:id', commentsController.edit)
router.delete('/delete/comment/:id', commentsController.delete)

module.exports = router
