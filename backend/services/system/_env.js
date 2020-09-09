const checkEnv = () => {
  let requiredEnv = [
    'NODE_ENV',
    'JWT_SECRET',
    'PORT',
    'FPORT',
    'SCHEMA',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'DB_HOST',
    'SENDGRID_API_KEY',
  ]
  let unsetEnv = requiredEnv.filter(env => !process.env[env])

  if (unsetEnv.length > 0) {
    throw new Error(`Required ENV variables are not set: [ ${unsetEnv.join(', ')} ]`)
  }
}

try {
  checkEnv()
  console.log('.env file correct')
} catch(e) {
  console.error(e)
  return process.exit(1)
}
