<template>
  <div class="product-display" :class="{'fullscreen-mode': fullscreen}">
    <h2 class="panel-title">商品展示</h2>
    <div v-if="productDetails" class="product-content">
      <h3 class="product-name">{{ productDetails.name?.trim() ?? '' }}</h3>
      <div v-if="productDetails.image_url" class="product-image">
        <el-image :src="productDetails.image_url" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <!-- <div class="product-price">
        ¥{{ productDetails.priceMin }} - {{ productDetails.priceMax }}
      </div> -->
      <!-- <div class="product-score">
        综合评分：<span class="score">{{ productDetails.score }}</span>
      </div> -->
      <!-- 收藏按钮 -->
      <template>
        <el-button type="text" class="favorite-button" @click="toggleFavorite">
          <el-icon
            :class="{
              'el-icon-star-on': isFavorited,
              'el-icon-star-off': !isFavorited,
            }"
          ></el-icon>
        </el-button>
      </template>
      <!-- 去对比按钮 -->
      <el-button class="compare-button" type="primary" @click="goToCompare">去对比</el-button>
      <div class="product-info">
        <div class="info-item">
          <i class="el-icon-star-on"></i>
          <span class="star">评分: {{ productDetails.stars?.trim() ?? '' }}</span>
        </div>
       
        <div class="info-item price">
          <i class="el-icon-price-tag"></i>
          <span>价格: 
            <span class="discount-price">{{ productDetails.discount_price }}</span>
            <span v-if="productDetails.normal_price !== productDetails.discount_price" 
                  class="normal-price">{{ productDetails.normal_price }}
            </span>
          </span>
           
        </div>
        <div v-if="fullscreen" class="info-item">
          <i class="el-icon-chat-line-square"></i>
          <span>评论数: {{ productDetails.ratings }}</span>
          </div>
          <div v-if="fullscreen && productDetails.channel" class="info-item">
            <i class="el-icon-shopping-cart-full"></i>
            <span>来源: {{ productDetails.channel }}</span>
          </div>
        <div v-if="fullscreen && productDetails.classification" class="info-item description">
          <i class="el-icon-info"></i>
          <span>商品描述: {{ productDetails.classification }}</span>
        </div>
      </div>
    </div>
    <div v-else class="no-product">
      <el-empty description="请先搜索并选择商品"></el-empty>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  name: "ProductDisplay",
  computed: {
    ...mapState(["productDetails"]),
    // 获取当前路由路径
    currentRoute() {
      return this.$route.path;
    },
    // 判断当前商品是否已收藏
    isFavorited() {
      if (!this.productDetails) return false;
      return this.$store.getters['favorites/isFavorited'](this.productDetails.pid);
    }
  },
  methods: {
    toggleFavorite() {
      if (!this.productDetails) return;
      
      // 获取当前用户ID
      const userId = this.$store.state.user.userId;
      if (!userId) {
        this.$message.error('请先登录');
        return;
      }
      
      if (this.isFavorited) {
        // 如果已收藏，则取消收藏
        this.$store.dispatch('favorites/removeFromFavorites', { userId, productId: this.productDetails.pid });
        this.$message.success('已取消收藏');
      } else {
        // 如果未收藏，则添加到收藏
        this.$store.dispatch('favorites/addToFavorites', { userId, product: this.productDetails });
        this.$message.success('已添加到收藏');
      }
    },
    goToCompare() {
      // 将当前商品添加到 Vuex 存储的对比列表
      this.$store.commit('ADD_TO_COMPARE_LIST', this.productDetails);
      this.$router.push('/Compare'); // 跳转到对比页面
    },
  },
  // 监听路由变化
  watch: {
    // currentRoute: {
    //   handler() {
    //     this.checkAndResetState();
    //   },
    //   immediate: true
    // }
  },
  // 组件激活时检查状态
  // activated() {
  //   this.checkAndResetState();
  // },
  // 组件挂载后检查状态
  // mounted() {
  //   this.checkAndResetState();
  // }
};
</script>

<style scoped>
.star {
  color: #67c23a;
  font-weight: bold;
  /* font-size:20px */
}
.product-display {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.panel-title {
  font-size: 20px;
  margin-bottom: 10px;
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
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  margin: 0;
}

.product-image {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  font-size: 25px;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 5px;
}

.favorite-button i {
  font-size: 18px;
}

.compare-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  background-color: #409eff;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e6e6e6;
}

.info-item i {
  color: #409EFF;
}

.price .discount-price {
  color: #F56C6C;
  font-weight: bold;
  /* font-size: 1.2em; */
  font-size: 15px;
}

.price .normal-price {
  text-decoration: line-through;
  color: #909399;
  margin-left: 10px;
}

.description {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 全屏模式样式 */
.fullscreen-mode .panel-title {
  font-size: 28px;
  margin-bottom: 35px;
}

.fullscreen-mode .product-name {
  font-size: 22px;
  margin-bottom: 10px;
}

.fullscreen-mode .product-image {
  max-width: 500px;
}

.fullscreen-mode .product-image .el-image {
  height: 350px;
}

.fullscreen-mode .info-item {
  font-size: 18px;
  gap: 15px;
  margin-bottom: 5px;
}

.fullscreen-mode .info-item i {
  font-size: 20px;
}

.fullscreen-mode .price .discount-price {
  font-size: 24px;
}

.fullscreen-mode .price .normal-price {
  font-size: 18px;
}

.fullscreen-mode .favorite-button i {
  font-size: 24px;
}

.fullscreen-mode .compare-button {
  font-size: 16px;
  padding: 8px 15px;
}

.fullscreen-mode .star {
  font-size: 20px;
}
</style>
