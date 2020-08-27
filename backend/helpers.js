const crypto = require('crypto')

const generateRandomString = (len) => {
  const realLen = Math.floor(len / 2)
  const str = crypto.randomBytes(realLen).toString('hex')
  return str
}

const roundToDigits = (value, digits) => {
  const digitValue = digits || 8
  const numericValue = Number(value)
  if (isNaN(numericValue)) return null
  if (numericValue < 10 ** -digitValue) return 0
  return +numericValue.toFixed(digitValue)
}

module.exports = {
  generateRandomString,
  roundToDigits
}