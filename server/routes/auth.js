const express = require('express')
const router = express.Router()
const app = express()
const validator = require('validator')

const users = require('../../models/users')
const usersController = require('../controllers').users

// ROUTES FOR PAGES
router.post('/signup', usersController.add)
router.post('/login', usersController.login)
router.get('/signup', usersController.checkSignUp)
router.get('/logout', usersController.logout)
router.get('/login', usersController.checkLogin)

/*  PASSPORT SETUP  */
const passport = require('passport')
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
app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function (req, res) {
    res.redirect('/')
  })

// MIDDLEWARE
// function validateRegister () {
//   return function (req, res, next) {
//     // make input not case sensitive
//     req.body.username = req.body.username.toLowerCase()
//     req.body.password = req.body.password.toLowerCase()

//     if (validator.isAlphanumeric(req.body.username)) {
//       console.log('authentication = ' + req.isAuthenticated())
//       return next()
//     }
//     res.render('./auth/auth_register', {
//       message: 'Invalid input. Try again.'
//     })
//   }
// }

module.exports = router
