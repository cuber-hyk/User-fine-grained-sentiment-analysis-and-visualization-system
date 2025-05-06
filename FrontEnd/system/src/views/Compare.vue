<template>
  <div class="compare-container">
    <h2 class="title">商品对比</h2>
    <el-button icon="el-icon-back" @click="goBack" class="back-button">返回</el-button>
    
    <div v-if="leftProduct && rightProduct" class="comparison-content">
      <!-- 左侧商品（主页面选择的商品） -->
      <div class="product-column left-product">
        <h3 class="column-title">已选商品</h3>
        <div class="product-card">
          <div class="product-image">
            <el-image :src="leftProduct.image_url" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <h4 class="product-name">{{ leftProduct.name }}</h4>
          <div class="product-details">
            <div class="detail-item">
              <span class="label">评分:</span>
              <span class="value star"><i class="el-icon-star-on"></i> {{ leftProduct.stars }}</span>
            </div>
            <div class="detail-item">
              <span class="label">评论数:</span>
              <span class="value">{{ leftProduct.ratings }}</span>
            </div>
            <div class="detail-item">
              <span class="label">价格:</span>
              <span class="value price">
                <span class="discount-price">{{ leftProduct.discount_price }}</span>
                <span v-if="leftProduct.normal_price !== leftProduct.discount_price" class="normal-price">{{ leftProduct.normal_price }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间对比区域 -->
      <div class="comparison-column">
        <h3 class="column-title">对比项</h3>
        <div class="comparison-items">
          <div class="comparison-item" v-for="(label, key) in productAttributes" :key="key">
            <div class="attribute-name">{{ label }}</div>
            <div class="comparison-values">
              <div class="left-value" :class="{better: isBetter(key, 'left')}">
                {{ getAttributeValue(leftProduct, key) }}
              </div>
              <div class="right-value" :class="{better: isBetter(key, 'right')}">
                {{ getAttributeValue(rightProduct, key) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧商品（搜索选择的商品） -->
      <div class="product-column right-product">
        <h3 class="column-title">搜索商品</h3>
        <div v-if="rightProduct" class="product-card">
          <div class="product-image">
            <el-image :src="rightProduct.image_url" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <h4 class="product-name">{{ rightProduct.name }}</h4>
          <div class="product-details">
            <div class="detail-item">
              <span class="label">评分:</span>
              <span class="value star"><i class="el-icon-star-on"></i> {{ rightProduct.stars }}</span>
            </div>
            <div class="detail-item">
              <span class="label">评论数:</span>
              <span class="value">{{ rightProduct.ratings }}</span>
            </div>
            <div class="detail-item">
              <span class="label">价格:</span>
              <span class="value price">
                <span class="discount-price">{{ rightProduct.discount_price }}</span>
                <span v-if="rightProduct.normal_price !== rightProduct.discount_price" class="normal-price">{{ rightProduct.normal_price }}</span>
              </span>
            </div>
          </div>
          <!-- 添加更换商品按钮 -->
          <div class="change-product-button">
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="openProductSelection">更换商品</el-button>
          </div>
        </div>
        <div v-else class="select-product-placeholder">
          <el-button type="primary" @click="openProductSelection">选择商品</el-button>
        </div>
      </div>
    </div>
    
    <div v-else-if="leftProduct" class="comparison-content">
      <!-- 左侧已有商品但右侧未选择 -->
      <div class="product-column left-product">
        <h3 class="column-title">已选商品</h3>
        <div class="product-card">
          <div class="product-image">
            <el-image :src="leftProduct.image_url" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <h4 class="product-name">{{ leftProduct.name }}</h4>
          <div class="product-details">
            <div class="detail-item">
              <span class="label">评分:</span>
              <span class="value star"><i class="el-icon-star-on"></i> {{ leftProduct.stars }}</span>
            </div>
            <div class="detail-item">
              <span class="label">评论数:</span>
              <span class="value">{{ leftProduct.ratings }}</span>
            </div>
            <div class="detail-item">
              <span class="label">价格:</span>
              <span class="value price">
                <span class="discount-price">{{ leftProduct.discount_price }}</span>
                <span v-if="leftProduct.normal_price !== leftProduct.discount_price" class="normal-price">{{ leftProduct.normal_price }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧选择商品提示 -->
      <div class="product-column right-product select-product-container">
        <h3 class="column-title">搜索商品</h3>
        <div class="select-product-placeholder">
          <p>请选择一个商品进行对比</p>
          <el-button type="primary" @click="openProductSelection">选择商品</el-button>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      <p>请先在主页面选择商品后再进行对比</p>
      <el-button type="primary" @click="goBack">返回主页</el-button>
    </div>

    <!-- 弹窗选择商品 -->
    <el-dialog :visible.sync="productDialogVisible" title="选择商品" @close="closeDialog" width="60%">
      <el-input v-model="searchQuery" placeholder="搜索商品名称" clearable @input="handleSearch" class="search-input"></el-input>
      <div class="search-results" v-if="searchResults && searchResults.length > 0">
        <el-card
          v-for="product in searchResults"
          :key="product.id"
          class="result-item"
          @click.native="selectRightProduct(product)"
        >
          <div class="item-content">
            <div class="item-info">
              <div class="item-name">{{ product.name }}</div>
              <div class="item-id">商品ID: {{ product.id }}</div>
            </div>
          </div>
        </el-card>
      </div>
      <el-empty 
        v-else-if="searchResults !== null && searchResults.length === 0" 
        description="未找到相关商品"
      ></el-empty>
      <el-empty 
        v-else
        description="请输入商品名称进行搜索"
      ></el-empty>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '', // 搜索框的输入值
      searchResults: null, // 搜索结果
      productDialogVisible: false, // 控制弹窗是否可见
      rightProduct: null, // 右侧商品（通过搜索选择）
      productAttributes: {
        stars: "评分",
        ratings: "评论数",
        discount_price: "折扣价",
        normal_price: "原价"
      }
    };
  },
  
  computed: {
    // 从Vuex获取compareList，左侧商品是compareList的第一个商品
    ...mapState(['compareList']),
    
    // 左侧商品（主页面已选商品）
    leftProduct() {
      return this.compareList.length > 0 ? this.compareList[0] : null;
    }
  },
  
  mounted() {
    // 如果没有左侧商品，提示用户先在主页选择商品
    if (!this.leftProduct) {
      this.$message.warning('请先在主页面选择商品');
    }
  },
  
  methods: {
    // 返回主页
    goBack() {
      this.$router.push("/home");
    },
    
    // 打开商品选择弹窗
    openProductSelection() {
      this.productDialogVisible = true;
    },
    
    // 关闭弹窗
    closeDialog() {
      this.productDialogVisible = false;
    },
    
    // 搜索商品
    async handleSearch() {
      if (!this.searchQuery.trim()) {
        this.$message.warning('请输入搜索内容');
        return;
      }
      
      try {
        // 调用搜索API - 使用正确的API路径 SearchProductByName
        const response = await axios({
          url: '/api/product/SearchProductByName',
          method: 'get',
          params: {
            name: this.searchQuery
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': window.sessionStorage.getItem('token')
          }
        });
        
        console.log('搜索响应:', response);
        
        if (response.data.code === 200) {
          if (!response.data.data || !Array.isArray(response.data.data)) {
            console.error('返回数据格式错误:', response.data);
            this.$message.error('返回数据格式错误');
            this.searchResults = [];
            return;
          }
          
          // 转换数据格式以匹配界面需求
          this.searchResults = response.data.data.map(item => ({
            id: item.pid,
            name: item.name || '',
            score: item.stars || '',
            price: item.discount_price || ''
          }));
          
          console.log('转换后的搜索结果:', this.searchResults);
        } else {
          console.error('搜索失败:', response.data.message);
          this.$message.error(response.data.message || '搜索失败');
          this.searchResults = [];
        }
      } catch (error) {
        console.error('搜索失败:', error);
        console.error('错误详情:', error.response?.data);
        this.$message.error(error.message || '搜索请求失败，请检查网络连接');
        this.searchResults = [];
      }
    },
    
    // 选择右侧商品
    async selectRightProduct(product) {
      try {
        console.log('正在获取商品详情，传入参数:', product);
        
        // 确保有商品ID
        const pid = product.id || product.pid;
        if (!pid) {
          console.error('商品ID为空，传入的参数:', product);
          this.$message.error('商品ID不能为空');
          return;
        }
        
        // 获取商品详情 - 使用正确的API路径 getProductInfoByPid
        const response = await axios({
          url: '/api/product/getProductInfoByPid',
          method: 'get',
          params: { pid: pid.toString() },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        console.log('商品详情API响应:', response);
        
        if (response.data.code === 200) {
          this.rightProduct = response.data.data;
          this.closeDialog();
        } else {
          console.error('获取商品详情失败:', response.data);
          this.$message.error(response.data.message || '获取商品详情失败');
        }
      } catch (error) {
        console.error('获取商品详情失败:', error);
        console.error('错误详情:', error.response?.data);
        this.$message.error(error.message || '获取商品详情请求失败，请检查网络连接');
      }
    },
    
    // 获取属性值
    getAttributeValue(product, key) {
      if (!product) return '-';
      return product[key] || '-';
    },
    
    // 判断哪个值更好
    isBetter(key, side) {
      if (!this.leftProduct || !this.rightProduct) return false;
      
      const leftValue = this.getNumericValue(this.leftProduct[key]);
      const rightValue = this.getNumericValue(this.rightProduct[key]);
      
      if (leftValue === null || rightValue === null) return false;
      
      // 对于价格，值越小越好
      if (key === 'discount_price' || key === 'normal_price') {
        return (side === 'left' && leftValue < rightValue) || 
               (side === 'right' && rightValue < leftValue);
      }
      
      // 对于其他属性（评分、评论数），值越大越好
      return (side === 'left' && leftValue > rightValue) || 
             (side === 'right' && rightValue > leftValue);
    },
    
    // 获取数值
    getNumericValue(value) {
      if (value === undefined || value === null || value === '-') return null;
      
      // 如果是字符串，尝试提取数字部分
      if (typeof value === 'string') {
        // 移除货币符号和非数字字符，保留小数点
        const numStr = value.replace(/[^0-9.]/g, '');
        return numStr ? parseFloat(numStr) : null;
      }
      
      return typeof value === 'number' ? value : null;
    }
  }
};

</script>

<style scoped>
.compare-container {
  padding: 30px;
  background: linear-gradient(145deg, #1e1e2f, #262d3d);
  border-radius: 15px;
  color: white;
  max-width: 1200px;
  margin: 40px auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 28px;
  margin-bottom: 30px;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
}

.back-button {
  position: absolute;
  top: 30px;
  left: 30px;
}

.comparison-content {
  display: flex;
  margin-top: 30px;
  gap: 20px;
}

.product-column {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.comparison-column {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 20px;
}

.column-title {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: #409eff;
}

.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 200px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.product-name {
  font-size: 18px;
  margin-bottom: 15px;
  color: #ffffff;
}

.product-details {
  flex: 1;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.label {
  color: rgba(255, 255, 255, 0.7);
}

.value {
  font-weight: bold;
}

.star {
  color: #e6a23c;
}

.price .discount-price {
  color: #f56c6c;
  font-weight: bold;
}

.price .normal-price {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
  margin-left: 8px;
  font-size: 0.9em;
}

.comparison-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comparison-item {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
}

.attribute-name {
  font-size: 16px;
  margin-bottom: 10px;
  color: #409eff;
  text-align: center;
}

.comparison-values {
  display: flex;
  justify-content: space-between;
}

.left-value, .right-value {
  flex: 1;
  padding: 10px;
  text-align: center;
  transition: all 0.3s ease;
}

.better {
  color: #67c23a;
  font-weight: bold;
  background-color: rgba(103, 194, 58, 0.1);
  border-radius: 4px;
}

.select-product-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;
}

.select-product-container {
  justify-content: center;
  align-items: center;
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  gap: 20px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
}

/* 搜索弹窗样式 */
.search-input {
  margin-bottom: 20px;
  color: #000  !important;
}

/* 覆盖Element UI输入框样式，与主页面搜索框保持一致 */
.search-input .el-input__inner {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.search-input .el-input__inner:focus {
  border-color: rgba(2, 166, 181, 0.6) !important;
  box-shadow: 0 0 10px rgba(2, 166, 181, 0.2);
}

.search-input .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.3) !important;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-content {
  display: flex;
  justify-content: space-between;
}

.item-name {
  font-weight: bold;
}

.item-id {
  color: #909399;
  font-size: 0.9em;
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

/* 更换商品按钮样式 */
.change-product-button {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.change-product-button .el-button {
  width: 100%;
  background-color: rgba(64, 158, 255, 0.8);
  border-color: rgba(64, 158, 255, 0.8);
  transition: all 0.3s ease;
}

.change-product-button .el-button:hover {
  background-color: #409eff;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>