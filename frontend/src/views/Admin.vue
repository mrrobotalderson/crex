<template lang="pug">
  Layout(admin)
    b-card
      b-card-text
        b-tabs(fill)
          b-tab.p10(title="History" active)
            .p10
            table.w100
              tr.font-weight-bold
                td User
                td Type
                td Amount
                td Address
                td Datetime
                td Actions
              .p5-ver
              tr(v-for="historyItem in history" :id="historyItem.id")
                td {{ historyItem.userId }}
                td {{ historyItem.type | capitalize }}
                td {{ historyItem.amount }} {{ historyItem.symbol }}
                td {{ historyItem.address }}
                td {{ historyItem.createdAt | datetime }}
                td
                  b-button(@click="confirmWithdrawal(historyItem.origId)" v-if="historyItem.type === 'withdrawal' && historyItem.status === 'REQUESTED'") Confirm
          b-tab.p10(title="Invest")
            .flex-col
              h6 Insert deposit
              b-form.flex-col(@submit.prevent="insertDeposit")
                .p15-top
                b-form-group(label="User ID" label-cols="3")
                  b-form-select(v-model.number="deposit.user_id" :options="customers" value-field="id" text-field="email" required)
                b-form-group(label="Symbol" label-cols="3")
                  b-form-select(v-model="deposit.asset_id" :options="assets" text-field="symbol" value-field="id" required)
                b-form-group(label="Amount" label-cols="3")
                  b-form-input(v-model.number="deposit.amount" type="number" min="0" step="0.001" required)
                b-button(type="submit") Submit
          b-tab.p10(title="Assets")
            .flex-col
              .p10
              table.w100
                tr.font-weight-bold
                  td Symbol
                  td Address
                  td Actions
                .p5-ver
                tr(v-for="assetItem in assets" :id="assetItem.id")
                  td {{ assetItem.symbol }}
                  td {{ assetItem.address }}
                  td.flex-row
                    b-button(@click="editAsset(assetItem)") Edit
                    .p5-side
                    b-button(@click="gotoAssetDetails(assetItem.id)") Details
              hr
              h6 Add/edit asset
              b-form.flex-col(@submit.prevent="upsertAsset")
                .p15-top
                b-form-group(label="Symbol" label-cols="3")
                  b-form-input(v-model="asset.symbol" required)
                b-form-group(label="Description" label-cols="3")
                  b-form-input(v-model="asset.description")
                b-form-group(label="Address" label-cols="3")
                  b-form-input(v-model="asset.address" required)
                b-button(type="submit") Submit
                .p5
                b-button(@click="resetAsset") Reset
</template>

<script>
import api from '@/services/api'

const depositTemplate = {
  user_id: null,
  asset_id: null,
  amount: 0.001
}

const assetTemplate = {
  id: null,
  symbol: '',
  description: '',
  address: ''
}

export default {
  created() {
    this.fetchHistory()
    this.fetchCustomers()
    this.fetchAssets()
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
    customers: [],
    deposit: { ...depositTemplate },
    assets: [],
    asset: { ...assetTemplate }
  }),
  methods: {
    fetchCustomers() {
      api.fetchCustomers()
        .then(({ customers }) => {
          this.customers = customers
        })
    },
    fetchHistory() {
      api.fetchAdminHistory()
        .then(({ history }) => {
          this.history = history
        })
    },
    fetchAssets() {
      api.fetchAssets()
        .then(({ assets }) => {
          this.assets = assets
        })
    },
    insertDeposit() {
      api.insertDeposit(this.deposit)
        .then(() => {
          this.fetchHistory()
          this.deposit = { ...depositTemplate }
        })
    },
    confirmWithdrawal(withdrawalId) {
      api.confirmWithdraw(withdrawalId)
        .then(() => {
          this.fetchHistory()
        })
    },
    upsertAsset() {
      return api.upsertAsset(this.asset)
        .then(() => {
          this.fetchAssets()
        })
    },
    editAsset(asset) {
      this.asset = {
        id: asset.id,
        symbol: asset.symbol,
        description: asset.description,
        address: asset.address
      }
    },
    gotoAssetDetails(assetId) {
      this.$router.push({ name: 'asset', params: { id: assetId } })
    },
    resetAsset() {
      this.asset = { ...assetTemplate }
    }
  }
}
</script>