const displayFullErrors = true

module.exports = (err, req, res, next) => {
  const logError = (error, includeBody) => {
    const { originalUrl, method, body } = req
    const logError = { ...error, path: originalUrl || '-' }

    if (method == 'POST' && includeBody) logError.body = body
    console.log(logError, 'error')
  }

  if (!err)
    return next()

  const status = err.status || err.statusCode || 500
  const error = {
    msg: err.msg || err.message || (typeof err === 'string' && err) || 'unknownError',
    details: err.details,
  }

  if (displayFullErrors)
    error.full = err

  const { shouldLog, includeBody } = err
  if ((shouldLog || includeBody || status >= 500) && shouldLog !== false) {
    logError(error, includeBody)
  }
  return res.status(status).send(error)
}