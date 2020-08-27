'use strict'
module.exports = (sequelize, DataTypes) => {
  const Ipn = sequelize.define('ipn', {
    status_code: DataTypes.INTEGER,
    ipn_request: DataTypes.JSONB
  })
  return Ipn
}