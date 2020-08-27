<template lang="pug">
  #app
    router-view(:key="$route.fullPath")
</template>

<script>
import MessageBus from '@/services/message-bus'

export default {
  created() {
    MessageBus.$on('httpError', code => {
      if (code === 401) {
        this.$router.push({ name: 'login' })
      } else if (code === 403) {
        this.$router.push({ name: 'home' })
      }
    })
  },
  destroyed() {
    MessageBus.$off('httpError')
  }
}
</script>