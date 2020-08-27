<template lang="pug">
  b-container.d-flex.p-0(fluid)
    .flex-row.d-none.d-md-block
      Sidebar(:admin="admin")
      .p5
    .flex-col.w100
      Navbar(:admin="admin")
      .p20
        slot
      .p20
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import MessageBus from '@/services/message-bus'

export default {
  props: {
    title: String,
    subtitle: String,
    admin: Boolean
  },
  created() {
    MessageBus.$on('httpError', code => {
      if (code === 401) {
        this.$router.push({ name: 'login' })
      } else if (code === 403) {
        this.$router.push({ name: 'home' })
      }
    })
  },
  data: () => ({
    config: []
  }),
  components: {
    Navbar,
    Sidebar
  }
}
</script>