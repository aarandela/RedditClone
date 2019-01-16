const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

// Content Router
router.get('/api/contents', contentsController.list)
router.get('/api/contents/:id', contentsController.getById)
router.post('/api/contents', contentsController.add)

// Users Router
router.get('/api/users', usersController.list)
router.get('/api/users/:id', usersController.getById)
router.post('/api/users', usersController.add)

// Comments Router
router.get('/api/comments', commentsController.list)
router.post('/api/comments', commentsController.add)
// router.put('/api/comments_update', commentsController.update)
// router.delete()

module.exports = router
