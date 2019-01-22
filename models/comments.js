'use strict'
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    text: DataTypes.STRING,
    content_id: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {})
  comments.associate = function (models) {
    // associations can be defined here
    comments.belongsTo(models.users, {
      foreignKey: 'userID',
      onDelete: 'CASCADE'
    })
    comments.belongsTo(models.contents, {
      foreignKey: 'content_id',
      onDelete: 'CASCADE'
    })
  }
  return comments
}
