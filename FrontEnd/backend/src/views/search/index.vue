<template>
  <div class="search-container">
    <el-card class="search-card">
      <div class="search-header">
        <div class="search-input-container">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入商品名称"
            class="search-input"
            clearable
            @keyup.enter.native="handleSearch"
          />
          <el-button
            class="search-button"
            icon="el-icon-search"
            @click="handleSearch"
            >搜索</el-button
          >
        </div>
      </div>

      <div v-loading="loading" class="search-result">
        <template v-if="searchResults.length">
          <el-card
            v-for="item in searchResults"
            :key="item.id"
            class="product-card"
            shadow="hover"
            @click.native="goToDetail(item.id)"
          >
            <div class="product-info">
              <div class="product-name">
                <h3>{{ item.name }}</h3>
                <el-tag size="small" type="success"
                  >评分: {{ item.score }}</el-tag
                >
              </div>
              <div class="product-meta">
                <span class="price">￥{{ item.price }}</span>
                <el-button type="text" size="small" icon="el-icon-view"
                  >查看详情</el-button
                >
              </div>
            </div>
          </el-card>
        </template>
        <el-empty v-else-if="!loading" description="暂无搜索结果" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      searchKeyword: "",
      loading: false,
    };
  },
  computed: {
    ...mapState({
      searchResults: (state) => state.product.searchResults || [],
    }),
  },
  created() {
    this.handleSearch();
  },
  methods: {
    ...mapActions(["searchProducts"]),
    async handleSearch() {
      this.loading = true;
      try {
        await this.searchProducts(this.searchKeyword);
      } catch (error) {
        console.error("Search error:", error);
        this.$message.error("搜索失败，请重试");
      } finally {
        this.loading = false;
      }
    },
    goToDetail(id) {
      this.$router.push(`/product/${id}`);
    },
  },
};
</script>

<style scoped>
.search-container {
  min-height: 100%;
}

.search-card {
  margin-bottom: 20px;
}

.search-header {
  padding: 20px 0;
}

.search-input-container {
  display: flex;
  justify-content: center; /* Center the input and button */
  align-items: center; /* Align items vertically */
}

.search-input {
  width: 400px; /* Adjust width as needed */
  margin-right: 10px; /* Space between input and button */
}

.search-button {
  height: 100%; /* Make button height equal to input */
}

.search-result {
  margin-top: 20px;
}

.product-card {
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-name h3 {
  margin: 0;
  font-size: 16px;
  color: #bad0fd;
  font-weight: 500;
}

.product-name .el-tag {
  background-color: #697993;
  border-color: #e1f3d8;
  color: #fffc47;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
}
</style> 