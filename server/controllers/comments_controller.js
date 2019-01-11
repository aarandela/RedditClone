const comments = require('../../models').comments

module.exports = {
  add (req, res) {
  // Save to PostgreSQL database
    return comments
      .create({
        username: req.body.username,
        password: req.body.password
      })
    // send result to client
      .then(function (result) {
        res.status(201).json(result)
      })
      .catch(function (error) {
        res.status(400).send(error)
      })
  },

  getById (req, res) {
    return comments
      .findById(req.params.id, {})
      .then((comments) => {
        if (!comments) {
          return res.status(404).send({
            message: 'Contents Not Found'
          })
        }
        return res.status(200).send(comments)
      })
      .catch((error) => res.status(400).send(error))
  },

  list (req, res) {
    return comments
      .findAll({})
      .then((comments) => res.status(200).send(comments))
      .catch((error) => { res.status(400).send(error) })
  }

}
