const Wallet = require('../models').wallet

const getAll = (opts = {}) => {
	return Wallet.findAll(opts)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Wallet.findOne(options)
}

const getById = (walletId) => {
	const criteria = { id: walletId }
	return getOne(criteria)
}

const getByUserId = (userId) => {
	const options = {
		where: { user_id: userId }
	}
	return getAll(options)
}

const insert = (wallet) => {
	return Wallet
		.create(wallet)
		.then(wallet => getById(wallet.id))
}

const update = (wallet) => {
	const options = {
		where: { id: wallet.id }
	}
  return Wallet.update(wallet, options)
    .then(() => getById(wallet.id))
}

const _delete = (walletId) => {
	const options = {
		where: { id: walletId }
	}
	return Wallet.destroy(options)
	  .then(() => ({ id: walletId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	getByUserId,
	insert,
	update,
	delete: _delete
}
