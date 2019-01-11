const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users

// Content Router
router.get('/api/contents', contentsController.list)
router.get('/api/contents/:id', contentsController.getById)
router.post('/api/contents', contentsController.add)

// Users Router
router.get('/api/users', usersController.list)
router.get('/api/users/:id', usersController.getById)
router.post('/api/users', usersController.add)

module.exports = router

// hehehehehehe banana
