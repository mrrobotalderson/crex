const router = require('express').Router()

const { verifyIpn } = require(__basedir + '/services/coinpayments')
const balancesService = require(__basedir + '/services/balances')
const depositsService = require(__basedir + '/services/deposits')
const ipnsService = require(__basedir + '/services/ipns')
const { guestMiddleware } = require(__basedir + '/services/auth/middleware')

router.post('/notification', guestMiddleware, async (req, res, next) => {
  const hmac = req.get('HMAC')
  const ipnObj = req.body

   if (!hmac || !ipnObj) {
    const err = { status: 406, msg: 'invalidRequest' }
    err.includeBody = true
    return next(err)
  }

  const { ipn_mode, txn_id, status, currency1, amount1, net } = ipnObj
  if (!ipn_mode || ipn_mode !== 'hmac' || !txn_id) {
    const err = { status: 406, msg: 'invalidRequest', details: { ipn_mode, txn_id } }
    err.includeBody = true
    return next(err)
  }

  try {
    const { isValid, merchantMatches } = await verifyIpn({ hmac, payload: ipnObj })

    if (!isValid)
      throw { status: 406, msg: 'invalidRequest' }
    if (!merchantMatches)
      throw { status: 406, msg: 'invalidMerchant' }
  } catch (e) {
    e.includeBody = true
    return next(e)
  }

  let deposit = null
  try {
    deposit = await depositsService.getDeposit({
      'create_request.results.txn_id': txn_id
    })
    if (!deposit) {
      throw { status: 417, msg: 'invalidDepositInIpn' }
    }
  } catch (e) {
    e.includeBody = true
    return next(e)
  }

  const allowedStatuses = ['REQUEST_SENT', 'PENDING']
  if (!allowedStatuses.includes(deposit.status)) {
    return next({ status: 204 })
  }

  const statusCode = Number(status)
  try {
    await ipnsService.insertIpn(ipnObj, statusCode)
  } catch (e) {
    return next({ status: 500, msg: 'ipnNotStored' })
  }

  let depositStatus = null
  if (statusCode >= 100) { // payment is complete
    const { wallet_id } = deposit

    const currencyFromIpn = {
      symbol: currency1,
      amount: Number(net),
      _total: Number(amount1),
    }
    const currencyFromDeposit = {
      symbol: deposit.symbol,
      amount: deposit.amount,
    }

    try {
      const comparisonKeys = [['symbol', 'symbol'], ['_total', 'amount']]
      comparisonKeys.forEach((keys) => {
        if (currencyFromIpn[keys[0]] !== currencyFromDeposit[keys[1]])
          throw { status: 406, msg: 'depositCompromised' }
      })
    } catch(e) {
      e.includeBody = true
      return next(e)
    }

    try {
      delete currencyFromIpn._total
      await balancesService.changeBalanceAmount(wallet_id, currencyFromIpn)
    } catch (e) {
      e.includeBody = true
      return next(e)
    }

    depositStatus = 'COMPLETED'
  } else if (statusCode < 0) { // payment error
    depositStatus = 'FAILED'
    global.log({ msg: 'depositFailed', id: deposit.id, statusCode: statusCode }, 'info')
  } else { // payment is pending or queued for nightly payout
    depositStatus = 'PENDING'
  }

  try {
    await depositsService.updateDeposit({ id: deposit.id, status: depositStatus })
  } catch (e) {
    e.includeBody = true
    return next(e)
  }
  res.send({ status: 'success' })
})

module.exports = router