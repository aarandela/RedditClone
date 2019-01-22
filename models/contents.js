'use strict'
module.exports = (sequelize, DataTypes) => {
  const contents = sequelize.define('contents', {
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {})
  contents.associate = function (models) {
    // associations can be defined here
    contents.belongsTo(models.users, {
      foreignKey: 'userID',
      onDelete: 'CASCADE'
    })
    contents.hasMany(models.comments, {
      foreignKey: 'content_id',
      onDelete: 'CASCADE'
    })
  }
  return contents
}
