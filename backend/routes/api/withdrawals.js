const router = require('express').Router()

const withdrawalsService = require(__basedir + '/services/withdrawals')
const { authMiddleware } = require(__basedir + '/services/auth/middleware')

router.get('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { type } = req.query

  const validTypes = ['pending', 'completed']

  const types = {
    pending: withdrawalsService.getPendingWithdrawals,
    completed: withdrawalsService.getCompletedWithdrawals,
    all: withdrawalsService.getAllWithdrawals
  }

  try {
    const withdrawalsFetchFn = types[validTypes.includes(type) ? type : 'all']
    const withdrawals = await withdrawalsFetchFn(id)
    res.send({ withdrawals })
  } catch(e) {
    next(e)
  }
})

router.post('/perform', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { balance, amount, address, tag } = req.body

  try {
    const result = await withdrawalsService.requestWithdrawal(id, { balance, amount, address, tag })
    res.send({ result })
  } catch(e) {
    next(e)
  }
})

module.exports = router