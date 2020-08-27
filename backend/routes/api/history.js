const router = require('express').Router()

const historyService = require(__basedir + '/services/history')
const { authMiddleware } = require(__basedir + '/services/auth/middleware')

router.get('/', authMiddleware(), async (req, res, next) => {
  const { id } = req.user
  const { type } = req.query

  const validTypes = ['pending', 'completed']

  try {
    const _type = validTypes.includes(type) ? type : 'all'
    const history = await historyService.getHistory(id, _type)
    res.send({ history })
  } catch(e) {
    next(e)
  }
})

module.exports = router