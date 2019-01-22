
const Sequelize = require('sequelize')

const db = new Sequelize('RedditClone', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres'
})

module.exports = db
