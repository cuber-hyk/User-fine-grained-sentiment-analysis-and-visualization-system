<template>
  <div ref="chartRef" class="sources-bar"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "SourcesBar",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartRef);
      }

      const sources = Object.keys(this.data);
      const volumes = sources.map((source) => this.data[source].volume);
      const positiveRates = sources.map(
        (source) => this.data[source].positiveRate
      );

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["评论量", "好评率"],
          textStyle: {
            color: "#909399",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#909399",
            },
          },
          axisLabel: {
            color: "#909399",
          },
        },
        yAxis: {
          type: "category",
          data: sources,
          axisLine: {
            lineStyle: {
              color: "#909399",
            },
          },
          axisLabel: {
            color: "#909399",
          },
        },
        series: [
          {
            name: "评论量",
            type: "bar",
            data: volumes,
            itemStyle: {
              color: "#409EFF",
            },
          },
          {
            name: "好评率",
            type: "bar",
            data: positiveRates,
            itemStyle: {
              color: "#67C23A",
            },
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.initChart();
      },
    },
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", () => {
      this.chart && this.chart.resize();
    });
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
};
</script>

<style scoped>
.sources-bar {
  width: 100%;
  height: 100%;
}
</style> 