import { createStore } from 'vuex';

const store = createStore({
  state: {
    token: null,
    user: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.token = null;
      state.user = null;
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
      return !!state.token;
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
});

export default store;
