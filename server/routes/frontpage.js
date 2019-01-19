const express = require('express')
const router = express.Router()

const contentsController = require('../controllers').contents
const usersController = require('../controllers').users
const commentsController = require('../controllers').comments

router.get('/', contentsController.list)
router.get('/post/:id', contentsController.getById)
router.get('/submit/post', contentsController.addView)
router.post('/submit/post', contentsController.add)

module.exports = router
