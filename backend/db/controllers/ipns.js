const Ipn = require('../models').ipn

const getAll = () => {
	return Ipn.findAll()
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Ipn.findOne(options)
}

const getById = (ipnId) => {
	const criteria = { id: ipnId }
	return getOne(criteria)
}

const insert = (ipn) => {
	return Ipn
		.create(ipn)
		.then(ipn => getById(ipn.id))
}

const update = (ipn) => {
	const options = {
		where: { id: ipn.id }
  }
  if (ipn.ipn_request) {
    try {
      ipn.ipn_request = JSON.stringify(ipn.ipn_request)
    } catch(_) {}
  }
	return Ipn.update(ipn, options)
}

const _delete = (ipnId) => {
	const options = {
		where: { id: ipnId }
	}
	return Ipn.destroy(options)
	  .then(() => ({ id: ipnId }))
}

module.exports = {
	getAll,
	getById,
	getOne,
	insert,
	update,
	delete: _delete
}