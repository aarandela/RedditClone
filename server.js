const express = require('express')
const app = express()
const db = require('./server/db')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const validator = require('express-validator')
const passport = require('passport')
const users = require('./models').users

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(validator())

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))

app.set('view engine', '.hbs')

// ROUTES
app.use('/', require('./server/routes/frontpage'))
app.use('/', require('./server/routes/index'))

/* Local Auth */

const LocalStrategy = require('passport-local').Strategy

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false
  // cookie: { secure: true }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (userID, cb) {
  console.log('user: ', userID)
  cb(null, userID.id)
})

passport.deserializeUser(function (userID, cb) {
  console.log('userdeserialze: ', userID)
  users.findOne({ where: { userID: userID } })
    .then((user) => {
      cb(null, user)
    })
    .catch((err) => {
      console.log('error: ', err)
      cb(null, false)
    })
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    return users.findOne({ where: { username: username } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Username not found' })
        } else {
          if (user.password === password) {
            return done(null, user.dataValues)
          } else {
            return done(null, false, { message: 'Incorrect password.' })
          }
        }
      })
      .catch((err) => {
        return done(err, false)
      })
  }
))

app.get('/', function (req, res) {
  console.log('req.user ', req.user)
  res.render('home', { user: req.user })
})

app.get('/login', function (req, res) {
  res.render('auth/login')
})

app.get('/signup', function (req, res) {
  res.render('auth/signup')
})

/* Express Validator */

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

/* Passport Setup */

app.get('/success', function (req, res) {
  res.send('success')
})

app.get('/error', function (req, res) {
  res.send('Error logging in')
})

/* Facebook Auth */

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

app.post('/login', passport.authenticate('local'), function (req, res, next) {
  console.log('req.session: ', req.session, req.user)
  if (req.user) {
    console.log('logged in')
    res.redirect(200, '/')
  } else {
    res.redirect(404, { message: 'invalid ' })
  }
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.post('/signup', function (req, res, next) {
  // verify all fields are filled
  if (!req.body.username || !req.body.password) {
    res.render('./auth/signup', { validate: 'Invalid username or password' })
  } else if (req.body.password.length <= 6) {
    console.log('short password.')
    res.render('./auth/signup', { validate: 'Password must be longer than 6 characters.' })
  } else {
    users.findOne({ where: { username: req.body.username } })
      .then((user) => {
        console.log(user)
        if (user !== null) {
          console.log('username is already in use.')
          res.render('./auth/signup', { validate: user.dataValues.username + ' is already in use.' })
        } else {
          users.create({
            username: req.body.username,
            password: req.body.password
          })
            .then((user) => {
              console.log('user: ', user)
              res.render('./auth/login', { signup: 'Account has been created. Please login.' })
            })
            .catch((err) => {
              console.log('error: ', err)
            })
        }
      })
      .catch((err) => {
        console.log('error :', err)
      })
  }
})

app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function (req, res) {
    res.redirect('/success')
  })

const port = process.env.PORT || 3000
app.listen(port, () => console.log('App listening on port ' + port))
