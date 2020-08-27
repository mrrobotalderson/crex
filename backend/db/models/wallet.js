'use strict'
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('wallet', {
    name: DataTypes.STRING
  })
  Wallet.associate = function(models) {
    Wallet.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'owner'
    })
  }
  Wallet.associate = function(models) {
    Wallet.hasMany(models.deposit, {
      foreignKey: 'wallet_id',
      as: 'deposits'
    })
    Wallet.hasMany(models.balance, {
      foreignKey: 'wallet_id',
      as: 'balances'
    })
  }
  return Wallet
}