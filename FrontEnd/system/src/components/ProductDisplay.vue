<template>
  <div class="product-display">
    <h2 class="panel-title">商品展示</h2>
    <div v-if="productDetails" class="product-content">
      <h3 class="product-name">{{ productDetails.name }}</h3>
      <div class="product-image">
        <el-image
          :src="productDetails.image"
          fit="cover"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="product-price">
        ¥{{ productDetails.priceMin }} - {{ productDetails.priceMax }}
      </div>
      <div class="product-score">
        综合评分：<span class="score">{{ productDetails.score }}</span>
      </div>
    </div>
    <div v-else class="no-product">
      <el-empty description="请先搜索并选择商品"></el-empty>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'    // 导入mapState辅助函数,快速映射store中的状态

export default {
  name: 'ProductDisplay',
  computed: { 
    // 计算属性，依赖于vuex中的productDetails
    ...mapState(['productDetails'])    // 映射productDetails状态
    // 与下面式子等价：
    // productDetails() {
    //   return this.$store.state.productDetails
    // }
  }
}
</script>

<style scoped>
.product-display {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 20px;
  margin-bottom: 25px;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 1px;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.product-name {
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.product-image {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.product-image .el-image {
  width: 100%;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
}

.product-price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.product-score {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.score {
  color: #67c23a;
  font-weight: bold;
}

.no-product {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  font-size: 30px;
}
</style> 