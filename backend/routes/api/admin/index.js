const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({ admin: true })
})

const historyRoutes = require('./history')
router.use('/history', historyRoutes)

const manageRoutes = require('./manage')
router.use('/manage', manageRoutes)

const listingsRoutes = require('./listings')
router.use('/listings', listingsRoutes)

module.exports = router