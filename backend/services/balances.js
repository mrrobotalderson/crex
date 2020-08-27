const db = require(__basedir + '/db/controllers')

const { roundToDigits } = require(__basedir + '/helpers')

const fetchById = async (balanceId) => {
  try {
    const balance = await db.balances.getById(balanceId)
    return balance
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const fetchByWalletId = async (walletId) => {
  try {
    const balances = await db.balances.getByWalletId(walletId)
    return balances
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const fetchBalance = async (wallet_id, symbol) => {
  try {
    const balances = await db.balances.getAllFiltered({ wallet_id, symbol })
    return balances
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const addBalance = async (balance) => {
  const { symbol, amount, amountOnHold } = balance

  try {
    const precision = 8

    if (amount) {
      const netAmount = roundToDigits(amount, precision)
      balance.amount = netAmount
    }
    if (amountOnHold) {
      const netAmountOnHold = roundToDigits(amountOnHold, precision)
      balance.amountOnHold = netAmountOnHold
    }

    const result = await db.balances.insert(balance)
    return result
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const changeBalanceAmount = async (walletId, { symbol, amount = 0, amountOnHold = 0 }) => {
  try {
    const criteria = {
      wallet_id: walletId,
      symbol
    }

    if (isNaN(amount) || isNaN(amountOnHold)) throw { status: 400, msg: 'invalidAmount' }

    let balanceResult = await db.balances.getOne(criteria)
    if (!balanceResult) {
      balanceResult = await db.balances.insert(criteria)
    }

    const precision = 8
    const netAmount = roundToDigits(balanceResult.amount + amount, precision)

    const updatedBalance = {
      id: balanceResult.id,
      amount: netAmount
    }

    if (amountOnHold !== 0) {
      const netAmountOnHold = roundToDigits(balanceResult.amountOnHold + amountOnHold, precision)
      updatedBalance.amountOnHold = netAmountOnHold
    }

    if (amount !== 0 || amountOnHold !== 0) {
      return await db.balances.update(updatedBalance)
    }
    return balanceResult
  }
  catch(e) {
    return Promise.reject(e)
  }
}

module.exports = {
  fetchById,
  fetchByWalletId,
  fetchBalance,
  addBalance,
  changeBalanceAmount
}