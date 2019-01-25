const contents = require('../../models').contents
const users = require('../../models').users
const comments = require('../../models').comments
const passport = require('passport')

module.exports = {
  editView (req, res) {
    return contents
      .findOne({ where: { id: req.params.id } })
      .then((contents) => {
        if (!contents) {
          return res.status(404).send({
            message: 'Contents Not Found'
          })
        }
        // console.log('req.user: ', req.user)
        console.log('in editView')
        return res.render('./editcontent', {
          title: contents.title,
          url: contents.url,
          id: req.params.id
          // isAuthenticated: !!req.user
        })
      })
  },

  edit (req, res, nextFn) {
    let url2 = req.body.url2

    return contents.update({ url: req.body.url },
      { where: { url: url2 } })

      .then(function (err, result) {
        if (err) throw err
        console.log(result)
        console.log('post edited!')
        res.redirect('../')
      })
  },

  delete (req, res) {
    console.log('in delete')
    return contents.destroy({
      where: { id: req.params.id },
      limit: 1,
      force: true
    })
      .then(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.id}] post deleted!`)
        res.redirect('/')
      })
  },

  add (req, res) {
    return contents
      .create({
        title: req.body.title,
        url: req.body.url,
        userID: req.user.dataValues.id
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
    return res.render('./submit_post', { isAuthenticated: !!req.user })
  },

  getById (req, res) {
    return contents
      .findOne({ where: { id: req.params.id } })
      .then((contents) => {
        if (!contents) {
          return res.status(404).send('no contents')
        }
        // console.log('req.user: ', req.user)
        console.log('getbyID contents_controller')
        return res.render('content_id', {
          title: contents.title,
          url: contents.url,
          id: req.params.id,
          isAuthenticated: !!req.user,
          isUser: (req.user.id === contents.userID),
          listComments: comments.text
        })
      })
      .catch((error) => res.status(400).send(error))
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
    return contents
      .findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'url', 'userID', 'createdAt']
      })
      .then((contents) => {
        // console.log(contents)
        res.render('./home', {
          contents,
          isAuthenticated: !!req.user
          // username: req.user.dataValues.username
        })
      })
      .catch((error) => { res.status(400).send(error) })
  }

}
