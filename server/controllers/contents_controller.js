const contents = require('../../models').contents
let arrContents = []

module.exports = {
  add (req, res) {
  // Save to PostgreSQL database
    return contents
      .create({
        title: req.body.title,
        url: req.body.url
      })

    // send result to client
      .then(function () {
        console.log('added', req.body.title, 'and', req.body.url)
        res.status(303).redirect('/')
      })
      .catch(function (error) {
        res.status(400).send(error)
      })
  },

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
