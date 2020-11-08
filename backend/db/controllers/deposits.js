const Deposit = require('../models').deposit

const getAll = () => {
	return Deposit.findAll()
}

const getOne = (criteria) => {
	const options = {
		where: criteria
	}
	return Deposit.findOne(options)
}

const getById = (depositId) => {
	const criteria = { id: depositId }
	return getOne(criteria)
}

const getByUserId = async (userId, type) => {
  const pendingStatuses = ['REQUEST_SENT', 'PENDING']
  const completedStatuses = ['COMPLETED', 'FAILED']

  const statusMap = {
    'pending': pendingStatuses,
    'completed': completedStatuses,
    'all': [...pendingStatuses, ...completedStatuses]
  }
  const statuses = statusMap[type] || []

  let QUERY = `
    SELECT
    DISTINCT ON (deposits.id)
    deposits.*,
    assets.*,
    deposits.id AS deposit_id,
    wallets.name AS wallet_name
    FROM
    deposits
    INNER JOIN
    wallets
    ON
    deposits.wallet_id = wallets.id
    INNER JOIN
    assets
    ON deposits.asset_id = assets.id`

  const replacements = {
  }

  if (userId != null) {
    QUERY += ` WHERE
      deposits.user_id = (:userId)`
    replacements.userId = userId
  }

  if (statuses.length) {
    QUERY = `${QUERY} AND deposits.status IN (:statuses)`
    replacements.statuses = statuses
  }
  QUERY = `${QUERY} ORDER BY deposits.id DESC NULLS LAST`

  QUERY = `
    SELECT DISTINCT ON (d.deposit_id) *
    FROM (
      ${QUERY}
    ) d
    ORDER BY d.deposit_id DESC`

	const deposits = await Deposit.sequelize.query(QUERY, {
    replacements,
    type: Deposit.sequelize.QueryTypes.SELECT
  })
  return deposits
}

const getTxnStatus = async (txnId) => {
  return {} // TODO: fix below for w/o JSONB

  let QUERY = `
    SELECT
    deposits.create_request ->> 'txn_id' as txn_id,
    deposits.status as deposit_status,
    ipns.ipn_request -> 'status_text' as ipn_status_text
    FROM
    deposits
    LEFT JOIN
    ipns
    ON
    ipns.ipn_request ->> 'txn_id' = deposits.create_request ->> 'txn_id'
    WHERE
    deposits.create_request ->> 'txn_id' = ?
    ORDER BY ipns.ipn_request ->> 'timestamp' DESC
    LIMIT 1`

  const deposits = await Deposit.sequelize.query(QUERY, {
    replacements: [txnId],
    type: Deposit.sequelize.QueryTypes.SELECT
  })
  const deposit = deposits[0]
  return deposit || null
}

const insert = (deposit) => {
  if (deposit.create_request) {
    try {
      deposit.create_request = JSON.stringify(deposit.create_request)
    } catch(_) {}
  }
	return Deposit
		.create(deposit)
		.then(deposit => getById(deposit.id))
}

const update = (deposit) => {
	const options = {
		where: { id: deposit.id }
  }
  if (deposit.create_request) {
    try {
      deposit.create_request = JSON.stringify(deposit.create_request)
    } catch(_) {}
  }
  return Deposit.update(deposit, options)
    .then(() => getById(deposit.id))
}

const _delete = (depositId) => {
	const options = {
		where: { id: depositId }
	}
	return Deposit.destroy(options)
	  .then(() => ({ id: depositId }))
}

module.exports = {
  getAll,
  getOne,
  getById,
  getByUserId,
  getTxnStatus,
  insert,
  update,
  delete: _delete
}
