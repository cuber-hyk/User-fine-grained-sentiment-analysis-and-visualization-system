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
          <product-display class="panel" :product-id="currentProductId" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('sentiment-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">情感极性分析</h3> -->
          <sentiment-chart class="panel" :product-id="currentProductId" />
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
          <div class="detail-button" @click="navigateTo('aspect-opinions-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">主题挖掘分析</h3> -->
          <aspect-opinions-chart :initAspect="activeAspect" class="panel" :product-id="currentProductId" />
        </div>
        <div class="panel-wrapper">
          <div class="detail-button" @click="navigateTo('source-detail')">
            <i class="el-icon-full-screen"></i>
          </div>
          <!-- <h3 class="panel-title">数据来源分析</h3> -->
          <source-chart class="panel" :product-id="currentProductId" />
        </div>
      </div>
      <!-- 添加 UserProfile 组件，通过 v-if 控制显示 -->
      <user-profile v-if="showUserProfile" @close="showUserProfile = false" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SearchPanel from "@/components/SearchPanel.vue";
import ProductDisplay from "@/components/ProductDisplay.vue";
import SentimentChart from "@/components/SentimentChart.vue";
import TrendChart from "@/components/TrendChart.vue";
// 已删除冗余的ReviewsDisplay组件
import SourceChart from "@/components/SourceChart.vue";
import UserProfile from "@/components/UserProfile.vue"; // 引入 UserProfile 组件
import AspectOpinionsChart from "@/components/AspectOpinionsChart.vue";
// import { mockProductDetails, mockTrendsData } from "@/mock/mockData.js"; // 导入模拟数据 (移除)

export default {
  name: "HomePage",
  components: {
    SearchPanel,
    ProductDisplay,
    SentimentChart,
    TrendChart,
    // 已删除冗余的ReviewsDisplay组件
    SourceChart,
    UserProfile,
    AspectOpinionsChart,
  },
  data() {
    return {
      showUserProfile: false
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      user: (state) => state.user,
      currentProductId: (state) => state.currentProduct ? state.currentProduct.pid : null,
      activeAspect: (state) => state.activeAspect
    }),
  },
  watch: { // 添加 watcher 监听 currentProductId 变化
      currentProductId(newVal, oldVal) {
          // 当 currentProductId 有效值且发生变化时，触发数据获取
          if (newVal && newVal !== oldVal) {
              console.log('currentProductId changed to:', newVal); // 调试信息
              this.fetchProductDetails({ pid: newVal });
          }
           // 可以根据需要处理 newVal 为 null 的情况，例如清空图表数据
           if (!newVal && oldVal) {
               console.log('currentProductId is now null, consider clearing data in store if necessary.'); // 调试信息
               // 可以在 store 中添加一个 action 或 mutation 来清空当前商品数据
           }
      }
  },
  methods: {
    ...mapActions(["fetchUserInfo", "fetchProductDetails"]), // 映射 fetchProductDetails action
    async goToUserProfile() {
      try {
        await this.fetchUserInfo();
        this.showUserProfile = true;
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
    navigateTo(route) {
      this.$router.push(`/${route}`);

      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  },
  async created() {
    if (this.user.userId) {
      try {
        await this.fetchUserInfo();
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }

    // 如果在组件创建时已经有选中的商品ID，则获取数据
    if (this.currentProductId) {
        console.log('Home created with existing currentProductId:', this.currentProductId); // 调试信息
        this.fetchProductDetails({ pid: this.currentProductId });
    } else {
        // 如果没有选中的商品ID，则默认加载指定商品数据
        const defaultProductId = '325934770006';
        console.log('No currentProductId, fetching default product:', defaultProductId); // 调试信息
        this.fetchProductDetails({ pid: defaultProductId });
    }

    // 移除加载模拟数据的逻辑
    // if (!this.$store.state.productDetails) {
    //   this.$store.commit('SET_PRODUCT_DETAILS', mockProductDetails);
    // }
    // if (!this.$store.state.trendsData) {
    //   this.$store.commit('SET_TRENDS_DATA', mockTrendsData);
    // }
  },
  mounted() {
    // 在组件挂载后（包括路由切换但组件被重用时）再次尝试获取用户信息
    if (this.user.userId) {
      try {
        this.fetchUserInfo(); // 不需要 await，不阻塞 mounted 钩子
        console.log('Attempting to fetch user info in mounted hook.'); // 调试信息
      } catch (error) {
        console.error("获取用户信息失败 (mounted):", error);
      }
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
