const db = require(__basedir + '/db/controllers')
const { ips } = require(__basedir + '/services/system')
const { createTransaction } = require(__basedir + '/services/coinpayments')
const IPN_ENDPOINT='/api/notification', NODE_ENV='development'

const createDeposit = async ({ currency, amount, walletId, user }) => {
  const { symbol, address } = currency
  const transaction = {
    currency1: symbol,
    currency2: symbol,
    amount,
    buyer_email: user.email
  }

  if (IPN_ENDPOINT && NODE_ENV !== 'development') {
    try {
      const serverUrl = await ips.getBackendUrl()
      const ipnUrl = `${serverUrl}${IPN_ENDPOINT}`

      transaction.ipn_url = ipnUrl
    }
    catch(e) {
      global.log({ msg: 'errorCreatingIpnEndpoint', details: e }, 'info')

      const err = { status: 500, msg: 'errorCreatingDeposit' }
      err.shouldLog = false
      return Promise.reject(err)
    }
  }
  
  const depositObj = {
    user_id: user.id,
    wallet_id: walletId,
    amount,
    symbol,
    status: 'CREATED',
    create_request: transaction
  }
  
  let deposit
  try {
    deposit = await db.deposits.insert(depositObj)
  } catch(e) {
    e.includeBody = true
    return Promise.reject(e)
  }

  /// 2. Call CoinPayments createTransaction save response information
  let createTransactionResults
  try {
    transaction.address = address
    createTransactionResults = await createTransaction(transaction)
  } catch(e) {
    e.includeBody = true
    return Promise.reject(e)
  }

  const depositUpdateObj = {
    id: deposit.id,
    status: 'REQUEST_SENT',
    create_request: {
      ...transaction,
      results: createTransactionResults
    }
  }

  let updateDeposit = null
  try {
    updateDeposit = await db.deposits.update(depositUpdateObj)
  } catch(e) {
    e.includeBody = true
    return Promise.reject(e)
  }
  return updateDeposit
}

const getDeposits = async (userId, type = 'all') => {
  try {
    const deposits = await db.deposits.getByUserId(userId, type)
    return deposits.map((deposit) => {
      const { create_request } = deposit || {}
      const mappedDeposit = {
        id: deposit.id,
        userId: deposit.user_id,
        txnId: create_request.txn_id || 'N/A',
        status: deposit.status,
        status_text: deposit.ipn_status_text,
        address: create_request.address,
        dest_tag: create_request.dest_tag || null,
        symbol: deposit.symbol,
        amount: deposit.amount,
        confirms: {
          needed: Number(create_request.confirms_needed || 0),
          received: Number(deposit.received_confirms || 0)
        },
        wallet: deposit.wallet_name,
        createdAt: deposit.createdAt,
        type: 'deposit'
      }
      return mappedDeposit
    })
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const getPendingDeposits = async (userId) => {
  return await getDeposits(userId, 'pending')
}

const getCompletedDeposits = async (userId) => {
  return await getDeposits(userId, 'completed')
}

const getAllDeposits = async (userId) => {
  return await getDeposits(userId)
}

const getDepositById = async (id) => {
  try {
    const deposit = await db.deposits.getOne({ id })
    return deposit
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const getDeposit = async (criteria = {}) => {
  try {
    const deposit = await db.deposits.getOne(criteria)
    return deposit
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const getTxnStatus = async (txnId) => {
  try {
    const status = db.deposits.getTxnStatus(txnId)
    return status
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const updateDeposit = async (depositObj) => {
  try {
    const updatedDeposit = await db.deposits.update(depositObj)
    return updatedDeposit
  } catch(e) {
    return Promise.reject(e)
  }
}

module.exports = {
  createDeposit,
  getPendingDeposits,
  getCompletedDeposits,
  getAllDeposits,
  getDepositById,
  getDeposit,
  getTxnStatus,
  updateDeposit,
}