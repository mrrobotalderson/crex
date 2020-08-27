import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import VueClipboard from 'vue-clipboard2'

import App from '@/App'
import router from '@/router'
import store from '@/store'

import '@/styles/common.scss'
import '@/styles/main.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Layout from '@/components/Layout'

Vue.use(BootstrapVue)
Vue.use(VueClipboard)

Vue.component(VueQrcode.name, VueQrcode)

Vue.component('Layout', Layout)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')