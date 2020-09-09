const jwtSecret = process.env.JWT_SECRET

const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const extractJWT = require('passport-jwt').ExtractJwt

const db = require(__basedir + '/db/controllers')

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, (email, password, next) => {
  return db.users.getOne({ email }, true)
    .then((user) => {
      if (!user) return next(null, false, { status: 400, msg: 'badEmail' })
      return bcrypt.compare(password, user.password_digest)
        .then((response) => {
          if (!response) return next(null, false, { status: 400, msg: 'badPassword' })
          // if (!user.verified_date) {
          //   return next(null, false, { status: 400, message: 'accountNotVerified' })
          // }
          return next(null, user)
        })
    })
    .catch(err => next(err))
}))

const opts = {
  jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret
}

passport.use('jwt', new JwtStrategy(opts, (jwtPayload, next) => {
  return db.users.getOne({ email: jwtPayload.email })
    .then((user) => {
      if (user) { next(null, user) }
      else { next(null, false) }
    })
    .catch((err) => {
      next(err)
    })
}))

passport.serializeUser((user, next) => {
  next(null, user)
})

passport.deserializeUser((user, next) => {
  next(null, user)
})