<template>
  <div class="home">
    <div class="head">
      <h1 class="title">可视化智能评论分析系统</h1>
    </div>
    <div class="content-grid">
      <div class="row">
        <search-panel class="panel" />
        <product-display class="panel" />
        <sentiment-chart class="panel" />
      </div>
      <div class="row">
        <trend-chart class="panel" />
        <reviews-display class="panel" />
        <source-chart class="panel" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchPanel from '@/components/SearchPanel.vue'
import ProductDisplay from '@/components/ProductDisplay.vue'
import SentimentChart from '@/components/SentimentChart.vue'
import TrendChart from '@/components/TrendChart.vue'
import ReviewsDisplay from '@/components/ReviewsDisplay.vue'
import SourceChart from '@/components/SourceChart.vue'

export default {
  name: 'HomePage',
  components: {
    SearchPanel,
    ProductDisplay,
    SentimentChart,
    TrendChart,
    ReviewsDisplay,
    SourceChart
  }
}
</script>

<style scoped>
/* 主页样式 */
.home {
  padding: 20px;
  min-height: 100vh;
}

/* 头部样式 */
.head {
  position: relative;
  height: 80px;
  background: linear-gradient(90deg, rgba(2,166,181,0.1) 0%, rgba(2,166,181,0.2) 50%, rgba(2,166,181,0.1) 100%);
  margin-bottom: 30px;
  border: 1px solid rgba(2,166,181,0.3);
  border-radius: 4px;
}

/* 标题样式 */
.title {
  text-align: center;
  color: #ffffff;
  font-size: 36px;
  line-height: 80px;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
}

/* 内容网格样式 */
.content-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 行样式 */
.row {
  display: flex;
  gap: 20px;
  height: calc(50vh - 80px);
  min-height: 400px;
}

/* 面板样式 */
.panel {
  flex: 1;
  padding: 20px;
  transition: all 0.3s ease;
}

/* 面板悬停效果 */
.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(2, 166, 181, 0.2);
}

/* 媒体查询，表示当浏览器的视口（viewport）宽度小于或等于1600像素时，里面定义的样式规则才会生效 */
@media (max-width: 1600px) {
  .content-grid {
    max-width: 1400px;
  }
}
</style> 