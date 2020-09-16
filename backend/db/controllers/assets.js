const Asset = require('../models').asset

const getAll = (options = {}) => {
	return Asset.findAll(options)
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Asset.findOne(options)
}

const getById = (assetId) => {
	const criteria = { id: assetId }
	return getOne(criteria)
}

const insert = (asset) => {
	return Asset
		.create(asset)
		.then(asset => getById(asset.id))
}

const update = (asset) => {
	const options = {
		where: { id: asset.id }
	}
  return Asset.update(asset, options)
    .then(() => getById(asset.id))
}

const _delete = (assetId) => {
	const options = {
		where: { id: assetId }
	}
	return Asset.destroy(options)
	  .then(() => ({ id: assetId }))
}

module.exports = {
	getAll,
	getOne,
	getById,
	insert,
	update,
	delete: _delete
}