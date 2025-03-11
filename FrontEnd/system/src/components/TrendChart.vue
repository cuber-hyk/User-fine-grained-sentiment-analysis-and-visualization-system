<template>
  <div class="trend-chart">
    <h2 class="panel-title">评论时间趋势</h2>
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
    ...mapState(['trendsData'])
  },
  watch: {
    trendsData: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.updateChart()
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(this.$refs.chartContainer)
      if (this.trendsData) {
        this.updateChart()
      }
    },
    updateChart() {
      if (!this.chart || !this.trendsData) return

      // 对数据按时间排序
      const sortedData = [...this.trendsData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      // 生成X轴标签和数据系列
      const dates = sortedData.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
      const counts = sortedData.map(item => item.count);

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            return `${data.name}<br/>评论数: ${data.value}条`;
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '15%',
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
          name: '评论数',
          minInterval: 1,
          splitLine: {
            show: true,
          },
          axisLabel: {
            color: '#ffffff'
          },
          nameTextStyle: {
            color: '#ffffff'
          }
        },
        series: [
          {
            name: '评论数量',
            data: counts,
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

      this.chart.setOption(option)
    },
    resizeChart() {
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