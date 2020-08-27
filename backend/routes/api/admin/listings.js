const router = require('express').Router()
const db = require(__basedir + '/db/controllers')

router.get('/customers', async (req, res, next) => {
  try {
    const customers = await db.users.getCustomers()
    res.send({ customers })
  } catch(e) {
    next(e)
  }
})

router.get('/customers/:id/wallets', async (req, res, next) => {
  try {
    const userId = Number(req.params.id)
    const wallets = await db.wallets.getByUserId(userId)
    res.send({ wallets })
  } catch (err) {
    next(e)
  }
})

module.exports = router