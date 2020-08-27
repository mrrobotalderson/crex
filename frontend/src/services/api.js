import http from './http'
import { getAuthHeaders } from './auth'

const symbol = 'BTC'

export default {
  fetchWallets() {
    return getAuthHeaders()
      .then(options => http.get('/wallets', options))
  },
  fetchBalance(walletId) {
    return getAuthHeaders()
      .then(options => http.get(`/balances/wallet/${walletId}/symbol/${symbol}`, options))
  },
  fetchHistory(historyType = '') {
    return getAuthHeaders({
      params: { type: historyType }
    })
      .then(options => http.get('/history', options))
  },
  performWithdraw(withdrawObj) {
    return getAuthHeaders()
      .then(options => http.post('/withdrawals/perform', withdrawObj, options))
  },
  // admin
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