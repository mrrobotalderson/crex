<template lang="pug">
  div
    Chart(:chartData="chartData" :options="options")
</template>

<script>
import Chart from '../components/Chart'

export default {
  mounted() {
    this.fillData()
  },
  data: () => ({
    chartData: {},
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  methods: {
    fillData() {
      this.chartData = {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#ff0000',
            data: [this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data Two',
            backgroundColor: '#0000ff',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  components: {
    Chart
  }
}
</script>