const contents = require('../../models').contents
const users = require('../../models').users
const comments = require('../../models').comments
const moment = require('moment')

module.exports = {
  edit (res, req) {
    return contents
      .update({
        _id: req.params.id
      }, {
        body: req.body.text
      }, function (err, result) {
        if (err) throw err

        console.log(`[${req.params.id}] post edited!`)
        res.send('success')
      })
  },

  delete (req, res) {
    return contents
      .find({
        _id: req.params.id
      })
      .destroy(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.id}] post deleted!`)
        res.send(doc)
      })
  },

  add (req, res) {
    return contents
      .create({
        title: req.body.title,
        url: req.body.url
      })

    // send result to client
      .then(function (contents) {
        console.log('added title', req.body.title, 'and text/url', req.body.url)
        res.status(303).redirect('/')
      })
      .catch(function (error) {
        res.status(400).send(error)
      })
  },

  addView (req, res) {
    return res.render('./submit_post')
  },

  getById (req, res) {
    return contents
      .findOne({ where: { id: req.params.id } })
      .then((contents) => {
        if (!contents) {
          return res.status(404).send({
            message: 'Contents Not Found'
          })
        }
        return res.render('./content_id', {
          title: contents.title,
          url: contents.url,
          username: users.username,
          text: comments.text
        })
      })
      .catch((error) => res.status(400).send(error))
  },

  list (req, res) {
    return contents
      .findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'url', 'createdAt']
      })
      .then((contents) => {
        res.render('./home', { contents })
      })
      .catch((error) => { res.status(400).send(error) })
  }
}
