<template>
  <div class="search-panel">
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="请输入商品名称"
        @keyup.enter.native="handleSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </el-input>
    </div>

    <!-- 搜索结果列表 -->
    <!-- <div class="search-results" v-if="searchResults && searchResults.length > 0"></div> -->
    <div class="search-results" v-if="displayResults && displayResults.length > 0">
      <el-card
        v-for="item in displayResults"
        :key="item.id"
        class="result-item"
        @click.native="handleSelectProduct(item)"
      >
        <div class="item-content">
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-id">商品ID: {{ item.id }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 无搜索结果时显示提示 -->
    <el-empty 
      v-else-if="searchResults !== null && searchResults.length === 0" 
      description="未找到相关商品"
    ></el-empty>

    <!-- 初始状态显示提示 -->
    <el-empty 
      v-else-if="!displayResults" 
      description="请输入商品名称进行搜索"
    ></el-empty>
  </div>
</template>

<script>
import { mapState } from 'vuex'
//import { mockSearchResults } from '@/mock/mockData.js'

export default {
  name: 'SearchPanel',
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapState(['searchResults', 'showMockData']),
    displayResults() {
      // 如果有真实搜索结果则显示真实结果，否则显示模拟数据
      // return this.searchResults || (this.showMockData ? mockSearchResults : null)
      return this.searchResults 
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery.trim()) {
        this.$message.warning('请输入搜索内容')
        return
      }
      this.$store.dispatch('searchProducts', this.searchQuery)
    },
    handleSelectProduct(product) {
      this.$store.dispatch('fetchProductDetails', product.id)
    }
  }
}
</script>

<style scoped>
.item-id {
  color: #909399;
}
.search-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  padding: 20px;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.result-item {
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.item-content {
  display: flex;
  gap: 15px;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}

.item-score {
  color: #67c23a;
}

.item-price {
  color: #f56c6c;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
}
</style>