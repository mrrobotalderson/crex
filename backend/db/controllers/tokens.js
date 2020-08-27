const Op = require('sequelize').Op
const Token = require('../models').token
const User = require('../models').user

const getOne = (criteria, mustBeValid = true) => {
  const validToCriteria = {
    valid_to: {
      [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: Date.now() }]
    }
  }
	const options = {
		where: {
      ...criteria
    },
		include: [{
			model: User,
			as: 'owner',
			attibutes: ['id', 'email']
		}]
	}
	if (mustBeValid) {
		options.where = {
			...options.where,
			...validToCriteria
		}
	}
	return Token.findOne(options)
		.then(result => result && result.toJSON())
}

const getById = (tokenId, mustBeValid = true) => {
	const criteria = { id: tokenId }
	return getOne(criteria, mustBeValid)
}

const getByValue = (token, mustBeValid = true) => {
	const criteria = { token }
	return getOne(criteria, mustBeValid)
}

const TOKEN_DURATION = 1

const insert = async (token, duration = TOKEN_DURATION) => {
	// TODO: add transactional
	const tokenObj = await getOne({
		type: token.type,
		user_id: token.user_id
	})
	
	if (tokenObj) {
		await _delete({
			type: token.type,
			user_id: token.user_id
		})
	}

	const tokenObjB = await getOne({
		type: token.type,
		user_id: token.user_id
	})

	if (duration != 'forever' || duration <= 0) {
		const currentTime = new Date()
		const expiryTime = currentTime.setDate(currentTime.getDate() + duration)

		token.valid_to = expiryTime
	}

	return Token
		.create(token)
		.then(token => getById(token.id, false))
}

const update = (token) => {
	const options = {
		where: { id: token.id }
	}
	return Token.update(token, options)
}

const _delete = (criteria) => {
	if (!criteria || Object.keys(criteria).length === 0)
		return Promise.reject({ status: 400, msg: 'invalidDeleteCriteria' })
	const options = {
		where: criteria
	}
	return Token.destroy(options)
	  .then(() => (criteria))
}

module.exports = {
	getOne,
	getById,
	getByValue,
	insert,
	update,
	delete: _delete
}