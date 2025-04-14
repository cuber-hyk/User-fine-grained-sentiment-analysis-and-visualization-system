<template>
  <div class="home">
    <div class="head">
      <h1 class="title">可视化智能评论分析系统</h1>
      <div class="nav">
        <div
          v-if="username"
          class="nav-link user-profile"
          @click="goToUserProfile"
        >
          <img
            v-if="user.icon"
            :src="user.icon"
            alt="用户头像"
            class="user-avatar"
          />
          <span class="username">{{ username }}</span>
        </div>
        <div v-else class="auth-links">
          <router-link :to="'/Register'" class="nav-link">注册</router-link>
          <router-link :to="'/Login'" class="nav-link">登录</router-link>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="row">
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('search-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">商品搜索</h3> -->
          <search-panel class="panel" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('product-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">商品详情</h3> -->
          <product-display class="panel" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('sentiment-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">情感极性分析</h3> -->
          <sentiment-chart class="panel" />
        </div>
      </div>
      <div class="row">
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('trend-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">评论时间趋势</h3> -->
          <trend-chart class="panel" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('reviews-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">评论分析</h3> -->
          <reviews-display class="panel" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('source-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">数据来源展示</h3> -->
          <source-chart class="panel" />
        </div>
      </div>
    </div>
    <!-- 添加 UserProfile 组件，通过 v-if 控制显示 -->
    <user-profile v-if="showUserProfile" @close="showUserProfile = false" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SearchPanel from "@/components/SearchPanel.vue";
import ProductDisplay from "@/components/ProductDisplay.vue";
import SentimentChart from "@/components/SentimentChart.vue";
import TrendChart from "@/components/TrendChart.vue";
import ReviewsDisplay from "@/components/ReviewsDisplay.vue";
import SourceChart from "@/components/SourceChart.vue";
import UserProfile from "@/components/UserProfile.vue"; // 引入 UserProfile 组件
import { mockProductDetails, mockTrendsData } from "@/mock/mockData.js"; // 导入模拟数据

export default {
  name: "HomePage",
  components: {
    SearchPanel,
    ProductDisplay,
    SentimentChart,
    TrendChart,
    ReviewsDisplay,
    SourceChart,
    UserProfile, // 注册 UserProfile 组件
  },
  data() {
    return {
      showUserProfile: false // 控制 UserProfile 组件的显示与隐藏
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      user: (state) => state.user,
    }),
  },
  methods: {
    ...mapActions(["fetchUserInfo"]),
    async goToUserProfile() {
      try {
        // 点击时再次触发获取信息的请求
        await this.fetchUserInfo();
        this.showUserProfile = true; // 显示 UserProfile 组件
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    // 导航到详情页面
    navigateTo(route) {
      this.$router.push(`/${route}`);
      
      // 触发窗口resize事件，确保图表在新页面中正确渲染
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  },
  async created() {
    if (this.user.userId) {
      try {
        // 登录后触发获取信息的请求
        await this.fetchUserInfo();
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }
    
    // 如果没有产品详情数据，则使用模拟数据
    if (!this.$store.state.productDetails) {
      this.$store.commit('SET_PRODUCT_DETAILS', mockProductDetails);
    }
    
    // 如果没有趋势数据，则使用模拟数据
    if (!this.$store.state.trendsData) {
      this.$store.commit('SET_TRENDS_DATA', mockTrendsData);
    }
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  min-height: 100vh;
}

.head {
  position: relative;
  height: 80px;
  background: linear-gradient(
    90deg,
    rgba(2, 166, 181, 0.1) 0%,
    rgba(2, 166, 181, 0.2) 50%,
    rgba(2, 166, 181, 0.1) 100%
  );
  margin-bottom: 30px;
  border: 1px solid rgba(2, 166, 181, 0.3);
  border-radius: 4px;
  padding: 0 20px;
}

.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 36px;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
}

.nav {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.auth-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  color: #68f1fa;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.user-profile:hover {
  opacity: 0.8;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 16px;
  color: #ffffff;
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative; /* 添加相对定位，作为放大面板的定位参考 */
}

.row {
  display: flex;
  gap: 20px;
  height: calc(50vh - 80px);
  min-height: 400px;
  position: relative; /* 添加相对定位 */
}

.panel-wrapper {
  flex: 1;
  position: relative;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1); /* 使用更高效的过渡函数 */
  will-change: transform, opacity;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(2, 166, 181, 0.15);
  transform-origin: center center;
  backface-visibility: hidden;
  /* 添加GPU加速，减少页面卡顿 */
  transform: translateZ(0);
}

.panel {
  height: 100%;
  padding: 20px;
  transition: all 0.3s ease;
}

.panel-wrapper:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.2);
}



/* 详情按钮样式 */
.detail-button {
  position: absolute;
  top: 10px;
  /* right: 10px; */
  left: 10px;
  
  width: 30px;
  height: 30px;
  background-color: rgba(2, 166, 181, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0.7;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.detail-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.detail-button i {
  color: white;
  font-size: 16px;
}

.panel-title {
  position: absolute;
  top: 10px;
  left: 15px;
  margin: 0;
  font-size: 16px;
  color: #ffffff;
  z-index: 5;
}

@media (max-width: 1600px) {
  .content-grid {
    max-width: 1400px;
  }
}
</style>
