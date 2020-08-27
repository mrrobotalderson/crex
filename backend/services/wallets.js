const { getCallbackAddress, getCurrencies } = require("./coinpayments")

const db = require(__basedir + '/db/controllers')

const fetchWallets = async (userId) => {
  try {
    const wallets = await db.wallets.getByUserId(userId)
    return wallets
  } catch (err) {
    return Promise.reject(err)
  }
}

const fetchWalletById = async (walletId) => {
  try {
    const wallet = await db.wallets.getById(walletId)
    return wallet
  } catch (err) {
    return Promise.reject(err)
  }
}

const _addBalancesToWallet = async (walletId, userId) => {
  try {
    const currencies = getCurrencies()

    const addressesP = []
    currencies.forEach((currency) => {
      // const addressP = getCallbackAddress({ userId, currency: currency.symbol })
      //   .then(res => ({ address: res, currency }))

      const addressP = Promise.resolve({
        address: {
          address: '',
          label: '',
          dest_tag: ''
        },
        currency
      })
      addressesP.push(addressP)
    })
    const addresses = await Promise.all(addressesP)

    const balances = currencies.map((currency) => {
      const { address } = addresses.find(item => item.currency.symbol === currency.symbol)
      return db.balances.insert({
        symbol: currency.symbol,
        amount: 0.1,
        wallet_id: walletId
      })
        .then((balance) => {
          address.balance_id = balance.id
          return db.addresses.insert(address)
            .then((addressRes) => {
              balance.address = addressRes
              return balance
            })
        })
    })
    return balances
  } catch (err) {
    return Promise.reject(err)
  }
}

const createWallet = async (userId, wallet, addBalances = true) => {
  const walletObj = {
    user_id: userId,
    ...wallet
  }

  try {
    const walletResult = await db.wallets.insert(walletObj)
    if (addBalances) {
      const balancesResult = _addBalancesToWallet(walletResult.id, userId)
      walletResult.balances = balancesResult || balances
    }
    return walletResult
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = {
  fetchWallets,
  fetchWalletById,
  createWallet
}