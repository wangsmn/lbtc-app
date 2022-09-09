import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:
      localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("token")),
    user:
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")),
  },
  mutations: {
    SET_TOKEN(state, data) {
      localStorage.setItem("token", JSON.stringify(data));
      state.token = data;
    },
    SET_USER(state, data) {
      localStorage.setItem("user", JSON.stringify(data));
      state.user = data;
    },
    LOGOUT(state) {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
  },
  actions: {},
  modules: {},
});
