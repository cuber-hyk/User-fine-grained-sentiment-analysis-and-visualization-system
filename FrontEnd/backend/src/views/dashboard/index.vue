<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20" class="data-cards">
      <el-col :span="6" v-for="card in dataCards" :key="card.title">
        <el-card class="data-card" :class="card.type">
          <div class="card-content">
            <div class="icon-wrapper">
              <i :class="card.icon"></i>
            </div>
            <div class="data-info">
              <div class="title">{{ card.title }}</div>
              <div class="number">{{ card.value }}</div>
              <div class="trend">
                较上周
                <span :class="{ up: card.trend > 0, down: card.trend < 0 }">
                  {{ Math.abs(card.trend) }}%
                  <i
                    :class="card.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'"
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据来源和评论趋势 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>数据来源分析</span>
          </div>
          <div class="chart-container">
            <sources-bar ref="sourcesChart" :data="sourcesData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>评论趋势分析</span>
            <el-radio-group v-model="timeRange" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <trend-chart ref="trendChart" :data="trendData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 情感分布和词云 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="8">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>情感分布</span>
          </div>
          <div class="chart-container">
            <sentiment-pie ref="pieChart" :data="sentimentData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="chart-card">
          <div slot="header" class="chart-header">
            <span>热门关键词</span>
          </div>
          <!-- 词云 -->
          <div class="chart-container">
            <word-cloud ref="wordCloud" :data="wordCloudData" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TrendChart from "./components/TrendChart.vue";
import SentimentPie from "@/components/charts/SentimentPie.vue";
import SourcesBar from "@/components/charts/SourcesBar.vue";
import SentimentRadar from "@/components/charts/SentimentRadar.vue";
import WordCloud from "@/components/charts/WordCloud.vue";

export default {
  name: "Dashboard",
  components: {
    TrendChart,
    SentimentPie,
    SourcesBar,
    SentimentRadar,
    WordCloud,
  },
  data() {
    return {
      timeRange: "week",
      dataCards: [
        {
          title: "总评论数",
          value: "12,846",
          trend: 15.4,
          icon: "el-icon-chat-dot-round",
          type: "primary",
        },
        {
          title: "好评率",
          value: "85.2%",
          trend: 5.6,
          icon: "el-icon-star-on",
          type: "success",
        },
        {
          title: "平均评分",
          value: "4.5",
          trend: -2.3,
          icon: "el-icon-data-analysis",
          type: "warning",
        },
        {
          title: "活跃用户",
          value: "3,254",
          trend: 12.5,
          icon: "el-icon-user",
          type: "info",
        },
      ],
      trendData: [],
      sentimentData: {},
      sourcesData: {
        淘宝: { volume: 4.3, positiveRate: 85 },
        京东: { volume: 2.5, positiveRate: 78 },
        拼多多: { volume: 3.5, positiveRate: 82 },
        天猫: { volume: 4.5, positiveRate: 88 },
        唯品会: { volume: 3.8, positiveRate: 80 },
      },
      radarData: {},
      wordCloudData: [
        { word: "性价比高", count: 100, sentiment: "positive" },
        { word: "质量不错", count: 85, sentiment: "positive" },
        { word: "发货快", count: 75, sentiment: "positive" },
        { word: "屏幕好", count: 70, sentiment: "positive" },
        { word: "性能强", count: 65, sentiment: "positive" },
        { word: "散热差", count: 60, sentiment: "negative" },
        { word: "续航短", count: 55, sentiment: "negative" },
        { word: "性价比低", count: 50, sentiment: "negative" },
        { word: "做工一般", count: 45, sentiment: "neutral" },
        { word: "外观漂亮", count: 40, sentiment: "positive" },
        { word: "系统流畅", count: 38, sentiment: "positive" },
        { word: "信号差", count: 35, sentiment: "negative" },
        { word: "拍照清晰", count: 33, sentiment: "positive" },
        { word: "性能卡顿", count: 30, sentiment: "negative" },
        { word: "价格实惠", count: 28, sentiment: "positive" },
      ],
    };
  },
  methods: {
    async fetchDashboardData() {
      // 模拟数据
      this.trendData = Array(7)
        .fill(null)
        .map((_, index) => ({
          date: new Date(
            Date.now() - (6 - index) * 24 * 3600 * 1000
          ).toLocaleDateString(),
          value: Math.floor(Math.random() * 100 + 100),
          positive: Math.floor(Math.random() * 60 + 40),
          negative: Math.floor(Math.random() * 20),
        }));

      this.sentimentData = {
        正面: 65,
        负面: 15,
        中性: 20,
      };

      this.radarData = {
        性能: 9.2,
        外观: 8.5,
        续航: 7.8,
        散热: 8.3,
        性价比: 9.0,
      };
    },
    initCharts() {
      // 在需要时重新初始化图表
      this.$nextTick(() => {
        this.$refs.trendChart && this.$refs.trendChart.initChart();
        this.$refs.pieChart && this.$refs.pieChart.initChart();
        this.$refs.sourcesChart && this.$refs.sourcesChart.initChart();
        this.$refs.radarChart && this.$refs.radarChart.initChart();
        this.$refs.wordCloud && this.$refs.wordCloud.initChart();
      });
    },
  },
  watch: {
    timeRange() {
      this.fetchDashboardData();
    },
  },
  created() {
    this.fetchDashboardData();
  },
  mounted() {
    this.initCharts();
    // 添加窗口大小变化时重新渲染图表
    window.addEventListener("resize", this.initCharts);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initCharts);
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: var(--main-bg);
}

.data-cards {
  margin-bottom: 20px;
}

.data-card {
  height: 120px;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.icon-wrapper i {
  font-size: 32px;
  color: #fff;
}

.data-info {
  flex: 1;
}

.data-info .title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.data-info .number {
  font-size: 24px;
  font-weight: bold;
  color: #a3b5cf;
  margin-bottom: 8px;
}

.data-info .trend {
  font-size: 12px;
  color: #909399;
}

.trend .up {
  color: #67c23a;
}

.trend .down {
  color: #f56c6c;
}

/* 卡片类型样式 */
.data-card.primary .icon-wrapper {
  background: linear-gradient(135deg, #1890ff, #36cfc9);
}

.data-card.success .icon-wrapper {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.data-card.warning .icon-wrapper {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.data-card.info .icon-wrapper {
  background: linear-gradient(135deg, #722ed1, #b37feb);
}

.chart-row,
.analysis-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 320px;
  width: 100%;
}

/* 添加图表加载动画 */
.chart-container {
  position: relative;
  overflow: hidden;
}

.chart-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  from {
    left: -100%;
  }
  to {
    left: 200%;
  }
}
</style>
