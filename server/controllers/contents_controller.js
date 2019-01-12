const contents = require('../../models').contents

module.exports = {
  add (req, res) {
  // Save to PostgreSQL database
    return contents
      .create({
        title: req.body.title,
        url: req.body.url
      }, console.log(req.params))

    // send result to client
      .then(function (result) {
        res.status(201).json(result)
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
      .findAll()
      .then((contents) => res.status(200).send(contents))
      .catch((error) => { res.status(400).send(error) })
  }

}
