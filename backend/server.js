global.__basedir = __dirname

const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
app.set('port', port)

require(__basedir + '/db')

const server = http.createServer(app)

server.listen(port)
console.log({ msg: `Started on port ${port}` }, 'info')
