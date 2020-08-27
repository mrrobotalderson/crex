const emailService = require(__basedir + '/services/email')

const bcrypt = require('bcrypt')
const BCRYPT_SALT_ROUNDS = 12

const hashPassword = (password) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

const sendConfirmationEmail = ({ email, verifyToken }) => {
  return emailService.sendEmail({
    type: 'accountConfirm',
    to: email,
    vars: {
      code: verifyToken
    }
  })
}

const sendPasswordResetEmail = ({ email, resetToken }) => {
  return emailService.sendEmail({
    type: 'passwordReset',
    to: email,
    vars: {
      code: resetToken
    }
  })
}

const sendPasswordResetSuccessEmail = ({ email, newPassword }) => {
  return emailService.sendEmail({
    type: 'passwordResetSuccess',
    to: email,
    vars: {
      newPassword
    }
  })
}

const sendWelcomeEmail = ({ email }) => {
  return emailService.sendEmail({
    type: 'welcome',
    to: email
  })
}

module.exports = {
  hashPassword,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendWelcomeEmail
}