<template>
  <div ref="chartRef" class="word-cloud"></div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-wordcloud";

export default {
  name: "WordCloud",
  props: {
    data: {
      type: Array,
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

      window.addEventListener("resize", () => {
        this.chart && this.chart.resize();
      });

      const option = {
        tooltip: {
          show: true,
          formatter: "{b}: {c}",
        },
        series: [
          {
            type: "wordCloud",
            shape: "circle",
            left: "center",
            top: "center",
            width: "100%",
            height: "100%",
            right: null,
            bottom: null,
            sizeRange: [14, 50],
            rotationRange: [-45, 45],
            rotationStep: 5,
            gridSize: 15,
            drawOutOfBound: true,
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: function () {
                return (
                  "rgb(" +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(",") +
                  ")"
                );
              },
            },
            emphasis: {
              textStyle: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: this.data.map((item) => ({
              name: item.word,
              value: item.count,
              textStyle: {
                color:
                  item.sentiment === "positive"
                    ? "#67C23A"
                    : item.sentiment === "negative"
                    ? "#F56C6C"
                    : "#909399",
              },
            })),
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
    window.addEventListener("resize", this.initChart);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener("resize", this.initChart);
  },
};
</script>

<style scoped>
.word-cloud {
  width: 100%;
  height: 100%;
}
</style>