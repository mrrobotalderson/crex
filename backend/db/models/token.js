'use strict'
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('token', {
    token: DataTypes.STRING,
    type: DataTypes.STRING,
    valid_to: DataTypes.DATE
  })
  Token.associate = function(models) {
    Token.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'owner'
    })
  }
  return Token
}