const router = require('express').Router()
const { authMiddleware, adminMiddleware } = require(__basedir + '/services/auth/middleware')
const db = require(__basedir + '/db/controllers')

router.get('/', authMiddleware(), async (req, res, next) => {
  try {
    const assets = await db.assets.getAll()
    res.send({ assets })
  } catch(e) {
    next(e)
  }
})

router.get('/:id', authMiddleware(), async (req, res, next) => {
  try {
    const { id } = req.params
    const asset = await db.assets.getById(id)
    res.send({ asset })
  } catch(e) {
    next(e)
  }
})

router.post('/', authMiddleware(), adminMiddleware, async (req, res, next) => {
  try {
    const { asset } = req.body
    const assetRes = await db.deposits.insert(asset)
    res.send({ asset: assetRes })
  } catch(e) {
    next(e)
  }
})

router.post('/:id/price', authMiddleware(), adminMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params
    const { price } = req.body
    price.asset_id = id
    await db.assets.insertPrice(price)
    res.send({ success: true })
  } catch(e) {
    next(e)
  }
})

module.exports = router