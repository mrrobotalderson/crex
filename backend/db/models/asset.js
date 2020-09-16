'use strict'
module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('asset', {
    symbol: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    timestamps: false
  })
  Asset.associate = function(models) {
    Asset.hasMany(models.price, {
      foreignKey: 'asset_id',
      as: 'prices'
    })
  }
  return Asset
}