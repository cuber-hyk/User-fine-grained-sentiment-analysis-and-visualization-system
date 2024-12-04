<template>
  <div class="sentiment-chart">
    <h2 class="panel-title">情感极性分析</h2>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
// 导入echarts库
import * as echarts from 'echarts'
// 导入vuex状态管理方法
import { mapState } from 'vuex'

// 定义SentimentChart组件
export default {
  name: 'SentimentChart',
  data() {
    return {
      chart: null // 初始化图表对象
    }
  },
  computed: {
    ...mapState(['productDetails']) // 映射vuex中的state
  },
  watch: {
    productDetails: {
      // 监视productDetails的变化
      handler(val) {
        if (val && val.sentiment) {
          this.$nextTick(() => {
            this.updateChart() // 更新图表
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    // 组件挂载后初始化图表
    this.$nextTick(() => {
      this.initChart()
    })
    window.addEventListener('resize', this.resizeChart) // 监听窗口大小变化
  },
  beforeDestroy() {
    // 组件销毁前，清理资源
    if (this.chart) {
      this.chart.dispose() // 释放图表实例
      this.chart = null
    }
    window.removeEventListener('resize', this.resizeChart) // 移除事件监听
  },
  methods: {
    initChart() {
      // 初始化图表
      if (this.chart) {
        this.chart.dispose() // 释放已有图表实例
      }
      this.chart = echarts.init(this.$refs.chartContainer) // 创建新的图表实例
      if (this.productDetails && this.productDetails.sentiment) {
        this.updateChart() // 更新图表数据
      }
    },
    updateChart() {
      // 更新图表的数据
      if (!this.chart || !this.productDetails || !this.productDetails.sentiment) return

      const { sentiment } = this.productDetails // 获取情感数据
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          },
          data: ['正面', '负面', '中性'] // 图例数据
        },
        series: [
          {
            name: '情感分析',
            type: 'pie', // 饼图类型
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {c}%', // 标签格式
              color: '#fff',
              fontSize: 14
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            data: [
              { 
                value: sentiment.正面, 
                name: '正面', 
                itemStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#67e0e3' },
                    { offset: 1, color: '#32c5e9' }
                  ])
                } 
              },
              { 
                value: sentiment.负面, 
                name: '负面', 
                itemStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff9f7f' },
                    { offset: 1, color: '#fb7293' }
                  ])
                } 
              },
              { 
                value: sentiment.中性, 
                name: '中性', 
                itemStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#9fe6b8' },
                    { offset: 1, color: '#37a2da' }
                  ])
                } 
              }
            ]
          }
        ]
      }

      this.chart.setOption(option) // 设置图表选项
    },
    resizeChart() {
      // 处理图表大小调整
      if (this.chart) {
        this.chart.resize() // 调整图表尺寸
      }
    }
  }
}
</script>

<style scoped>
.sentiment-chart {
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

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 300px;  
}
</style>