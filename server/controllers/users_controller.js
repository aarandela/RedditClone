const express = require('express')
const app = express()
const users = require('../../models').users
const passport = require('passport')

module.exports = {
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

  logout (req, res) {
    req.logout()
    console.log('just logged out', req.session)
    // req.session.destroy()
    res.render('./auth/login')
  }

}
