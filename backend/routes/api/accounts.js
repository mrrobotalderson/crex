const router = require('express').Router()

const accountsService = require(__basedir + '/services/accounts')
const { guestMiddleware } = require(__basedir + '/services/auth/middleware')

router.post('/register', guestMiddleware, (req, res, next) => {
  const { user } = req.body

  return accountsService.register(user)
    .then(user => res.send(user))
    .catch(err => next(err))
})

router.get('/confirm/:token', guestMiddleware, (req, res, next) => {
  const { token } = req.params

  return accountsService.confirmCheck(token)
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.post('/confirm/:token', guestMiddleware, (req, res, next) => {
  const { token } = req.params
  const { email } = req.body

  return accountsService.confirmExecute({ token, email })
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.post('/password-reset', guestMiddleware, (req, res, next) => {
  const { email } = req.body

  return accountsService.requestPasswordReset(email)
    .then(result => res.send(result))
    .catch(err => next(err))
})

router.get('/password-reset/:token', guestMiddleware, (req, res, next) => {
  const { token } = req.params

  return accountsService.resetPasswordCheck(token)
    .then(result => res.send(result))
    .catch(err => next(err))
})


router.put('/password-reset/:token', guestMiddleware, (req, res, next) => {
  const { token } = req.params
  const { email } = req.body

  return accountsService.resetPassword({ token, email })
    .then(result => res.send(result))
    .catch(err => next(err))
})

module.exports = router