import http from './http'
import { getAuthHeaders } from './auth'

export default {
  fetchWallets() {
    return getAuthHeaders()
      .then(options => http.get('/wallets', options))
  },
  fetchBalance(walletId, symbol = 'BTC') {
    return getAuthHeaders()
      .then(options => http.get(`/balances/wallet/${walletId}/symbol/${symbol}`, options))
  },
  fetchHistory(historyType = '') {
    return getAuthHeaders({
      params: { type: historyType }
    })
      .then(options => http.get('/history', options))
  },
  fetchAssets() {
    return getAuthHeaders()
      .then(options => http.get('/assets', options))
  },
  fetchAsset(assetId) {
    return getAuthHeaders()
      .then(options => http.get(`/assets/${assetId}`, options))
  },
  upsertAsset(asset) {
    return getAuthHeaders()
      .then(options => {
        if (!asset.id) {
          return http.post('/assets', { asset }, options)
        }
        return http.put('/assets', { asset }, options)
      })
  },
  insertPrice(price) {
    return getAuthHeaders()
      .then(options => http.post(`/assets/${price.asset_id}/price`, { price }, options))
  },
  performWithdraw(withdrawObj) {
    return getAuthHeaders()
      .then(options => http.post('/withdrawals/perform', withdrawObj, options))
  },
  fetchCustomers() {
    return getAuthHeaders()
      .then(options => http.get('/admin/listings/customers', options))
  },
  fetchAdminHistory(historyType = '') {
    return getAuthHeaders({
      params: { type: historyType }
    })
      .then(options => http.get('/admin/history', options))
  },
  insertDeposit(depositObj) {
    return getAuthHeaders()
      .then(options => http.post('/admin/manage/deposits', depositObj, options))
  },
  confirmWithdraw(withdrawalId) {
    return getAuthHeaders()
      .then(options => http.put('/admin/manage/withdrawals', { id: withdrawalId }, options))
  }
}