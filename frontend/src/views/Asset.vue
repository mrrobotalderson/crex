<template lang="pug">
  Layout(admin)
    b-card
      .flex-col
        h6 Asset details
        b-form.flex-col
          .p15-top
          b-form-group(label="Symbol" label-cols="3")
            b-form-input(v-model="asset.symbol" readonly)
          b-form-group(label="Description" label-cols="3")
            b-form-input(v-model="asset.description" readonly)
          b-form-group(label="Address" label-cols="3")
            b-form-input(v-model="asset.address" readonly)
      .flex-col
        h6 Add price
        b-form.flex-col(@submit.prevent="insertPrice")
          .p15-top
          b-form-group(label="Value" label-cols="3")
            b-form-input(v-model.number="price.value" min="0" required)
          b-form-group(label="Date" label-cols="3")
            b-form-datepicker(v-model="price.datetime" required)
          b-button(type="submit") Submit
</template>

<script>
import api from '@/services/api'

const priceTemplate = {
  value: 0.0,
  datetime: null
}

export default {
  created() {
    const assetId = this.$route.params.id
    this.fetchAsset(assetId)
  },
  filters: {
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
    asset: {},
    price: { ...priceTemplate }
  }),
  methods: {
    fetchAsset(assetId) {
      api.fetchAsset(assetId)
        .then(({ asset }) => {
          this.asset = asset
        })
    },
    insertPrice() {
      const priceObj = {
        asset_id: this.asset.id,
        ...this.price
      }
      api.insertPrice(priceObj)
        .then(() => {
          this.price = { ...priceTemplate }
        })
    }
  }
}
</script>