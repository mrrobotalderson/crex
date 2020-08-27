const router = require('express').Router()

const { login } = require(__basedir + '/services/auth')
const { authMiddleware, guestMiddleware } = require(__basedir + '/services/auth/middleware')

router.get('/verify', authMiddleware(), (req, res, next) => {
  res.send({
    user: req.user,
    isAuth: true
  })
})
router.post('/login', guestMiddleware, login)

module.exports = router