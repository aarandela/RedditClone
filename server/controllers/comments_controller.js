const comments = require('../../models').comments
const users = require('../../models').users
const contents = require('../../models').contents

module.exports = {

  edit (req, res) {
    return comments
      .update({
        id: req.params.id
      }, {
        text: req.body.text
      }, function (err, result) {
        if (err) throw err

        console.log(`[${req.params.id}] comment was edited`)
        res.send('success')
      })
  },

  delete (req, res) {
    return comments
      .find({
        id: req.params.id
      })
      .destroy(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.id}] comment deleted`)
        res.send('OK')
      })
  },

  add (req, res) {
  // Save to PostgreSQL database
    console.log('add comment user: ', req.user.dataValues.username)
    return comments
      .create({
        text: req.body.text,
        userID: req.user.id,
        content_id: req.params.id
      })
    // send result to client
      .then(function () {
        res.status(303).redirect(req.get('referer'))
      })
      .catch(function (error) {
        res.status(400).send(error)
      })
  },

  getComments (req, res) {
    console.log('in getComments')
    return comments
      .findOne({ where: { contents_id: req.params.id } })
      .then((comments) => {
        return res.render('content_id', {
          text: comments.text
        })
      })
  },

  list (req, res) {
    console.log('in list comments')
    return comments
      .findOne({
        where: { content_id: req.params.id }
          .then((comments) =>
            comments.findAll({
              attributes: ['id', 'text', 'content_id', 'userID']
            })
              .then((comments) => {
                console.log(comments)
                return res.render('./content_id', { comments })
                  .catch((error) => { res.status(400).send(error) })
              })
          )
      })
  }

}
