'use strict'
module.exports = (sequelize, DataTypes) => {
  const contents = sequelize.define('content', {
    title: DataTypes.STRING,
    url: DataTypes.STRING
  }, {})
  contents.associate = function (models) {
    // associations can be defined here
    contents.belongsTo(models.users, {
      foreignKey: 'user_id'
    })
  }
  return contents
}
