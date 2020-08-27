const passport = require('passport')

const middlewareFn = (config = {}) => {
  return (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      if (err) return next(err)
      const errObj = { status: 401, msg: 'notAuth' }

      const userAbsent = !user && !config.optional
      if (userAbsent) return next(errObj)
      // if (!user.verified_date) return next(errObj)

      req.user = user
      next()
    })(req, res, next)
  }
}

const adminMiddlewareFn = () => {
  return (req, res, next) => {
    if (!req.user.is_admin) return next({ status: 403, msg: 'notAuthorized' })
    next()
  }
}

const guestMiddlewareFn = () => {
  return (req, res, next) => {
    if (!!req.user) return next({ status: 409, msg: 'mustNotBeAuth' })
    next()
  }
}

module.exports = {
  authMiddleware: middlewareFn,
  adminMiddleware: adminMiddlewareFn(),
  guestMiddleware: guestMiddlewareFn()
}