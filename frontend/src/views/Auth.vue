<template lang="pug">
  .fit.flex-col.center
    b-form.flex-col(@submit.prevent="doAuth")
      b-form-group(label="Email" label-cols="3")
        b-form-input(v-model.number="user.email" type="email" placeholder="Email" required)
      b-form-group(label="Password" label-cols="3")
        b-form-input(v-model.number="user.password" type="password" placeholder="Password" required)
      b-form-group(v-if="mode === 'register'" label="Password confirm" label-cols="3")
        b-form-input(v-model.number="user.passwordConfirm" type="password" placeholder="Password confirm" required)
      b-button(type="submit") {{ mode === 'login' ? 'Login' : 'Register' }}
      .p5
      router-link(:to="{ name: (mode === 'login' ? 'register' : 'login') }") {{ mode !== 'login' ? 'Login' : 'Register' }}
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
  data: () => ({
    user: {}
  }),
  methods: {
    doAuth() {
      if (this.mode === 'login') {
        auth.login(this.user)
          .then(() => {
            this.$router.push({ name: 'wallet' })
          })
      } else if (this.mode === 'register') {
        console.log('register', this.user)
      }
    }
  }
}
</script>