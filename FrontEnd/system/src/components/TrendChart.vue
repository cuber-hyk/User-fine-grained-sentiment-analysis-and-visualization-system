<template>
  <div class="trend-chart">
    <h2 class="panel-title">评论热度趋势</h2>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'TrendChart',
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapState(['productDetails'])
  },
  // 监听 productDetails 的变化
  watch: {
    productDetails: {
      // 当 productDetails 变化时的处理函数
      handler(val) {
        // 如果 val 存在并且含有 trends
        if (val && val.trends) {
          // 在下一个 DOM 更新循环中更新图表
          this.$nextTick(() => {
            this.updateChart()
          })
        }
      },
      // 深度监听
      deep: true
    }
  },
  //生命周期函数
  mounted() {
    this.$nextTick(() => {   //this.$nextTick() 是 Vue 提供的一个方法，它会在下次 DOM 更新循环结束之后延迟执行传入的回调函数。这意味着在确保 DOM 已完成渲染后，调用 initChart 方法来初始化图表。
      this.initChart()
    })
    window.addEventListener('resize', this.resizeChart)
  },
  // 组件销毁时销毁图表
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    // 初始化图表的方法
    initChart() {
          if (this.chart) {
            this.chart.dispose()
          }
          this.chart = echarts.init(this.$refs.chartContainer)
          if (this.productDetails && this.productDetails.trends) {
            this.updateChart()
          }
        },
    updateChart() {
      // 检查图表和产品详情是否存在，以及趋势数据是否存在
      if (!this.chart || !this.productDetails || !this.productDetails.trends) return
      const { trends } = this.productDetails
      const dates = trends.map(item => item.date)
      const values = trends.map(item => item.heat)

      const option = {
        //定义一个提示框的配置对象
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>热度: {c}'
        },
        //设置图表的网格布局
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45,
            color: '#ffffff'
          }
        },
        yAxis: {
          type: 'value',
          name: '热度',
          min: 0,
          max: 5,
          splitLine: {
            show: true,
          },
          
        },
        series: [
          {
            data: values,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#409eff',
              width: 3
            },
            symbol: 'circle',
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(64,158,255,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(64,158,255,0.1)'
                }
              ])
            }
          }
        ]
      }

      this.chart.setOption(option)  //更新图表
    },
    resizeChart() {  //是 Vue 组件中的一个方法 resizeChart()，目的是在组件或窗口大小变化时调整图表的尺寸
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.trend-chart {
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