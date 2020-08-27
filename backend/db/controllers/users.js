const User = require('../models').user
const PASSWORD_FIELD = 'password_digest'

const addExcludes = (options = {}, excludes = [PASSWORD_FIELD]) => {
	if (!options.attributes) options.attributes = {}
	const currentExcludes = options.attributes.exclude || []
	options.attributes.exclude = [...new Set([...currentExcludes, ...excludes])]

	return Promise.resolve(options)
}

const getAll = () => {
	return addExcludes()
		.then(options => User.findAll(options))
}

const getCustomers = () => {
	return addExcludes({ where: { is_admin: false } })
		.then(options => User.findAll(options))
}

const getOne = (user, includePassword = false) => {
	const options = {
		where: user
	}
	const extraExcludes = includePassword ? [] : [PASSWORD_FIELD]
	return addExcludes(options, extraExcludes)
    .then(options => User.findOne(options))
    .then((user) => {
      if (!user) return null
      return user.toJSON()
    })
}

const getById = (userId) => {
	const criteria = { id: userId }
	return getOne(criteria)
}

const insert = (user) => {
	return User
		.create(user)
		.then(user => getById(user.id))
}

const update = (user) => {
	const options = {
		where: { id: user.id }
	}
	return addExcludes(options)
    .then(options => User.update(user, options))
    .then(() => getById(user.id))
}

const _delete = (userId) => {
	const options = {
		where: { id: userId }
	}
	return User.destroy(options)
	  .then(() => ({ id: userId }))
}

module.exports = {
  getAll,
  getCustomers,
  getOne,
  getById,
  insert,
  update,
  delete: _delete
}