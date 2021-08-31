<template>
  <div
    ref="dom"
    class="charts chart-bar"
    style="height: 900px; width: 100%"
  ></div>
</template>
<script>
import chinaMap from "@/assets/json/chinaChange.json";
export default {
  name: "ChartMap",
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
    seriesName: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
    unitName: {
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
      const { max, unit, unitName } = this;
      const option = {
        tooltip: {
          // triggerOn: "mousemove", //mousemove、click
          padding: 8,
          borderWidth: 1,
          borderColor: "#409eff",
          backgroundColor: "rgba(255,255,255,0.7)",
          textStyle: {
            color: "#000000",
            fontSize: 13,
          },
          formatter: function (val) {
            return `<span> ${val.name}：<p> ${unitName}： ${
              String(val.value) != "NaN" ? val.value + unit : "-"
            }</p> </span>`;
          },
        },
        visualMap: {
          min: 0,
          max: max,
          realtime: false,
          calculable: true,
          inverse: true,
          inRange: {
            color: ["#9FC1E8", "#3876DC", "#122C6A"],
          },
          left: 0,
          bottom: 400,
        },
        geo: {
          map: "china",
          scaleLimit: {
            min: 1,
            max: 2,
          },
          zoom: 1,
          top: 120,
          // label: {
          //   normal: {
          //     show: true,
          //     fontSize: "14",
          //     color: "#eaeaea",
          //   },
          // },
          itemStyle: {
            normal: {
              //shadowBlur: 50,
              //shadowColor: 'rgba(0, 0, 0, 0.2)',
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              areaColor: "#f2d5ad",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            type: "map",
            geoIndex: 0,
            data: this.value,
            zoom: 1.5,
          },
        ],
      };
      return option;
    },
    max() {
      let numLis = [];
      if (this.value.length) {
        numLis = this.value.map((item) => Number(item.value));
      }
      const num = Math.max(...numLis);
      if (num > 0) {
        return num;
      } else {
        return 0;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$echarts.registerMap("china", chinaMap);
      this.dom = this.$echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(this.options);
    });
  },
  watch: {
    value: {
      handler(val) {
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
