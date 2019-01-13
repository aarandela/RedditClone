const comments = require('../../models').comments

module.exports = {
  add (req, res) {
  // Save to PostgreSQL database
    return comments
      .create({
        user_id: req.body.user_id,
        text: req.body.text
      },
      console.log(req.body))
    // send result to client
      .then(function (result) {
        res.status(201).json(result)
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
      .then((comments) => res.status(200).send(comments))
      .catch((error) => { res.status(400).send(error) })
  }

}
