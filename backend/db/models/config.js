'use strict'
module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define('config', {
    key: DataTypes.STRING,
    value: DataTypes.JSONB
  })
  return Config
}