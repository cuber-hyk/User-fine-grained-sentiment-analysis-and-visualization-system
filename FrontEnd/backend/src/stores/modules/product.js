export default {
  state: {
    searchResults: [],
    currentProduct: null,
  },

  mutations: {
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    SET_CURRENT_PRODUCT(state, product) {
      state.currentProduct = product;
    },
  },

  actions: {
    async searchProducts({ commit }, keyword) {
      try {
        const response = await this._vm.$api.product.searchProducts(keyword);
        commit("SET_SEARCH_RESULTS", response);
        return response;
      } catch (error) {
        console.error("Search products error:", error);
        throw error;
      }
    },

    async getProductDetail({ commit }, id) {
      try {
        const response = await this._vm.$api.product.getProductDetail(id);
        commit("SET_CURRENT_PRODUCT", response);
        return response;
      } catch (error) {
        console.error("Get product detail error:", error);
        throw error;
      }
    },
  },
};
