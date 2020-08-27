const login = require('./login')
const middleware = require('./middleware').authMiddleware
const guestMiddleware = require('./middleware').guestMiddleware

module.exports = {
  login,
  middleware,
  guestMiddleware
}