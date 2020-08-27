const withdrawalsService = require(__basedir + '/services/withdrawals')
const depositsService = require(__basedir + '/services/deposits')

const prepareHistory = ({ deposits, withdrawals }) => {
  const history = [
    ...deposits,
    ...withdrawals,
  ].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return dateA > dateB
  })
  .map((item, idx) => {
    const idItem = { ...item }
    idItem.origId = idItem.id
    idItem.id = idx + 1
    return idItem
  })
  return history
}

const getHistory = async (userId, type = 'all') => {
  const depositTypes = {
    pending: depositsService.getPendingDeposits,
    completed: depositsService.getCompletedDeposits,
    all: depositsService.getAllDeposits
  }

  const withdrawalTypes = {
    pending: withdrawalsService.getPendingWithdrawals,
    completed: withdrawalsService.getCompletedWithdrawals,
    all: withdrawalsService.getAllWithdrawals
  }

  try {
    const depositsFetchFn = depositTypes[type]
    const deposits = await depositsFetchFn(userId)

    const withdrawalsFetchFn = withdrawalTypes[type]
    const withdrawals = await withdrawalsFetchFn(userId)

    const history = prepareHistory({ deposits, withdrawals })
    return history
  }
  catch(e) {
    return Promise.reject(e)
  }
}

module.exports = {
  getHistory
}