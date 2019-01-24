const express = require('express')
const app = express()
const db = require('./server/db')
const Sequelize = require('sequelize')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const users = require('./models').users
const LocalStrategy = require('passport-local').Strategy
const Op = Sequelize.Op

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))

app.set('view engine', '.hbs')

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false
  // cookie: { secure: true }
}))

// PASSPORT STUFF=================================================
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (userID, cb) {
  console.log('user in serialize: ', userID)
  cb(null, userID)
})

passport.deserializeUser(function (userID, cb) {
  console.log('userdeserialze: ', userID)
  users.findOne({ where: { id: userID.id } })
  // [Op.or]: [
  // { id: userID.id }
  // { facebookId: userID.id }
  // ]
    .then((user) => {
      cb(null, user)
    })
    .catch((err) => {
      console.log('error: ', err)
      cb(null, false)
    })
})

// ROUTES=======================================================
app.use('/', require('./server/routes/frontpage'))
app.use('/', require('./server/routes/index'))

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
  res.render('home', {
    username: req.user.username,
    isAuthenticated: !!req.user
  })
})

/* Facebook Auth ============================================================================== */

const FacebookStrategy = require('passport-facebook').Strategy

const FACEBOOK_APP_ID = '355132191707152'
const FACEBOOK_APP_SECRET = '4497392898aed10a79aedca7b00e49b1'

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback'
},
function (accessToken, refreshToken, profile, cb) {
  console.log('profile in facebook function: ', profile.id)
  users.findOrCreate({
    where: {
      username: profile.displayName,
      facebookId: profile.id
    }
  })
  return cb(null, profile)
}
))

app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function (req, res) {
    console.log('user in fb callback: ', req.user)
    res.redirect('/')
  })
// =======================================================================================
// LOGIN AND SIGNUP

app.get('/login', function (req, res) {
  res.render('auth/login')
})

app.get('/signup', function (req, res) {
  res.render('auth/signup')
})

app.get('/error', function (req, res) {
  res.send('Error logging in')
})
app.post('/login', passport.authenticate('local'), function (req, res, next) {
  // console.log('req.sessionID: ', req.session.id)
  console.log('username in login: ', req.user)
  console.log('req.isAuthenticated: ', req.isAuthenticated())
  if (req.user) {
    console.log('logged in')
    res.redirect('../')
  } else {
    res.redirect(404, { message: 'invalid ' })
  }
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
      .then(function (doc) {
      // if user already exists, register page is rendered with error message
        if (doc !== null) {
          console.log('username in use')
          res.render('./auth/signup', { validate: doc.dataValues.username + ' is already in use.' })
        } else {
          users.create({
            username: req.body.username,
            password: req.body.password
          })
            .then((result) => {
              // create session using passport js
              req.login(result, function (err) {
                if (err) throw err
                console.log('user in signup: ', result.dataValues)
                console.log('sessionID: ', req.session)
                console.log('is auth? : ', req.isAuthenticated())
                res.redirect('/')
              })
            })
            .catch((error) => res.status(400).send(error))
        }
      })
  }
})

app.use(function (req, res, nextFn) {
  res.locals.isAuthenticated = req.isAuthenticated()
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('App listening on port ' + port))
