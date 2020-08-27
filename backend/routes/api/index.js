const router = require('express').Router()

const { authMiddleware, adminMiddleware } = require(__basedir + '/services/auth/middleware')

const accountsRoutes = require('./accounts')
router.use('/accounts', accountsRoutes)

const authRoutes = require('./auth')
router.use('/auth', authRoutes)

const depositsRoutes = require('./deposits')
router.use('/deposits', depositsRoutes)

const balancesRoutes = require('./balances')
router.use('/balances', balancesRoutes)

const historyRoutes = require('./history')
router.use('/history', historyRoutes)

const ipnRoutes = require('./ipn')
router.use('/ipn', ipnRoutes)

const walletsRoutes = require('./wallets')
router.use('/wallets', walletsRoutes)

const withdrawalsRoutes = require('./withdrawals')
router.use('/withdrawals', withdrawalsRoutes)

const adminRoutes = require('./admin')
router.use('/admin', authMiddleware(), adminMiddleware, adminRoutes)

const convertToNumbers = (req, res, next) => {
  const params = req.params
  Object.keys(params).forEach((paramKey) => {
  	if (!isNan(params[paramKey])) {
      req.params[paramKey] = Number(params[paramKey])
    }
  })
  next()
}
router.use(convertToNumbers) // doesn't work atm

module.exports = router