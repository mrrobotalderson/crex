'use strict'
module.exports = (sequelize, DataTypes) => {
  const Withdrawal = sequelize.define('withdrawal', {
    amount: DataTypes.FLOAT,
    address: DataTypes.STRING,
    tag: DataTypes.STRING,
    status: DataTypes.STRING,
    status_text: DataTypes.JSONB,
  })
  Withdrawal.associate = function(models) {
    Withdrawal.belongsTo(models.balance, {
      foreignKey: 'balance_id',
      as: 'balanceFrom'
    })
  }
  return Withdrawal
}