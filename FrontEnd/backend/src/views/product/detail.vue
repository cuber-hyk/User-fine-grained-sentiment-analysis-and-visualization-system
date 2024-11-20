<template>
  <div v-loading="loading">
    <el-card v-if="product">
      <div slot="header" class="card-header">
        <h3>{{ product.name }}</h3>
        <div class="price">
          ￥{{ product.priceMin }} - {{ product.priceMax }}
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <sentiment-radar :data="product.radar"></sentiment-radar>
        </el-col>
        <el-col :span="12">
          <sentiment-pie :data="product.sentiment"></sentiment-pie>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-4">
        <el-col :span="16">
          <sentiment-trend :data="product.trends"></sentiment-trend>
        </el-col>
        <el-col :span="8">
          <sources-bar :data="product.sources"></sources-bar>
        </el-col>
      </el-row>

      <el-row class="mt-4">
        <el-col :span="24">
          <el-card>
            <div slot="header" class="card-header">
              <span>评价标签</span>
            </div>
            <div v-for="(tags, category) in product.reviews" :key="category">
              <h4>{{ category }}</h4>
              <el-tag
                v-for="tag in tags"
                :key="tag"
                class="tag-item"
                type="success"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SentimentRadar from "@/components/charts/SentimentRadar";
import SentimentPie from "@/components/charts/SentimentPie";
import SentimentTrend from "@/components/charts/SentimentTrend";
import SourcesBar from "@/components/charts/SourcesBar";

export default {
  name: "ProductDetail",
  components: {
    SentimentRadar,
    SentimentPie,
    SentimentTrend,
    SourcesBar,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      product: (state) => state.product.currentProduct,
    }),
  },
  methods: {
    ...mapActions(["getProductDetail"]),
  },
  created() {
    const productId = this.$route.params.id;
    if (productId) {
      this.loading = true;
      this.getProductDetail(productId).finally(() => {
        this.loading = false;
      });
    }
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
}

.tag-item {
  margin: 0 5px 5px 0;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}
</style> 