'use strict'
module.exports = (sequelize, DataTypes) => {
  const contents = sequelize.define('contents', {
    title: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    freezeTableName: true
  }
  // , {
  //   createdAt: {
  //     allowNull: false,
  //     type: DataTypes.DATE,
  //     createdAt: DataTypes.DATE,
  //     updatedAt: DataTypes.DATE
  //   }
  // }, {
  //   updatedAt: {
  //     allowNull: false,
  //     type: DataTypes.DATE,
  //     createdAt: DataTypes.DATE,
  //     updatedAt: DataTypes.DATE
  //   }
  // }
  )
  contents.associate = function (models) {
    // associations can be defined here
    // contents.belongsTo(models.users, {
    //   foreignKey: 'user_id'
    // })
    contents.hasMany(models.comments, {
      foreignKey: 'content_id'
    })
  }
  return contents
}
