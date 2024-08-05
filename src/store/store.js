import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  state: {
    token: null,
    user: null,
    loggedIn: false
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.loggedIn = true;
    },
    setUser(state, user) {
      state.user = user;
      state.loggedIn = true;
    },
    clearAuthData(state) {
      state.token = null;
      state.user = null;
      state.loggedIn = false;
    },
  },
  actions: {
    async setUser({ commit }, user) {
      console.log('USER: ' + JSON.stringify(user))
      commit("setUser", user);
    },
    async setToken({ commit }, token) {
      console.log('TOKEN: Bearer' +token)
      commit("setToken", token);
    },
    async logout({ commit }) {
      commit('clearAuthData');
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.loggedIn;
    },
    getToken(state) {
      return state.token;
    },
    getUser(state) {
      return state.user;
    },
    isAdmin(state) {
      return state.user.role_id === 1;
    },
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'token', 'loggedIn'] // Persist only specific paths in the state
    })
  ]
});

export default store;
