const db = require(__basedir + '/db/controllers')

const insertIpn = async (ipnObj, statusCode) => {
  const insertedIpn = await db.ipns.insert({
    ipn_request: {
      ...ipnObj,
      timestamp: Date.now()
    },
    status_code: statusCode
  })
  return insertedIpn
}

module.exports = {
  insertIpn
}