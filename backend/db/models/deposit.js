'use strict'
module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('deposit', {
    symbol: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    create_request: {
      type: DataTypes.STRING,
      get() {
        const jsonbVal = this.getDataValue('create_request')
        try {
          return JSON.parse(jsonbVal) || {}
        } catch (e) {
          return {}
        }
      }
    }
  })
  Deposit.associate = function(models) {
    Deposit.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'depositor'
    })
    Deposit.belongsTo(models.asset, {
      foreignKey: 'asset_id',
      as: 'asset'
    })
    Deposit.belongsTo(models.wallet, {
      foreignKey: 'wallet_id',
      as: 'target'
    })
  }
  return Deposit
}