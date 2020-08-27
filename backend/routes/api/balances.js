const router = require('express').Router()

const walletsService = require(__basedir + '/services/wallets')
const balancesService = require(__basedir + '/services/balances')
const { authMiddleware } = require(__basedir + '/services/auth/middleware')
const { getCurrencies } = require(__basedir + '/services/coinpayments')

router.get('/wallet/:walletId', authMiddleware(), async (req, res, next) => {
  const walletId = Number(req.params.walletId)

  try {
    const balances = await balancesService.fetchByWalletId(walletId)
    const currencies = getCurrencies()

    balances.forEach((balance) => {
      if (balance.address.address === '') {
        const currency = currencies.find(item => item.symbol === balance.symbol)
        balance.address = {
          ...balance.address,
          ...currency
        }
      }
    })

    res.send({ balances })
  } catch(e) {
    next(e)
  }
})

router.get('/wallet/:wallet/symbol/:symbol', authMiddleware(), async (req, res, next) => {
  const walletId = Number(req.params.wallet)
  const symbol = req.params.symbol

  try {
    const balance = await balancesService.fetchBalance(walletId, symbol)
    if (balance.address.address === '') {
      const currencies = getCurrencies()
      const currency = currencies.find(item => item.symbol === symbol)

      balance.address = {
        ...balance.address,
        ...currency
      }
    }
    res.send({ balance })
  } catch(e) {
    next(e)
  }
})

router.post('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { balance } = req.body

  try {
    const wallet = walletsService.fetchWalletById(balance.wallet_id)
    if (!wallet || wallet.user_id !== id)
      throw { status: 400, msg: 'badWallet' }

    const balanceResult = await balancesService.addBalance(balance)
    res.send({ balance: balanceResult })
  } catch(e) {
    next(e)
  }
})

module.exports = router