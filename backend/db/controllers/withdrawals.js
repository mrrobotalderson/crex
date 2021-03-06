const Asset = require('../models').asset
const Balance = require('../models').balance
const Wallet = require('../models').wallet
const Withdrawal = require('../models').withdrawal

const getAll = (options = {}) => {
	return Withdrawal.findAll(options)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Withdrawal.findOne(options)
}

const getById = (withdrawalId) => {
	const criteria = { id: withdrawalId }
	return getOne(criteria)
}

const getByStatus = (withdrawalStatus) => {
	const options = {
		where: { status: withdrawalStatus }
	}
	return getAll(options)
}

const getByUserId = (userId, filter = {}) => {
  const userFilter = {}
  if (userId != null) {
		userFilter.user_id = userId
	}
  
	const options = {
		where: { ...filter },
		include: [{
			model: Balance,
			as: 'balanceFrom',
			attributes: ['id', 'wallet_id'],
			include: [{
				model: Wallet,
				as: 'wallet',
				attributes: ['name' ,'user_id'],
				where: userFilter
			}, {
				model: Asset,
				as: 'asset',
				attributes: ['symbol']
			}]
		}]
	}

	return getAll(options)
}

const getByBalanceId = (balanceId) => {
	const options = {
		where: { balance_id: balanceId }
	}
	return getAll(options)
}

const insert = (withdrawal) => {
	if (withdrawal.status_text) {
		try {
		  withdrawal.status_text = JSON.stringify(withdrawal.status_text)
		} catch(_) {}
	  }
	return Withdrawal
		.create(withdrawal)
		.then(withdrawal => getById(withdrawal.id))
}

const update = (withdrawal) => {
	const options = {
    returning: true,
    where: { id: withdrawal.id }
  }
  if (withdrawal.status_text) {
    try {
      withdrawal.status_text = JSON.stringify(withdrawal.status_text)
    } catch(_) {}
  }
  return Withdrawal.update(withdrawal, options)
}

const _delete = (withdrawalId) => {
	const options = {
		where: { id: withdrawalId }
	}
	return Withdrawal.destroy(options)
	  .then(() => ({ id: withdrawalId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	getByStatus,
	getByUserId,
	getByBalanceId,
	insert,
	update,
	delete: _delete
}
