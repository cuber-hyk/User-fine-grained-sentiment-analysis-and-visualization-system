import { defineStore } from "pinia";
import { searchProducts, getProductDetail } from "@/api/product";

export const useProductStore = defineStore("product", {
  state: () => ({
    searchResults: [],
    currentProduct: null,
    loading: false,
  }),

  actions: {
    async searchProducts(keyword) {
      this.loading = true;
      try {
        const data = await searchProducts(keyword);
        this.searchResults = data;
      } finally {
        this.loading = false;
      }
    },

    async getProductDetail(id) {
      this.loading = true;
      try {
        const data = await getProductDetail(id);
        this.currentProduct = data;
      } finally {
        this.loading = false;
      }
    },
  },
});
