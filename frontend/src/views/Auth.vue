<template lang="pug">
  .fit.flex-col.center
    b-form.flex-col(@submit.prevent="doAuth")
      b-form-group(label="Email" label-cols="3")
        b-form-input(v-model="user.email" type="email" placeholder="Email" required)
      b-form-group(label="Password" label-cols="3")
        b-form-input(v-model="user.password" type="password" placeholder="Password" required)
      b-form-group(v-if="modeVal === 'register'" label="Password confirm" label-cols="3")
        b-form-input(v-model="user.passwordConfirm" type="password" placeholder="Password confirm" required)
      b-button(type="submit") {{ modeVal === 'login' ? 'Login' : 'Register' }}
      .p5
      router-link(:to="{ name: (modeVal === 'login' ? 'register' : 'login') }") {{ modeVal !== 'login' ? 'Login' : 'Register' }}
</template>

<script>
import auth from '@/services/auth'

export default {
  props: {
    mode: {
      type: String,
      default: 'login'
    }
  },
  created() {
    this.modeVal = this.mode
  },
  data: () => ({
    modeVal: null,
    user: {}
  }),
  methods: {
    doAuth() {
      if (this.modeVal === 'login') {
        auth.login(this.user)
          .then(() => {
            this.$router.push({ name: 'wallet' })
          })
      } else if (this.modeVal === 'register') {
        auth.register(this.user)
          .then(() => {
            this.modeVal = 'login'
          })
      }
    }
  }
}
</script>