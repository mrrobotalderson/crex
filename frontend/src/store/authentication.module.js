import auth from '../services/auth'

// const user = auth.getUser()

export default {
  namespaced: true,
  state: { status: {}, user: null },
  actions: {
    login({ commit }, { email, password }) {
      commit('loginRequest', { email })

      return auth.login({ email, password })
        .then(userObj => {
          commit('userPersistSuccess', userObj)
          return userObj
        })
        .catch(err => {
          commit('loginFailure')
          const { data } = err.response
          return Promise.reject(data)
        })
    },
    logout({ commit }) {
      auth.logout()
      commit('logout')
    },
    update({ commit }, userObj) {
      auth.persistUser({ user: userObj })
      commit('userPersistSuccess', userObj)
      return userObj
    }
  },
  mutations: {
    loginRequest(state, userObj) {
      state.status = { loggingIn: true }
      state.user = userObj
    },
    userPersistSuccess(state, userObj) {
      state.status = { loggedIn: true }
      state.user = userObj
    },
    loginFailure(state) {
      state.status = {}
      state.user = null
    },
    logout(state) {
      state.status = {}
      state.user = null
    }
  }
}