'use strict'
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('address', {
    address: DataTypes.STRING,
    label: DataTypes.STRING,
    dest_tag: DataTypes.STRING,
    priv_key: DataTypes.STRING
  })
  Address.associate = function(models) {
    Address.belongsTo(models.balance, {
      foreignKey: 'balance_id',
      as: 'balance'
    })
  }
  return Address
}