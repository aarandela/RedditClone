'use strict'
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {})
  users.associate = function (models) {
    // associations can be defined here
    users.hasMany(models.contents, {
      foreignKey: 'userID',
      onDelete: 'CASCADE'
    })
  }
  return users
}
