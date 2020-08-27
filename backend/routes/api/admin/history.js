const router = require('express').Router()

const historyService = require(__basedir + '/services/history')

router.get('/', async (req, res, next) => {
  const { type } = req.query

  const validTypes = ['pending', 'completed']

  try {
    const _type = validTypes.includes(type) ? type : 'all'
    const history = await historyService.getHistory(null, _type)
    res.send({ history })
  } catch(e) {
    next(e)
  }
})

module.exports = router