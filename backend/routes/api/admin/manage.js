const router = require('express').Router()

const db = require(__basedir + '/db/controllers')
const balancesService = require(__basedir + '/services/balances')
const withdrawalsService = require(__basedir + '/services/withdrawals')

router.post('/deposits', async (req, res, next) => {
  const { user_id, asset_id, amount } = req.body

  try {
    const assets = await db.assets.getAll()
    const assetObj = assets.find(match => match.id === asset_id)

    if (!assetObj) throw { status: 400, msg: 'unsupportedCurrency' }
    
    const wallets = await db.wallets.getByUserId(user_id)
    if (!wallets.length) throw { status: 400, msg: 'noWalletToUse' }

    const wallet_id = wallets[0].id

    const depositObj = {
      user_id,
      asset_id,
      wallet_id,
      amount,
      status: 'COMPLETED',
      create_request: {
        address: assetObj.address
      }
    }

    await balancesService.changeBalanceAmount(wallet_id, { symbol: assetObj.symbol, amount })

    const depositRes = await db.deposits.insert(depositObj)
    res.send(depositRes)
  } catch (err) {
    next(err)
  }
})

router.put('/withdrawals', async (req, res, next) => {
  try {
    const { id: withdrawalId } = req.body
    const result = await withdrawalsService.confirmWithdrawal(withdrawalId)
    res.send({ result })
  } catch (err) {
    next(err)
  }
})

module.exports = router