const db = require(__basedir + '/db/controllers')

const balancesService = require(__basedir + '/services/balances')

const _getWithdrawals = async (userId, filter = {}) => {
  try {
    const withdrawals = await db.withdrawals.getByUserId(userId, filter)
    return withdrawals.map((withdrawal) => {
      const mappedWithdrawal = {
        id: withdrawal.id,
        userId: withdrawal.balanceFrom.wallet.user_id,
        txnId: 'N/A',
        status: withdrawal.status,
        address: withdrawal.address,
        symbol: withdrawal.balanceFrom.asset.symbol,
        amount: withdrawal.amount,
        wallet: withdrawal.balanceFrom.wallet.name,
        createdAt: withdrawal.createdAt,
        type: 'withdrawal'
      }
      return mappedWithdrawal
    })
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const getPendingWithdrawals = async (userId) => {
  return await _getWithdrawals(userId, { status: 'SENT' })
}

const getCompletedWithdrawals = async (userId) => {
  return await _getWithdrawals(userId, { status: 'COMPLETED' })
}

const getAllWithdrawals = async (userId) => {
  return await _getWithdrawals(userId)
}

const _validateWithdrawal = ({
  amount,
  balance,
  address,
  selectedCurrency,
  tag
}) => {
  if (amount <= 0) throw { status: 400, msg: 'invalidAmount' }
  if (balance.amount - amount < 0) throw { status: 400, msg: 'insufficientFunds' }
  if (!address) throw { status: 400, msg: 'invalidTarget' }
  if (selectedCurrency.requiresTag && !tag) throw { status: 400, msg: 'missingTag' }
}

const requestWithdrawal = async (userId, { balance, amount, address, tag }) => {
  try {
    if (!balance || !amount || !address) throw { status: 400, msg: 'invalidInput' }

    const _balance = await db.balances.getById(balance.id)
    if (!_balance || _balance.wallet.user_id !== userId) throw { status: 400, msg: 'wrongBalance' }

    const currencies = await db.assets.getAll()
    const selectedCurrency = currencies.find(match => match.symbol === _balance.asset.symbol)
    if (!selectedCurrency) throw { status: 400, msg: 'invalidCurrency' }

    try {
      _validateWithdrawal({
        amount,
        balance: _balance,
        address,
        selectedCurrency,
        tag
      })
    } catch(e) {
      return Promise.reject(e)
    }

    const result_obj = {
      balance_id: _balance.id,
      amount,
      address,
      status: 'REQUESTED',
      status_text: null,
    }

    await db.withdrawals.insert(result_obj)
    return result_obj
  }
  catch(e) {
    return Promise.reject(e)
  }
}

const confirmWithdrawal = async (withdrawalId) => {
  try {
    const withdrawal = (await db.withdrawals.getById(withdrawalId)).toJSON()
    if (withdrawal && withdrawal.status === 'REQUESTED') {
      const { amount } = withdrawal

      const { asset, wallet_id } = await balancesService.fetchById(withdrawal.balance_id)
      await balancesService.changeBalanceAmount(wallet_id, { asset.symbol, amount: -amount })

      withdrawal.status = 'COMPLETED'
      await db.withdrawals.update(withdrawal)
      return { success: true }
    }
    throw { status: 400, msg: 'invalidWithdrawal' }
  }
  catch(e) {
    return Promise.reject(e)
  }
}

module.exports = {
  getPendingWithdrawals,
  getCompletedWithdrawals,
  getAllWithdrawals,
  requestWithdrawal,
  confirmWithdrawal
}
