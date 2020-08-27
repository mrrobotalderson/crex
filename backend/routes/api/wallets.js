const router = require('express').Router()

const walletsService = require(__basedir + '/services/wallets')
const { authMiddleware } = require(__basedir + '/services/auth/middleware')

router.get('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user

  try {
    const wallets = await walletsService.fetchWallets(id)
    res.send({ wallets })
  } catch(e) {
    next(e)
  }
})

router.get('/:id', authMiddleware(), async (req, res, next) => {
  const userId = req.user.id
  const { id } = req.params

  try {
    const wallet = await walletsService.fetchWalletById(id)
    if (!wallet || wallet.user_id !== userId)
      throw { status: 400, msg: 'badWallet' }
    res.send({ wallet })
  } catch(e) {
    next(e)
  }
})

router.post('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { wallet } = req.body

  try {
    const result = await walletsService.createWallet(id, wallet)
    res.send({ wallet: result })
  } catch(e) {
    next(e)
  }
})

module.exports = router