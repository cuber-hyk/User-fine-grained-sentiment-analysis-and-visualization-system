import Vue from "vue";
import Vuex from "vuex";
import product from "./modules/product";
import user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    product,
    user,
  },
});
