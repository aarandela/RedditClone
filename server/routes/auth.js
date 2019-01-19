const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const users = require('../../models/users')

// route for when user logs out, session is destroyed and user redirected to login
router.get('/logout', function (req, res) {
  console.log(`[Auth] ${req.session.user} has logged out`)

  req.session.destroy()
  res.redirect('/login')
})

// route for when user views register page
router.get('/signup', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('../')
  } else {
    res.render('./signup', {
      message: undefined
    })
  }
})

// route for when user submits register details
router.post('/signup', function (req, res) {
  // hash the password
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) throw err

    // save account details with hash password in database
    users({
      username: req.body.username,
      password: hash,
      created: Date.now()
    }).save(function (err, doc) {
      // if user already exists, register page is rendered with error message
      if (err) {
        res.render('./signup', {
          message: 'Username already exists.'
        })

        // if not, user is redirected to index.
      } else {
        users({
          username: req.body.username
        }).save(function (err, doc) {
          if (err) throw err
        })

        // create session using passport js
        req.login(doc._id, function (err) {
          if (err) throw err

          req.session.user = req.body.username
          console.log(`[Auth] ${req.session.user} has registered`)
          res.redirect('../')
        })
      }
    })
  })
})

// route for when user views login page
router.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('../')
  } else {
    res.render('./login', {
      message: undefined
    })
  }
})

// route for when user submits login details
router.post('/login', function (req, res) {
  // look up username in database
  users.findOne({
    username: req.body.username
  }, function (err, doc) {
    if (err) throw err

    // if nothing is returned, render login page with error message
    if (!doc.length) {
      res.render('./login', {
        message: 'Username or password is incorrect.'
      })
    } else {
      // compare password with hashed password
      bcrypt.compare(req.body.password, doc[0].password, function (err, result) {
        if (err) throw err

        // if they match, redirect to index.
        if (result == true) {
          // create session using passport js
          req.login(doc[0]._id, function (err) {
            if (err) throw err
            req.session.user = req.body.username

            console.log(`[Auth] ${req.session.user} has logged in`)
            res.redirect('../')
          })

          // if not, redirect back to login.
        } else {
          console.log(`${req.session.user} failed to login`)
          res.render('.login', {
            message: 'Username or password is incorrect.'
          })
        }
      })
    }
  })
})

module.exports = router
