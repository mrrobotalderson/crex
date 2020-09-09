'use strict'
module.exports = (sequelize, DataTypes) => {
  const Ipn = sequelize.define('ipn', {
    status_code: DataTypes.INTEGER,
    ipn_request: {
      type: DataTypes.STRING,
      get() {
        const jsonbVal = this.getDataValue('ipn_request')
        try {
          return JSON.parse(jsonbVal) || {}
        } catch (e) {
          return {}
        }
      }
    }
  })
  return Ipn
}