<template>
  <div
    ref="dom"
    class="charts chart-bar"
    style="height: 500px; width: 100%"
  ></div>
</template>
<script>
export default {
  name: "ChartBar",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    text: {
      type: String,
      default: "",
    },
    subtext: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dom: null,
    };
  },
  computed: {
    options() {
      const xAxisData = this.value.length
        ? this.value.map((item) => item.name)
        : [];
      const seriesData = this.value.length
        ? this.value.map((item) => item.value)
        : [];
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center",
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            interval: 0,
            // rotate: 60,
          },
        },
        yAxis: {
          type: "value",
          name: `单位${this.unit}`,
          splitLine: {
            // show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        color: ["#AED0F5"],
        tooltip: {
          axisPointer: {
            type: "none",
          },
        },
        series: [
          {
            data: seriesData,
            type: "bar",
            barWidth: 47,
            itemStyle: {
              //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30,
              },
              normal: {
                barBorderRadius: [10, 10, 0, 0],

                label: {
                  show: true, //是否展示
                  position: "top",
                  textStyle: {
                    fontWeight: 400,
                    fontSize: 14,
                    color: "#AED0F5",
                  },
                },
              },
            },
          },
        ],
      };
      return option;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.dom = this.$echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(this.options);
    });
  },
  watch: {
    value: {
      handler() {
        this.dom.setOption(this.options);
      },
      deep: true,
    },
  },
  destroyed() {
    this.dom.dispose();
  },
};
</script>
