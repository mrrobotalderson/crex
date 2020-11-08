const Address = require('../models').address
const Asset = require('../models').asset
const Balance = require('../models').balance
const Wallet = require('../models').wallet

const getAll = (opts = {}) => {
  return Balance.findAll(opts)
    .then(results => results.map(result => result.toJSON()))
}

const getAllFiltered = (criteria = {}) => {
  const {
    symbol,
    wallet_id
  } = criteria

  const symbolCriteria = {}
  if (symbol) {
    symbolCriteria.symbol = symbol
    delete criteria.symbol
  }

  return getAll({
      include: [{
        model: Wallet,
        as: 'wallet',
        where: {
          id: wallet_id
        }
      }, {
        model: Address,
        as: 'address'
      }, {
        model: Asset,
        as: 'asset',
        where: {
          ...symbolCriteria
        }
      }]
    })
    .then((results) => {
      // in case we have both present there is only one possible combination
      if (symbol && wallet_id) {
        return results[0] || null
      }
      return results
    })
}

const getOne = (criteria) => {
  const {
    symbol
  } = criteria

  const symbolCriteria = {}
  if (symbol) {
    symbolCriteria.symbol = symbol
    delete criteria.symbol
  }

  const options = {
    where: criteria,
    include: [{
      model: Wallet,
      as: 'wallet'
    }, {
      model: Address,
      as: 'address'
    }, {
      model: Asset,
      as: 'asset',
      where: {
        ...symbolCriteria
      }
    }]
  }
  return Balance.findOne(options)
    .then(result => result && result.toJSON())
}

const getById = (balanceId) => {
  return getOne({
    id: balanceId
  })
}

const getByWalletId = (wallet_id) => {
  return getAllFiltered({
    wallet_id
  })
}

const insert = (balance) => {
  return Balance
    .create(balance)
    .then(balance => getById(balance.id))
}

const insertMany = (balances) => {
  return Balance
    .bulkCreate(balances, {
      returning: true
    })
    .then(balances => balances.map(balance => balance.toJSON()))
}

const update = (balance) => {
  const options = {
    where: {
      id: balance.id
    }
  }
  return Balance.update(balance, options)
    .then(() => getById(balance.id))
}

const _delete = (balanceId) => {
  const options = {
    where: {
      id: balanceId
    }
  }
  return Balance.destroy(options)
    .then(() => ({
      id: balanceId
    }))
}

module.exports = {
  getAll,
  getAllFiltered,
  getOne,
  getById,
  getByWalletId,
  insert,
  insertMany,
  update,
  delete: _delete
}
