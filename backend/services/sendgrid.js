const sgMail = require('@sendgrid/mail')
const h2p = require('html2plaintext')
const { ips } = require(__basedir + '/services/system')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const templates = {
  accountConfirm: {
    subject: 'Test account confirmation',
    body: '<h1>Test account confirm with code: <a href="{serverUrl}/confirm/{code}">{code}</a></h1>',
    containsServerUrl: true
  },
  passwordReset: {
    subject: 'Test password reset',
    body: '<h1>Test password reset with code: <a href="{serverUrl}/reset-password/{code}">{code}</a></h1>',
    containsServerUrl: true
  },
  passwordResetSuccess: {
    subject: 'Test password reset success',
    body: `<div>
      <h1>Your password has been successfully reset</h1>
      <p>New password: {newPassword}</p>
    </div>`
  },
  welcome: {
    subject: 'Test welcome to Celerexx',
    body: '<h1>Welcome to Celerexx</h1>'
  }
}

const interpolateVars = (body, vars = {}) => {
  let filledBody = body
  Object.keys(vars).forEach((key) => {
    const find = `{${key}}`
    const re = new RegExp(find, 'g')
    const replace = vars[key]
    filledBody = filledBody.replace(re, replace)
  })
  return filledBody
}

module.exports = {
  sendEmail: async (data) => {
    const { to, type, vars } = data
    const template = templates[type]

    if (template.containsServerUrl) {
      try {
        const clientUrl = await ips.getClientUrl(true)
        vars.serverUrl = clientUrl
      }
      catch(e) {
        return Promise.reject({ status: 500, msg: 'cantAppendServerUrl' })
      }
    }

    const { subject, body } = template
    const filledSubject = interpolateVars(subject, vars)
    const filledBody = interpolateVars(body, vars)

    const msg = {
      to,
      from: 'payments@crex.com',
      subject: filledSubject,
      text: h2p(filledBody),
      html: filledBody
    }

    return sgMail.send(msg)
      .catch((e) => {
        const stringError = typeof e === 'string' ? e : JSON.parse(JSON.stringify(e))
        const stringMessage = `
          send email failed
          error: ${stringError}
          params: to:${to} type:${type}
        `
        console.log(stringMessage)
      })
  }
}