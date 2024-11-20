import { defineStore } from "pinia";
import { login, register, logout } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(username, password) {
      try {
        const data = await login({ username, password });
        this.token = data.token;
        this.userInfo = data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        return data;
      } catch (error) {
        throw error;
      }
    },

    async register(userData) {
      const data = await register(userData);
      return data;
    },

    async logout() {
      try {
        await logout();
        this.token = "";
        this.userInfo = {};
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } catch (error) {
        throw error;
      }
    },
  },
});
