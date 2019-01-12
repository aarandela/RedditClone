const users = require('../../models').users

module.exports = {
  add (req, res) {
  // Save to PostgreSQL database
    console.log(req.params)
    res.send(req.params)
    res.send(req.body)

    // return users
    //   .create({
    //     username: req.body.username,
    //     password: req.body.password,
    //     createdAt: {
    //   allowNull: true,
    //   type: Sequelize.DATE,
    //   createdAt: Sequelize.literal('NOW()'),
    //   updatedAt: Sequelize.literal('NOW()')

    // },
    // updatedAt: {
    //   allowNull: true,
    //   type: Sequelize.DATE,
    //   createdAt: Sequelize.literal('NOW()'),
    //   updatedAt: Sequelize.literal('NOW()')
    // }
    //   }, console.log(req.params))
    // send result to client
    // .then(function (result) {
    //   res.status(201).json(result)
    // })
    // .catch(function (error) {
    //   res.status(400).send(error)
    // })
  },

  getById (req, res) {
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
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => { res.status(400).send(error) })
  }

}
