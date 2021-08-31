<template>
  <div :id="id" class="line-charts-ctn"></div>
</template>

<script>
const lineOption = (instance) => {
  const { datasource, unit } = instance;
  const { category, series, title } = datasource;

  const { data } = series[0];

  const newData = data.map((item) => {
    let mark = false;

    if (item.value.indexOf("-") > -1) {
      mark = true;
    }

    return {
      value: item.value.replace("-", ""),
      mark,
    };
  });

  const option = {
    title: {
      text: title,
    },
    grid: {
      top: 10,
      left: 100,
      right: 100,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: (params) => {
        const { data, marker, name } = params[0];
        const { value, mark } = data;

        return `<div>
        <p style="margin:6px">${name}</p>
        <p style="margin:0;padding-left:8px">
          ${marker} 
          <span style="padding-left:14px">${
            mark ? "-" : `${value}${unit}`
          }</span>
        </p>
        </div>`;
      },
    },
    legend: {
      bottom: 0,
      type: "scroll",
    },
    xAxis: {
      type: "category",
      data: category,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#DDDDDD",
        },
      },
      axisLabel: {
        color: "#666666",
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#DDDDDD",
        },
      },
      axisLabel: {
        color: "#666666",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        ...series[0],
        data: newData,
      },
    ],
  };

  return option;
};

export default {
  name: "LineCharts",
  props: {
    id: {
      type: String,
      default: "normalLineCharts",
    },
    datasource: {
      type: Object,
      default: () => {
        return {};
      },
    },
    unit: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { datasource, id, loading } = this;

      const myChart = this.$echarts.init(document.getElementById(id));
      this.$myChart = myChart;

      if (loading) {
        myChart.showLoading();
      } else {
        myChart.hideLoading();
      }

      if (!datasource.data) {
        return false;
      }

      const option = lineOption(this);
      myChart.setOption(option, true);
    },
    reset() {
      const option = lineOption(this);
      this.$myChart.setOption(option, true);
    },
  },
  watch: {
    datasource: {
      deep: true,
      handler: function (newVal) {
        if (newVal && newVal.series && newVal.series.length > 0) {
          this.reset();
        }
      },
    },
    loading(newVal) {
      if (newVal) {
        this.$myChart.showLoading();
      } else {
        this.$myChart.hideLoading();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.line-charts-ctn {
  height: 350px;
}
</style>
