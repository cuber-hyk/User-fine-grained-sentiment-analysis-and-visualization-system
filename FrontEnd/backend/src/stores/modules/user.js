export default {
  state: {
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    CLEAR_USER_DATA(state) {
      state.token = "";
      state.userInfo = {};
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },

  actions: {
    async login({ commit }, { username, password }) {
      try {
        const data = await this._vm.$api.user.login({ username, password });
        commit("SET_TOKEN", data.token);
        commit("SET_USER_INFO", data);
        return data;
      } catch (error) {
        throw error;
      }
    },

    async register(_, userData) {
      const data = await this._vm.$api.user.register(userData);
      return data;
    },

    async logout({ commit }) {
      try {
        await this._vm.$api.user.logout();
        commit("CLEAR_USER_DATA");
      } catch (error) {
        throw error;
      }
    },
  },
};
