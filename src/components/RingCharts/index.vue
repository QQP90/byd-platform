<template>
  <div class="ring-charts-wrapper">
    <div class="ring-title">
      <span>{{ title }}</span>
    </div>
    <div class="charts-ctn">
      <div class="ring-charts" :id="id"></div>
      <div class="max-count">
        <p>总计</p>
        <p>{{ maxCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const ringOption = (instance) => {
  const { datasource } = instance;
  let maxCount = 0;

  datasource.forEach((item) => {
    const { value } = item;
    maxCount += parseInt(value);
  });

  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      type: "scroll",
      bottom: "0",
      left: "center",
    },
    series: [
      {
        top: 0,
        bottom: 50,
        type: "pie",
        radius: ["55%", "85%"],
        label: {
          show: false,
          position: "center",
          fontSize: "16",
          formatter: (params) => {
            return `总计\n\n${maxCount}`;
          },
        },
        tooltip: {
          formatter: (params) => {
            const { data, marker, percent } = params;
            return `<div style="padding:10px 0 10px 10px;width:180px;font-size:14px">
              <div>${marker} <span>${data.name}</span><div>
              <div style="margin:12px 0 12px 18px">总计：${data.value}</div>
              <div style="margin-left:18px">占比：${percent}%</div>
            </div>`;
          },
        },
        data: datasource,
      },
    ],
  };
};

export default {
  name: "RingCharts",
  props: {
    title: {
      type: String,
      default: "占比分析图",
    },
    datasource: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      maxCount: [0, ...this.datasource].reduce((total, item) => {
        return total + parseInt(item.value);
      }),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { datasource, id } = this;

      const myChart = this.$echarts.init(document.getElementById(id));
      this.$myChart = myChart;

      myChart.showLoading();
      myChart.on("legendselectchanged", this.legendChange);

      if (datasource === 0) {
        return false;
      }

      const option = ringOption(this);
      myChart.setOption(option, true);
      myChart.hideLoading();
    },
    legendChange(params) {
      const { datasource } = this;
      const { name, selected } = params;
      let value;
      datasource.some((item) => {
        if (name === item.name) {
          value = Number(item.value);
          return;
        }
      });

      if (selected[name] === false) {
        this.maxCount -= value;
      } else {
        this.maxCount += value;
      }
    },
    reset() {
      const option = ringOption(this);
      this.$myChart.setOption(option, true);
      this.$myChart.hideLoading();
    },
  },
  watch: {
    datasource(newVal) {
      if (newVal.length) {
        this.reset();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ring-charts-wrapper {
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  height: 340px;
  background: #fff;
  .ring-title {
    font-size: 16px;
    font-weight: bold;
    color: #212121;
  }
  .charts-ctn {
    position: relative;
    margin: 0 auto;
    width: 520px;
    height: 280px;
    .ring-charts {
      width: 100%;
      height: 100%;
    }
    .max-count {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: -55px;
      height: 50px;
      font-size: 16px;
      text-align: center;
      cursor: default;
      color: #212121;
      p {
        margin: 0;
      }
      & > p:first-child {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
