import http from './http'

const STORAGE_KEY = 'crex_user'

const getStoredObj = () => {
  const storedObj = localStorage.getItem(STORAGE_KEY)
  if (storedObj) return JSON.parse(storedObj)
  return null
}

const persistUser = ({ token, user }, forceReload) => {
  if (!forceReload) {
    const storedAuthObj = getStoredObj()
    const oldUser = { ...storedAuthObj.user }
    storedAuthObj.user = user
    storedAuthObj.user.isAdmin = oldUser.isAdmin
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedAuthObj))
  } else {
    const authObj = JSON.stringify({ token, user })
    localStorage.setItem(STORAGE_KEY, authObj)
  }
  return user
}

const register = ({ email, password, passwordConfirm }) => http.post('/accounts/register', { user: { email, password, password_confirm: passwordConfirm } })

const login = ({ email, password }) => http.post('/auth/login', { email, password })
  .then(result => persistUser(result, true))

const logout = () => {
  localStorage.removeItem(STORAGE_KEY)
  return Promise.resolve()
}

const getJwt = () => {
  const storedObj = getStoredObj()
  const token = storedObj ? storedObj.token : ''
  return Promise.resolve(token)
}

const getUser = () => {
  const storedObj = getStoredObj()
  return Promise.resolve(storedObj ? storedObj.user : null)
}

export const getAuthHeaders = (options = {}) => getJwt()
  .then(token => ({
    ...options,
    headers: {
      Authorization: `JWT ${token}`
    }
  }))

export default {
  register,
  login,
  logout,
  getJwt,
  getUser,
  persistUser
}