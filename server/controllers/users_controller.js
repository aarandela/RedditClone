const users = require('../../models').users
const bcrypt = require('bcrypt')

module.exports = {
  add (req, res) {
    // hash the password
    return bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) throw err

      // save account details with hash password in database
      users({
        username: req.body.username,
        password: hash
      }).save(function (err, doc) {
        // if user already exists, register page is rendered with error message
        if (err) {
          res.render('/signup', {
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
          req.login(doc.id, function (err) {
            if (err) throw err

            req.session.user = req.body.username
            console.log(`[Auth] ${req.session.user} has registered`)
            res.redirect('../')
          })
        }
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
      res.render('/views/signup', {
        message: undefined
      })
    }
  },

  logout (req, res) {
    console.log(`${req.session.user} has logged out`)

    req.session.destroy()
    res.redirect('/login')
  },

  checkLogin (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('../')
    } else {
      res.render('/login')
    }
  },

  login (req, res) {
    // look up username in database
    users.findOne({
      username: req.body.username
    }, function (err, doc) {
      if (err) throw err

      // if nothing is returned, render login page with error message
      if (!doc.length) {
        res.render('/login', {
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
            res.render('/login', {
              message: 'Username or password is incorrect.'
            })
          }
        })
      }
    })
  }

}
