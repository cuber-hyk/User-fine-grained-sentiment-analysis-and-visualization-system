import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import product from "./modules/product";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    product,
  },
  strict: process.env.NODE_ENV !== "production",
});
