/*  EXPRESS SETUP  */

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.sendFile('auth.html', { root: __dirname }))

const port = process.env.PORT || 3000
app.listen(port, () => console.log('App listening on port ' + port))

/*  SEQUELIZE SETUP */

const Sequelize = require('sequelize')
const sequelize = new Sequelize('RedditClone', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres'
})

const UserDetails = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

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
    UserDetails.findOne({ where: { username: username } })
      .then(function (users) {
        if (!users) {
          return done(null, false, { message: 'Incorrect username.' })
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
    res.redirect('/success?username=' + req.user.username)
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
    res.redirect('/success')
  })