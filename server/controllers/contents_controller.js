const contents = require('../../models').contents
const users = require('../../models').users

module.exports = {
  addTextView (req, res) {
    // TODO: Auth to post stuff
    // return users.findOne({ where: { username: req.params.username } })
    //   .then(() => {
    //     if (!result) {
    //       return res.status(404).send('You muse be signed in')
    //     }
    return res.render('./create_content_text')
  },

  // Save to PostgreSQL database
  addText (req, res) {
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

  // addURL (req, res) {
  //   // Save to PostgreSQL database
  //   return contents
  //     .create({
  //       title: req.body.title,
  //       url: req.body.url
  //     })

  //     // send result to client
  //     .then(function (contents) {
  //       res.render('./create_context_url')
  //       console.log('added', req.body.title, 'and', req.body.url)
  //       res.status(303).redirect('/')
  //     })
  //     .catch(function (error) {
  //       res.status(400).send(error)
  //     })
  // },

  getById (req, res) {
    return contents
      .findById(req.params.id, {})
      .then((contents) => {
        if (!contents) {
          return res.status(404).send({
            message: 'Contents Not Found'
          })
        }
        return res.status(200).send(contents)
      })
      .catch((error) => res.status(400).send(error))
  },

  list (req, res) {
    return contents
      .findAll({
        attributes: ['title', 'url']
      })
      .then((contents) =>
        res.render('./home', { contents })
      )
    // res.status(200).send(contents))
      // render here?
      .catch((error) => { res.status(400).send(error) })
  }
}
