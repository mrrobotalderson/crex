'use strict'
module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('deposit', {
    symbol: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    create_request: DataTypes.JSONB
  })
  Deposit.associate = function(models) {
    Deposit.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'depositor'
    })
    Deposit.belongsTo(models.wallet, {
      foreignKey: 'wallet_id',
      as: 'target'
    })
  }
  return Deposit
}