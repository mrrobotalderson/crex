// const sendgrid = require(__basedir + '/services/sendgrid')

const sendEmail = ({ type, to, vars }) => {
  return Promise.resolve({})
  // return sendgrid.sendEmail({ type, to, vars })
}

module.exports = {
  sendEmail
}