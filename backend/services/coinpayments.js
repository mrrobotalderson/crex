const Coinpayments = require('coinpayments')
const { verify } = require('coinpayments-ipn')
const { ips } = require(__basedir + '/services/system')

const IPN_SECRET = 'ipnsecretaaaa'
const MERCHANT_ID = '6e4ee2d52742c18fea3ad18da871841f'
const IPN_ENDPOINT='/api/notification'

const coinPaymentsOptions = {
  key: 'd87636d1d3523e213f7f121ed8e9f2466d847abff2d423cc2710df8fb1ab637c',
  secret: 'F62b629dDc7ebc4b618C55Da4EFC584259eFac8ed0DE3e6191f6aDe63C2962Fb'
}
const cpClient = new Coinpayments(coinPaymentsOptions)

module.exports = {
  verifyIpn: async ({ hmac, payload }) => {
    try {
      const { merchant } = payload

      const merchantMatches = merchant === MERCHANT_ID
      const isValid = await verify(hmac, IPN_SECRET, payload)

      return { isValid, merchantMatches }
    } catch(e) {
      return Promise.reject(e)
    }
  },
  createTransaction: async (transactionObj) => {
    try {
      const transaction = await cpClient.createTransaction(transactionObj)
      return transaction
    }
    catch(e) {
      return Promise.reject(e)
    }
  },
  getCallbackAddress: async ({ userId, currency }) => {
    try {
      const serverUrl = await ips.getBackendUrl(true)
      const ipnUrl = `${serverUrl}${IPN_ENDPOINT}`

      const cbAddressResp = await cpClient.getCallbackAddress({
        label: JSON.stringify({ userId }),
        ipn_url: ipnUrl,
        currency
      })
      return cbAddressResp
    }
    catch(e) {
      return Promise.reject(e)
    }
  },
  getTransaction: async (options) => {
    try {
      const transactions = await cpClient.getTx(options)
      return transactions
    }
    catch(e) {
      return Promise.reject(e)
    }
  },
  getCurrencies: () => {
    const currencies = [{
      symbol: 'BTC',
      address: '36Dj4FQ19nsdp5fTSmG8yv2sVDUE8iSHs5'
    }]
    return currencies
  }
}