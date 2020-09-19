<template lang="pug">
  Layout
    b-card
      b-card-text
        b-dropdown(v-if="selectedWallet" :text="selectedWallet.name + ' - ' + selectedBalance.amount + ' ' + selectedBalance.asset.symbol")
          b-dropdown-item(v-for="balance in balances" :key="balance.id" @click="selectBalance(balance)")
            span {{ balance.wallet.name }} - {{ balance.amount }} {{ balance.asset.symbol }}
        br
        br
        b-tabs(fill)
          b-tab.p10(title="History" active)
            .p10
            table.w100
              tr.font-weight-bold
                td Type
                td Amount
                td Address
                td Datetime
              .p5-ver
              tr(v-for="historyItem in history" :id="historyItem.id")
                td {{ historyItem.type | capitalize }}
                td {{ historyItem.amount }} {{ historyItem.symbol }}
                td {{ historyItem.address }}
                td {{ historyItem.createdAt | datetime }}
          b-tab.p10(v-if="selectedWallet" title="Invest")
            .flex-col
              h6 Invest to {{ selectedWallet.name }}
              .p5-top
              .flex-col.align-center
                qrcode(:value="selectedBalance.address.address" :options="{ width: 200 }")
                b-form-input(:value="selectedBalance.address.address" disabled)
              br
              .flex-row.w100
                .flex-1
                b-button(@click="$copyText(selectedBalance.address.address)") Copy
          b-tab.p10(v-if="selectedWallet" title="Withdraw")
            b-form.flex-col(@submit.prevent="initWithdraw")
              h6 Withdraw from {{ selectedWallet.name }}
              .p15-top
              b-form-group(label="To" label-cols="3")
                b-form-input(v-model="withdrawal.address" placeholder="To" required minlength="26" maxlength="35")
              b-input-group(label="Amount" label-cols="3")
                b-form-input(v-model.number="withdrawal.amount" placeholder="Amount" type="number" min="0.001" step="0.001" :max="selectedBalance.amount" required)
                b-input-group-append
                  b-button(@click="setMaxWithdrawal" variant="danger") Max
              br
              b-button(type="submit" variant="info") Withdraw
</template>

<script>
import api from '@/services/api'

export default {
  created() {
    this.fetchHistory()
    this.fetchBalances()
  },
  filters: {
    capitalize: value => {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    datetime: value => {
      if (!value) return ''

      const appendLeadingZeroes = n => {
        if (n <= 9) {
          return `0${n}`
        }
        return n
      }

      const a = value.split('T')
      const d = a[0].split('-')
      const t = a[1].split('.')[0].split(':')
      const derivedDate = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
      const formattedDate = `${appendLeadingZeroes(derivedDate.getDate())}/${appendLeadingZeroes(derivedDate.getMonth() + 1)}/${appendLeadingZeroes(derivedDate.getFullYear())} ${appendLeadingZeroes(derivedDate.getHours())}:${appendLeadingZeroes(derivedDate.getMinutes())}:${appendLeadingZeroes(derivedDate.getSeconds())}`
      return formattedDate
    }
  },
  data: () => ({
    history: [],
    balances: [],
    selectedBalance: null,
    withdrawal: {
      address: '',
      amount: 0.001,
      tag: null
    }
  }),
  computed: {
    selectedWallet() {
      return this.selectedBalance ? this.selectedBalance.wallet : null
    }
  },
  methods: {
    fetchHistory() {
      api.fetchHistory()
        .then(({ history }) => {
          this.history = history
        })
    },
    fetchBalances() {
      api.fetchWallets()
        .then(({ wallets }) => Promise.all(wallets.map(wallet => api.fetchBalance(wallet.id))))
        .then(balances => {
          this.balances = balances.map(obj => obj.balance)
          if (this.balances.length) {
            this.selectBalance(this.balances[0])
          }
        })
    },
    selectBalance(balance) {
      this.selectedBalance = balance
    },
    initWithdraw() {
      const withdrawalObj = {
        ...this.withdrawal,
        balance: {
          id: this.selectedBalance.id
        }
      }
      api.performWithdraw(withdrawalObj)
        .then(() => {
          this.withdrawal = {
            address: '',
            amount: 0.001,
            tag: null
          }
          this.fetchHistory()
        })
    },
    setMaxWithdrawal() {
      this.withdrawal.amount = this.selectedBalance.amount
    }
  }
}
</script>