const jwt = require('jsonwebtoken')
const passport = require('passport')

const jwtSecret = 'testtt123321'
const db = require(__basedir + '/db/controllers')

const loginFn = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return next(err)
    if (info) return next(info)
    return req.logIn(user, (err) => {
      if (err) return next(err)
      return db.users.getOne({ id: user.id })
        .then((user) => {
          const token = jwt.sign({
            id: user.id,
            email: user.email
          }, jwtSecret)
          delete user.password_digest
          return res.send({ token, user })
        })
    })
  })(req, res, next)
}

module.exports = loginFn