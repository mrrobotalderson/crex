const Address = require('../models').address

const getAll = (options = {}) => {
	return Address.findAll(options)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Address.findOne(options)
}

const getById = (addressId) => {
	const criteria = { id: addressId }
	return getOne(criteria)
}

const insert = (address) => {
	return Address
		.create(address)
		.then(address => getById(address.id))
}

const update = (address) => {
	const options = {
		where: { id: address.id }
	}
  return Address.update(address, options)
    .then(() => getById(address.id))
}

const _delete = (addressId) => {
	const options = {
		where: { id: addressId }
	}
	return Address.destroy(options)
	  .then(() => ({ id: addressId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	insert,
	update,
	delete: _delete
}