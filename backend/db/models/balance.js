'use strict'
module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define('balance', {
    symbol: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    amountOnHold: DataTypes.FLOAT,
  })
  Balance.associate = function(models) {
    Balance.belongsTo(models.wallet, {
      foreignKey: 'wallet_id',
      as: 'wallet'
    })
    Balance.hasMany(models.withdrawal, {
      foreignKey: 'balance_id',
      as: 'withdrawals'
    })
    Balance.hasOne(models.address, {
      foreignKey: 'balance_id',
      as: 'address'
    })
  }
  return Balance
}