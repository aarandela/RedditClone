const express = require('express')
const bcrypt = require('bcrypt')
const validator = require('validator')
const router = express.Router()
const app = express()

const users = require('../../models/users')

// // route for when user logs out, session is destroyed and user redirected to login
// router.get('/logout', function (req, res) {
//   console.log(`[Auth] ${req.session.user} has logged out`)

//   req.session.destroy()
//   res.redirect('/login')
// })

// // route for when user views register page
// router.get('/signup', function (req, res) {
//   if (req.isAuthenticated()) {
//     res.redirect('../')
//   } else {
//     res.render('./signup', {
//       message: undefined
//     })
//   }
// })

// // route for when user submits register details
// router.post('/signup', validateRegister(), function (req, res) {
//   // hash the password
//   bcrypt.hash(req.body.password, 10, function (err, hash) {
//     if (err) throw err

//     // save account details with hash password in database
//     users({
//       username: req.body.username,
//       password: hash,
//       created: Date.now()
//     }).save(function (err, doc) {
//       // if user already exists, register page is rendered with error message
//       if (err) {
//         res.render('./signup', {
//           message: 'Username already exists.'
//         })

//         // if not, user is redirected to index.
//       } else {
//         users({
//           username: req.body.username
//         }).save(function (err, doc) {
//           if (err) throw err
//         })

//         // create session using passport js
//         req.login(doc._id, function (err) {
//           if (err) throw err

//           req.session.user = req.body.username
//           console.log(`[Auth] ${req.session.user} has registered`)
//           res.redirect('../')
//         })
//       }
//     })
//   })
// })

// // route for when user views login page
// router.get('/login', function (req, res) {
//   if (req.isAuthenticated()) {
//     res.redirect('../')
//   } else {
//     res.render('./login', {
//       message: undefined
//     })
//   }
// })

// // route for when user submits login details
// router.post('/login', function (req, res) {
//   // make input not case sensitive
//   req.body.username = req.body.username.toLowerCase()
//   req.body.password = req.body.password.toLowerCase()

//   // look up username in database
//   users.find({
//     username: req.body.username
//   }, function (err, doc) {
//     if (err) throw err

//     // if nothing is returned, render login page with error message
//     if (!doc.length) {
//       res.render('./login', {
//         message: 'Username or password is incorrect.'
//       })
//     } else {
//       // compare password with hashed password
//       bcrypt.compare(req.body.password, doc[0].password, function (err, result) {
//         if (err) throw err

//         // if they match, redirect to index.
//         if (result == true) {
//           // create session using passport js
//           req.login(doc[0]._id, function (err) {
//             if (err) throw err
//             req.session.user = req.body.username

//             console.log(`[Auth] ${req.session.user} has logged in`)
//             res.redirect('../')
//           })

//           // if not, redirect back to login.
//         } else {
//           console.log(`${req.session.user} failed to login`)
//           res.render('.login', {
//             message: 'Username or password is incorrect.'
//           })
//         }
//       })
//     }
//   })
// })

// // MIDDLEWARE
// function validateRegister () {
//   return function (req, res, next) {
//     // make input not case sensitive
//     req.body.username = req.body.username.toLowerCase()
//     req.body.password = req.body.password.toLowerCase()

//     if (
//       validator.isAlphanumeric(req.body.username)
//     ) {
//       console.log('authentication = ' + req.isAuthenticated())
//       return next()
//     }
//     res.render('./signup', {
//       message: 'Invalid input. Try again.'
//     })
//   }
// }

module.exports = router

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

app.post('/',
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

app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function (req, res) {
    res.redirect('/')
  })
