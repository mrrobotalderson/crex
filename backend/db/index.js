const Sequelize = require('sequelize')

const dbConfig = require(__basedir + '/db/config.js')
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
})

sequelize
  .authenticate()
  .then(() => {
    console.log({ msg: 'Database connection has been established successfully' }, 'debug')
  })
  .catch((err) => {
    const logError = { msg: 'Unable to connect to the database', details: err }
    console.log(logError, 'error')
})