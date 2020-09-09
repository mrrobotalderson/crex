global.__basedir = __dirname

const dotenv = require('dotenv')
dotenv.config()

const { env } = require(__basedir + '/services/system')

const app = require('./app')

const port = process.env.PORT || 3000
app.set('port', port)

require(__basedir + '/db')

const http = require('http')
const server = http.createServer(app)

server.listen(port)
console.log({ msg: `Started on port ${port}` }, 'info')
