'use strict'
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true
  }, {
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }
  }, {
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }
  }
  )
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
