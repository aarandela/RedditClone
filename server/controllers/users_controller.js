const users = require('../../models').users
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  add (req, res) {
    // hash the password
    console.log(req.body.password)// problem is because its undefined... FIX NOW
    console.log(req.body.username)
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) throw err
      // save account details with hash password in database
      users
        .create({
          username: req.body.username,
          password: hash
        })
        .then(function (err, doc) {
          // if user already exists, register page is rendered with error message
          if (err) {
            res.render('./auth/signup', {
              message: 'Username already exists.'
            })

            // if not, user is redirected to index.
          }

          // create session using passport js
          req.login(doc._id, function (err) {
            if (err) throw err

            req.session.user = req.body.username
            console.log(`[Auth] ${req.session.user} has registered`)
            res.redirect('../')
          })
        })
    })
  },

  getById (req, res) {
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
    if (req.isAuthenticated()) {
      res.redirect('../')
    } else {
      res.render('./auth/signup', {
        message: undefined
      })
    }
  },

  logout (req, res) {
    console.log(`${req.session.user} has logged out`)

    req.session.destroy()
    res.redirect('./auth/login')
  },

  checkLogin (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('../')
    } else {
      res.render('./auth/login')
    }
  },

  login (req, res) {
    /*  PASSPORT SETUP  */
    const passport = require('passport')
    const express = require('express')
    const app = express()
    app.use(passport.initialize())
    app.use(passport.session())
    app.get('/success', (req, res) => res.send('You have successfully logged in'))
    app.get('/error', (req, res) => res.send('error logging in'))
    passport.serializeUser(function (user, cb) {
      cb(null, user)
    })
    passport.deserializeUser(function (obj, cb) {
      cb(null, obj)
    })
    /* PASSPORT LOCAL AUTHENTICATION */
    const LocalStrategy = require('passport-local').Strategy
    passport.use(new LocalStrategy(
      function (username, password, done) {
        users.findOne({ where: { username: username } })
          .then(function (users) {
            if (!users) {
              return done(null, false, { message: 'Username not found.' })
            }
            if (!users.password === password) {
              return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, users)
          })
          .catch(err => done(err))
      }
    ))
    app.post('/login',
      passport.authenticate('local', { failureRedirect: '/error' }),
      function (req, res) {
        res.redirect('/')
      })
    /*  FACEBOOK AUTH  */
    const FacebookStrategy = require('passport-facebook').Strategy
    const FACEBOOK_APP_ID = '355132191707152'
    const FACEBOOK_APP_SECRET = '4497392898aed10a79aedca7b00e49b1'
    passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile)
    }
    ))
    exports.fb_auth = function (req, res, next) {
      passport.authenticate('facebook')(req, res, next)
    }

    exports.fb_callback = function (req, res, next) {
      passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: '/login' })(req, res, next)
    }

    // look up username in database
    users.findAll({ where: { username: req.body.username } }, function (err, doc) {
      if (err) throw err

      // if nothing is returned, render login page with error message
      if (!doc.length) {
        res.render('./auth/login', {
          message: 'Username or password is incorrect.'
        })
      } else {
        // compare password with hashed password
        bcrypt.compare(req.body.password, doc[0].password, function (err, result) {
          if (err) throw err

          // if they match, redirect to index.
          if (result === true) {
            // create session using passport js
            req.login(doc[0]._id, function (err) {
              if (err) throw err
              req.session.user = req.body.username

              console.log(`${req.session.user} has logged in`)
              res.redirect('../')
            })

            // if not, redirect back to login.
          } else {
            console.log(`${req.session.user} failed to login`)
            res.render('./auth/login', {
              message: 'Username or password is incorrect.'
            })
          }
        })
      }
    })
  }

}
