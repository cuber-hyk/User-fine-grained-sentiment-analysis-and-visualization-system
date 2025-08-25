<template>
  <div class="source-chart">
    <h2 class="panel-title">数据源展示</h2>
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
    // 监听 productId prop 的变化，触发数据加载
    productId: { 
      handler(newPid) {
        if (newPid) {
          // 在 productId 变化时触发获取商品详情的 action
          this.$store.dispatch('fetchProductDetails', { pid: newPid });
          // Also explicitly call updateChart when productId changes
          this.$nextTick(() => {
            this.updateChart();
          });
        } else {
           // 如果productId变为null，可以清空图表或显示无数据状态
           if (this.chart) {
              this.chart.clear();
           }
        }
      },
      immediate: true // 组件挂载后立即执行一次 handler
    },
    // Add watcher for productDetails to update the chart when data changes
    productDetails: {
      handler(val) {
        // Trigger chart update when productDetails with sources data is available
        if (val && val.sources) {
          console.log('productDetails changed, attempting to update source chart...');
          this.$nextTick(() => {
            this.initChart(); // Ensure chart is initialized (handles re-initialization if needed)
            this.updateChart(); // Update chart with new data
          });
        } else if (this.chart) {
          // If productDetails becomes null or sources is missing, clear the chart
          console.log('productDetails or sources missing, clearing source chart.');
          this.chart.clear();
        }
      },
      deep: true // Deep watch for nested changes in productDetails
    }
  },
   
  mounted() {
    // 组件挂载后初始化图表容器，数据加载由watch(productId)触发
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
      // 加强对refs的检查，确保它是一个有效的DOM元素
      const chartContainer = this.$refs.chartContainer;
      if (!chartContainer || chartContainer.offsetWidth === 0 || chartContainer.offsetHeight === 0) { 
         console.error("图表容器不存在或不可见");
         return;
      }
      
      this.chart = echarts.init(chartContainer)
      // 初始时不需要调用updateChart，等待数据加载
      // if (this.productDetails && this.productDetails.sources) {
      //   this.updateChart()
      // }
    },
     
    // 更新图表数据
    updateChart() {
      // Ensure chart instance and data exist
      if (!this.chart || !this.productDetails || !this.productDetails.sources) {
        // console.warn("No data or chart not initialized, cannot update source chart.");
        this.chart?.clear(); // Clear chart if data is invalid
        return;
      }

      // Add a check here to ensure the chart container is visible before updating
      const chartContainer = this.$refs.chartContainer;
      if (!chartContainer || chartContainer.offsetWidth === 0 || chartContainer.offsetHeight === 0) {
         console.warn("Chart container not ready for update.");
         this.chart?.clear(); // Clear if container isn't ready
         return;
      }

      const { sources } = this.productDetails
      // 添加调试信息
      console.log('productDetails.sources:', sources)
      
      const data = Object.entries(sources).map(([name, item]) => ({
        name,
        value: typeof item === 'object' ? item.value : item,
        icon: typeof item === 'object' ? item.icon : null
      }))
      
      console.log('处理后的数据源数据:', data)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c}w'
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
          name: '商品数量',
          nameLocation: 'middle', // 设置名称位置为中间
          nameGap: 10, // 增加轴名称与轴线的距离
          namecolor: '#ffffff', // 设置轴名称的颜色
          axisLabel: {
            // 设置 y 轴的字体大小
            fontSize: 14,
            // 设置 y 轴的字体颜色
            color: '#ffffff'
          },
          min: 0,
          // max: function(value) {
          //   return Math.ceil(value.max * 1.2); // 动态设置最大值
          // },
          max:5,
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
            data: data.map((item) => ({
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
              formatter: '{c}w'
            }
          },
          // 添加图标系列
          {
            type: 'pictorialBar',
            symbolPosition: 'end',
            symbolSize: [40, 40],
            symbolOffset: [0, 0],
            z: 12,
            data: data.map((item) => ({
              value: item.value,
              symbol: item.icon ? 'image://' + item.icon : 'none'
            }))
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
  },
  props: { // 添加productId prop
    productId: {
      type: [String, null],
      default: null
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