const SCHEMA='http', FPORT=8000, PORT=3000, NODE_ENV='development'

const publicIp = require('public-ip')

const getPublicIp = async (acceptLocal) => {
  if (NODE_ENV === 'development') {
    if (!acceptLocal) throw { status: 500, msg: 'ipNotAvailable' }
    return 'localhost'
  }
  return await publicIp.v4()
}

const getSchema = () => {
  const schema = SCHEMA || 'https'
  return schema
}

const getBackendUrl = async (acceptLocal) => {
  const schema = getSchema()
  const ip = await getPublicIp(acceptLocal)
  const port = PORT ? `:${PORT}` : ''
  const backendUrl = `${schema}://${ip}${port}`
  return backendUrl
}

const getClientUrl = async (acceptLocal) => {
  const schema = getSchema()
  const ip = await getPublicIp(acceptLocal)
  const fport = FPORT ? `:${FPORT}` : ''
  const clientUrl = `${schema}://${ip}${fport}`
  return clientUrl
}

module.exports = {
  getBackendUrl,
  getClientUrl
}