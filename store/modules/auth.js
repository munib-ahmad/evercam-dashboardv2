import axios from "axios"
import qs from "qs"

import * as mutationTypes from "../types/mutations"
import * as actionTypes from "../types/actions"

const state = {
  token: null,
  user: null
}

const mutations = {
  [mutationTypes.SET_USER](state, { token }) {
    state.token = token
    state.user = token
  },

  [mutationTypes.UNSET_USER](state) {
    state.user = null
    state.token = null
  }
}

const actions = {
  [actionTypes.LOGOUT]({ commit }) {
    axios.defaults.headers.common["Authorization"] = undefined
    delete axios.defaults.headers.common["Authorization"]
    commit(mutationTypes.UNSET_USER)
    // redirect
    this.app.router.push("/login")
  },

  async [actionTypes.LOGIN]({ commit }, { form }) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      const { data } = await axios.post(
        process.env.API_URL + "auth/login",
        qs.stringify(form),
        config
      )
      commit(mutationTypes.SET_USER, data)
      this.app.router.push("/cameras")
    } catch (err) {
      const message =
        err.response.status === 401
          ? "Incorrect username or password"
          : "Could not login"
      console.log(message)
    }
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  isAuthenticated: state => state.user !== null,
  userName: state => state.user.userName
}

export default {
  state,
  mutations,
  actions,
  getters
}
