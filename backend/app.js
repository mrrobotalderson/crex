const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')

require('./passport')
const passport = require('passport')

const pgSetTypeParsers = require('pg-safe-numbers').pgSetTypeParsers
pgSetTypeParsers()

const app = express()
app.use(helmet())
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(passport.initialize())

const force200Responses = (req, _, next) => {
  req.headers['if-none-match'] = 'no-match-for-this'
  next()
}
app.use(force200Responses)

app.use('/', require('./routes'))

app.use('/waved', express.static('public'))

app.all('/waved/*', (req, res) => {
  res.sendFile(__basedir + '/public/index.html')
})

module.exports = app
