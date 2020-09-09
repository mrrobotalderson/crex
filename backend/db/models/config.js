'use strict'
module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define('config', {
    key: DataTypes.STRING,
    value: {
      type: DataTypes.STRING,
      get() {
        const jsonbVal = this.getDataValue('value')
        try {
          return JSON.parse(jsonbVal) || {}
        } catch (e) {
          return {}
        }
      }
    }
  })
  return Config
}