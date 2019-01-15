'use strict'
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    user_id: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    freezeTableName: true
  })
  comments.associate = function (models) {
    // associations can be defined here
    comments.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
  }
  return comments
}
