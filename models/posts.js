'use strict'
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    title: DataTypes.STRING,
    url: DataTypes.STRING
  }, {})
  posts.associate = function (models) {
    // associations can be defined here
  }
  return posts
}
