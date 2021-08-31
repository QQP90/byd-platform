<template>
  <div class="scatter-ctn">
    <div class="body">
      <div class="scatter-charts-ctn" :id="id"></div>

      <div class="yAxis-select">
        <QuotaComponent
          @onConfirm="yAxisConfirm"
          :max="1"
          :options="quotaOptions"
          :values="[quotaValues[1]]"
        ></QuotaComponent>
      </div>

      <div class="xAxis-select">
        <QuotaComponent
          @onConfirm="xAxisConfirm"
          :max="1"
          openMode="right"
          :options="quotaOptions"
          :values="[quotaValues[0]]"
        ></QuotaComponent>
      </div>
    </div>
  </div>
</template>

<script>
import QuotaComponent from "@/components/QuotaComponent";

const unitMap = {
  1: "元",
  2: "次",
  3: "次",
  4: "次",
  5: "次",
  6: "次",
  7: "次",
  8: "个",
  9: "个",
  10: "个",
  11: "个",
  12: "个",
  13: "元",
  14: "元",
  15: "元",
  16: "元",
  17: "元",
  18: "元",
  19: "元",
  20: "元",
  21: "元",
  22: "元",
  23: "元",
  24: "%",
  25: "%",
  26: "%",
  27: "%",
  28: "%",
  29: "%",
  30: "%",
  31: "%",
};

const scatterOption = (instance) => {
  const data = instance.datasource.map((item) => {
    const { list } = item;
    const idList = [];
    let mark = -1;

    const values = list.map((item, index) => {
      mark = -1;
      if (item.value.indexOf("-") > -1) {
        mark = index;
      }

      idList.push(item.indexId);
      return item.value.replace("-", "");
    });

    return { name: item.name, value: values, idList, mark };
  });

  return {
    grid: {
      show: false,
      top: 35,
      bottom: 40,
      right: 110,
    },
    tooltip: {
      show: true,
      formatter: (params) => {
        const { data } = params;
        const { name, value, idList, mark } = data;
        const unitX = mark === 0 ? "" : unitMap[idList[0]];
        const unitY = mark === 1 ? "" : unitMap[idList[1]];
        const valueX = mark === 0 ? "-" : value[0];
        const valueY = mark === 1 ? "-" : value[1];

        return `<div>
        <p style="margin:0">${name}</p>
        <p style="margin:0">${instance.xAxisTitle}：${valueX}${unitX}</p>
        <p style="margin:0">${instance.yAxisTitle}：${valueY}${unitY}</p>
        </div>`;
      },
    },
    xAxis: {
      splitLine: { show: false },
    },
    yAxis: {
      splitLine: { show: false },
    },
    series: [
      {
        symbolSize: 48,
        data,
        type: "scatter",
      },
    ],
    color: ["#AED0F5"],
  };
};

export default {
  name: "ScatterChartsDouble",
  props: {
    id: {
      type: String,
      required: true,
    },
    datasource: {
      type: Array,
      default: () => [],
    },
    quotaOptions: {
      type: Array,
    },
    quotaValues: {
      typs: Array,
    },
  },
  data() {
    const { quotaValues } = this;

    return {
      xAxisTitle: quotaValues[0].name,
      yAxisTitle: quotaValues[1].name,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { id, datasource } = this;
      const myChart = this.$echarts.init(document.getElementById(id));
      this.$myChart = myChart;
      myChart.showLoading();

      if (!datasource || !datasource.length) {
        return false;
      }

      const option = scatterOption(this);
      myChart.setOption(option, true);
      myChart.hideLoading();
    },
    reset() {
      const option = scatterOption(this);
      this.$myChart.setOption(option, true);
      this.$myChart.hideLoading();
    },
    yAxisConfirm(values) {
      this.$emit("change", { yAxis: values });
    },
    xAxisConfirm(values) {
      this.$emit("change", { xAxis: values });
    },
  },
  components: {
    QuotaComponent,
  },
  watch: {
    datasource(newVal) {
      if (newVal) {
        this.reset();
      }
    },
    quotaValues(newVal) {
      if (newVal) {
        this.xAxisTitle = newVal[0].name;
        this.yAxisTitle = newVal[1].name;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.scatter-ctn {
  padding: 30px 0 10px 30px;
  min-width: 660px;
  height: 394px;
  background: #fff;
  .body {
    position: relative;
    margin: 0 6px 0;
    height: 100%;

    /deep/ .quota-wrapper {
      width: 108px;
      .quota-select {
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        .select-icon {
          top: 6px;
          &.rotate {
            top: 5px;
          }
        }
      }
    }

    .scatter-charts-ctn {
      width: 100%;
      height: 350px;
    }

    .yAxis-select {
      position: absolute;
      top: 0;
      left: 0;
    }

    .xAxis-select {
      position: absolute;
      bottom: 24px;
      right: 0;
    }
  }
}
</style>