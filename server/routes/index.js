const express = require('express')
const router = express.Router()
const passport = require('passport')

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

// POSTS ROUTES
router.get('/edit/post/:id', contentsController.editView)
router.get('/edit/post/:id', contentsController.edit)
router.get('/delete/post/:id', contentsController.delete)

// COMMENTS ROUTES
router.post('/post/:id', commentsController.add)
router.get('/post/:id', commentsController.list)
router.get('/edit/:id', commentsController.edit)
router.delete('/delete/:id', commentsController.delete)

// LOGOUT
router.get('/logout', usersController.logout)

module.exports = router
