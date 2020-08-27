import Vue from 'vue'
import VueRouter from 'vue-router'
import Wallet from '../views/Wallet'
import Admin from '../views/Admin'
import Auth from '../views/Auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Wallet,
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/register',
    name: 'register',
    component: Auth,
    props: {
      mode: 'register'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Auth,
    props: {
      mode: 'login'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
