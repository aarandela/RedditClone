'use strict'
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {})
  users.associate = function (models) {
    // associations can be defined here
    users.hasMany(models.comments, {
      foreignKey: 'user_id',
      as: 'commented'
    })
    users.hasMany(models.content, {
      foreignKey: 'user_id',
      as: 'OP'
    })
  }
  return users
}
