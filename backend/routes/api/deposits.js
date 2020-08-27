const router = require('express').Router()

const { getCurrencies } = require(__basedir + '/services/coinpayments')
const accountsService = require(__basedir + '/services/accounts')
const depositsService = require(__basedir + '/services/deposits')
const { authMiddleware } = require(__basedir + '/services/auth/middleware')

router.get('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { type } = req.query

  const validTypes = ['pending', 'completed']

  const types = {
    pending: depositsService.getPendingDeposits,
    completed: depositsService.getCompletedDeposits,
    all: depositsService.getAllDeposits
  }

  try {
    const depositsFetchFn = types[validTypes.includes(type) ? type : 'all']
    const deposits = await depositsFetchFn(id)
    res.send({ deposits })
  } catch(e) {
    next(e)
  }
})

router.get('/:id', authMiddleware(), async (req, res, next) => {
  const deposit_id = req.params.id
  const user_id = req.user.id

  try {
    const depositResult = await depositsService.getDepositById(deposit_id)

    if (!depositResult)
      throw { status: 404, msg: 'invalidDeposit' }

    const deposit = depositResult.toJSON()
    if (deposit.user_id !== user_id)
      throw { status: 404, msg: 'invalidDeposit' }

    const { create_request, status } = deposit
    const { txn_id } = create_request || {}

    let result = null
    if (!txn_id) {
      if (status !== 'CREATED') { // verify if only
        throw { status: 400, msg: 'invalidTransaction' }
      }

      result = {
        deposit_status: status
      }
    } else {
      const result = await depositsService.getTxnStatus(txn_id)

      if (!result)
        throw { status: 400, msg: 'invalidTransaction' }
    }

    res.send({
      ...deposit,
      status: result
    })
  } catch(e) {
    next(e)
  }
})

router.get('/transactionInfo/:id', authMiddleware(), async (req, res, next) => {
  const deposit_id = req.params.id
  const user_id = req.user.id

  try {
    const deposit = await depositsService.getDepositById(deposit_id)

    if (!deposit)
      throw { status: 404, msg: 'invalidDeposit' }
    if (deposit.user_id !== user_id)
      throw { status: 404, msg: 'invalidDeposit' }

    const { create_request } = deposit
    const { txn_id } = create_request || {}
    
    if (!txn_id)
      throw { status: 400, msg: 'invalidTransaction' }

    const options = {
      txid: txn_id,
      full: 1
    }

    const txInfo = await getTranscation(options)
    res.send({
      txInfo
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router