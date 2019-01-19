const comments = require('../../models').comments
const users = require('../../models').users
const contents = require('../../models').contents

module.exports = {
  edit (req, res) {
    return comments
      .update({
        _id: req.params.id
      }, {
        url: req.body.url
      }, function (err, result) {
        if (err) throw err

        console.log(`[${req.params.id}] comment was edited`)
        res.send('success')
      })
  },

  delete (req, res) {
    return comments
      .find({
        _id: req.params.id
      })
      .destroy(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.id}] comment deleted`)
        res.send('OK')
      })
  },

  add (req, res) {
  // Save to PostgreSQL database
    return comments
      .create({
        text: req.body.text
      })
    // send result to client
      .then(function () {
        res.status(303).redirect(req.get('referer'))
      })
      .catch(function (error) {
        res.status(400).send(error)
      })
  },

  list (req, res) {
    return comments
      .findAll({
        attributes: ['text']
      })
      .then((comments) => res.render('./content_id'), { comments })
      .catch((error) => { res.status(400).send(error) })
  }
}
