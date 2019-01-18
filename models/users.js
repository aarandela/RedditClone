'use strict'
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
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
  users.associate = function (models) {
    // associations can be defined here
    users.hasMany(models.comments, {
      foreignKey: 'user_id'
    })
    users.hasMany(models.contents, {
      foreignKey: 'user_id'
    })
  }
  return users
}
