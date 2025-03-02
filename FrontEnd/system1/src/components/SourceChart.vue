<template>
  <div class="source-chart">
    <h2 class="panel-title">数据来源展示</h2>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>
 
<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
 
export default {
  // 组件名称
  name: 'SourceChart',
   
  data() {
    return {
      // 存储图表实例
      chart: null
    }
  },
   
  computed: {
    // 映射 Vuex 的状态
    ...mapState(['productDetails'])
  },
   
  watch: {
    productDetails: {
      // 监听 productDetails 的变化
      handler(val) {
        if (val && val.sources) {
          this.$nextTick(() => {
            this.updateChart()
          })
        }
      },
      deep: true
    }
  },
   
  mounted() {
    // 组件挂载后初始化图表并设置窗口大小监听器
    this.$nextTick(() => {
      this.initChart()
    })
    window.addEventListener('resize', this.resizeChart)
  },
   
  beforeDestroy() {
    // 组件销毁前处置图表实例和移除事件监听器
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    // 从窗口中移除 resize 事件监听器，用于卸载或清理组件的图表尺寸调整
    window.removeEventListener('resize', this.resizeChart)  
  },
   
  methods: {
    // 初始化图表
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(this.$refs.chartContainer)
      if (this.productDetails && this.productDetails.sources) {
        this.updateChart()
      }
    },
     
    // 更新图表数据
    updateChart() {
      if (!this.chart || !this.productDetails || !this.productDetails.sources)   return
 
      const { sources } = this.productDetails
      const data = Object.entries(sources).map(([name, value]) => ({
        name,
        value
      }))
 
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c}分'
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '评分',
          min: 0,
          max: 5,
          splitNumber: 5
        },
        yAxis: {
          type: 'category',
          data: data.map(item => item.name),
           
          axisLabel: {
            // 设置 y 轴的字体大小
            fontSize: 14,
            // 设置 y 轴的字体颜色
            color: '#ffffff'
          }
        },
        series: [
          {
            // 图表类型设置为条形图
            type: 'bar',
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                // 设置柱状图的颜色渐变
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              }
            })),
            barWidth: '60%',
            label: {
              show: true,
              position: 'right',
              formatter: '{c}分'
            }
          }
        ]
      }
 
      this.chart.setOption(option)
    },
     
    // 调整图表尺寸
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>
 
<style scoped>
.source-chart {
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