import Vue from 'vue'
import VueRouter from 'vue-router'
import Wallet from '../views/Wallet'
import Admin from '../views/Admin'
import Asset from '../views/Asset'
import Auth from '../views/Auth'
import Testbed from '../views/Testbed'

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
    path: '/admin/asset/:id',
    name: 'asset',
    component: Asset,
  },
  {
    path: '/testbed',
    name: 'testbed',
    component: Testbed,
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
