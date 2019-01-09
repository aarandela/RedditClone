'use strict'
const users = require('./users')
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    user_id: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {})
  comments.associate = function (models) {
    // associations can be defined here
    comments.belongsTo(users)
  }
  return comments
}
