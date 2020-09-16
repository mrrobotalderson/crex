'use strict'
module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('price', {
    value: DataTypes.FLOAT,
    datetime: DataTypes.DATETIME,
  }, {
    timestamps: false
  })
  Price.associate = function(models) {
    Price.belongsTo(models.asset, {
      foreignKey: 'asset_id',
      as: 'asset'
    })
  }
  return Price
}