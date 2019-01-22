const express = require('express')
const app = express()
const users = require('../../models').users
const passport = require('passport')
const db = require('../db')

module.exports = {
  signup (req, res) {
    return users
      .create({
        username: req.body.username,
        password: req.body.password
      })
      .then(function (err, doc) {
        // if user already exists, register page is rendered with error message
        if (err) {
          res.render('./auth/signup', {
            message: 'Username already exists.'
          })
        }

        // create session using passport js
        req.login(doc.id, function (err) {
          if (err) throw err

          req.session.user = req.body.username
          console.log(`[Auth] ${req.session.user} has registered`)
          res.redirect('../')
        })
        console.log(req.userID)
        console.log(req.isAuthenticated())
      })
      .catch((error) => res.status(400).send(error))
  },

  findUser (req, res) {
    return users
      .findById(req.params.id, {})
      .then((users) => {
        if (!users) {
          return res.status(404).send({
            message: 'Contents Not Found'
          })
        }
        return res.status(200).send(users)
      })
      .catch((error) => res.status(400).send(error))
  },

  list (req, res) {
    return users
      .findAll({
        attributes: ['username']
      })
      .then((users) => res.status(200).send(users))
      .catch((error) => { res.status(400).send(error) })
  },

  checkSignUp (req, res) {
    res.render('./auth/signup')
    app.post('/signup', function (req, res) {
      users.create({
        username: req.body.username,
        password: req.body.password
      })
        .then(function (doc) {
          // create session using passport js
          req.login(doc.id, function (err) {
            if (err) throw err

            req.session.user = req.body.username
            console.log(`[Auth] ${req.session.user} has registered`)
            res.redirect('../')
          })
        })
        .catch((error) => res.status(400).send(error))
    })
  },

  logout (req, res) {
    console.log(`${req.session.user} has logged out`)

    req.session.destroy()
    res.redirect('./auth/login')
  }

}
passport.serializeUser(function (userID, cb) {
  cb(null, userID)
})
passport.deserializeUser(function (userID, cb) {
  cb(null, userID)
})
