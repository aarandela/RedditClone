'use strict'
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true
  })
  comments.associate = function (models) {
    // associations can be defined here
    comments.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
    comments.belongsTo(models.contents, {
      foreignKey: 'content_id'
    })
  }
  return comments
}
