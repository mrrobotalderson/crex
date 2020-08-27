const walletsService = require('../wallets')

const db = require(__basedir + '/db/controllers')
const { generateRandomString } = require(__basedir + '/helpers')
const accountHelper = require('./helper')

const getUser = async (criteria) => {
  try {
    if (!criteria)
      throw { status: 400, msg: 'noCriteriaForUser' }

    const user = db.users.getOne(criteria)
    return user
  } catch (err) {
    return Promise.reject(err)
  }
}

const sanitizeUser = (user) => {
  const passwordFields = ['password', 'password_confirm']
  const requiredFields = ['email', ...passwordFields]
  const badFields = []
  const sanitizedUser = {}

  if (!user) return null

  requiredFields.forEach((field) => {
    const value = user[field] && user[field].trim()
    sanitizedUser[field] = value
    if (!value) badFields.push(field)
  })

  const passwordsMatch = sanitizedUser.password === sanitizedUser.password_confirm
  const isPasswordEmpty = !!badFields.filter(field => passwordFields.includes(field)).length
  if (!passwordsMatch && !isPasswordEmpty) badFields.push(...passwordFields)

  if (badFields.length) return { badFields }
  sanitizedUser.is_admin = false
  delete sanitizedUser.password_confirm
  return { user: sanitizedUser }
}

const checkDuplicateValues = (user) => {
  const duplicateValues = ['email'].map((field) => {
    const criteria = {}
    criteria[field] = user[field]
    return db.users.getOne(criteria)
      .then(result => ({ exists: !!result, field }))
  })

  return Promise.all(duplicateValues)
    .then((results) => results
      .filter(result => result.exists)
      .map(result => result.field))
}

const createDefaultWallet = async (user) => {
  try {
    await walletsService.createWallet(user.id, {})
  } catch(e) {
    console.log(e)
  }
  return user
}

const generateAccountConfirmToken = async (user) => {
  const verifyToken = generateRandomString(20)
  const tokenObj = {
    type: 'confirm',
    token: verifyToken,
    user_id: user.id
  }

  const tokenResult = await db.tokens.insert(tokenObj, 'forever')
  return {
    user,
    token: tokenResult.token
  }
}

const register = (user) => {
  const sanitizationResult = sanitizeUser(user)
  if (!sanitizationResult) 
    return Promise.reject({ status: 400, msg: 'emptyUser' })
  if (sanitizationResult.badFields) 
    return Promise.reject({ status: 400, msg: 'invalidFields', details: sanitizationResult.badFields })

  const sanitizedUser = sanitizationResult.user
  return checkDuplicateValues(sanitizedUser)
    .then((duplicateValues) => {
      if (duplicateValues.length)
        throw { status: 409, msg: 'duplicateFields', details: duplicateValues }
      return accountHelper.hashPassword(sanitizedUser.password)
        .then(hashedPassword => ({ ...user, password_digest: hashedPassword, password: null }))
        .then(user => db.users.insert(user))
        .then(user => createDefaultWallet(user))
        .then(user => generateAccountConfirmToken(user))
        .then(({ user, token }) => {
          accountHelper.sendConfirmationEmail({ email: user.email, verifyToken: token }) // await?
          return { email: user.email }
        })
        .catch(err => Promise.reject(err))
    })
}

const confirmCheck = async (token) => {
  try {
    const tokenEntry = await db.tokens.getByValue(token)
    if (!tokenEntry || tokenEntry.type !== 'confirm')
      throw { status: 400, msg: 'invalidVerifyToken' }

    return { token }
  } catch (err) {
    return Promise.reject(err)
  }
}

const confirmExecute = async ({ token, email }) => {
  try {
    const tokenEntry = await db.tokens.getByValue(token)
    if (!tokenEntry || tokenEntry.type !== 'confirm' || tokenEntry.owner.email !== email)
      throw { status: 400, msg: 'invalidVerifyToken' }

    const user = tokenEntry.owner
    await db.users.update({
      id: user.id,
      verified_date: Date.now()
    })
    await db.tokens.delete({
      id: tokenEntry.id
    })

    accountHelper.sendWelcomeEmail({ email: user.email }) // await?
    return { status: 'success' }
  } catch (err) {
    return Promise.reject(err)
  }
}

const requestPasswordReset = async (email) => {
  try {
    const user = await db.users.getOne({ email })
    if (!user)
      throw { status: 400, msg: 'invalidEmail' }

    const resetToken = generateRandomString(20)
    const tokenObj = {
      type: 'reset',
      token: resetToken,
      user_id: user.id
    }

    const tokenResult = await db.tokens.insert(tokenObj)
    const { token } = tokenResult
    accountHelper.sendPasswordResetEmail({ email: user.email, resetToken: token }) // await?

    return { status: 'success' }
  } catch (err) {
    return Promise.reject(err)
  }
}

const resetPasswordCheck = async (token) => {
  try {
    const tokenEntry = await db.tokens.getByValue(token)
    if (!tokenEntry || tokenEntry.type !== 'reset')
      throw { status: 400, msg: 'invalidVerifyToken' }

    return { token }
  } catch (err) {
    return Promise.reject(err)
  }
}

const resetPassword = async ({ token, email }) => {
  try {
    const tokenEntry = await db.tokens.getByValue(token)
    if (!tokenEntry || tokenEntry.type !== 'reset' || tokenEntry.owner.email !== email)
      throw { status: 400, msg: 'invalidResetToken' }

    const user = await db.users.getOne({ email })
    if (!user)
      throw { status: 400, msg: 'invalidResetToken' }

    const newPassword = generateRandomString(10)
    const hashedPassword = await accountHelper.hashPassword(newPassword)

    const userId = user.id
    await db.users.update({
      id: userId,
      password_digest: hashedPassword
    })
    await db.tokens.delete({
      id: tokenEntry.id
    })

    accountHelper.sendPasswordResetSuccessEmail({ email: user.email, newPassword }) // await?

    return { status: 'success' }
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = {
  getUser,
  register,
  confirmCheck,
  confirmExecute,
  requestPasswordReset,
  resetPasswordCheck,
  resetPassword
}