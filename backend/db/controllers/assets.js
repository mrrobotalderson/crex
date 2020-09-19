const Asset = require('../models').asset
const Price = require('../models').price

const getAll = (options = {}) => {
	return Asset.findAll(options)
}

const getAllWithPrices = (options = {}) => {
	const includes = options.include || []
	includes.push({
		model: Price,
		as: 'prices'
	})
	options.include = includes
	return getAll(options)
}

const getOne = (criteria) => {
	const options = {
		where: criteria,
		include: [{
			model: Price,
			as: 'prices',
			attributes: ['value', 'datetime']
		}]
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

const insertPrice = (price) => {
	return Price.create(price)
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
	getAllWithPrices,
	getOne,
	getById,
	insert,
	insertPrice,
	update,
	delete: _delete
}