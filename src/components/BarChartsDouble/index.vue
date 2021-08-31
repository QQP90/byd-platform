<template>
  <div class="charts-wrapper" :class="className">
    <div class="charts-header">
      <QuotaComponent
        :options="quotaOptions"
        :values="quotaValues"
        @onConfirm="quotaConfirm"
      />
      <a-select
        class="charts-select"
        v-model="selectValue"
        @change="selectChange"
      >
        <a-select-option value="10"> TOP10 </a-select-option>
        <a-select-option value=""> 全部 </a-select-option>
      </a-select>
    </div>

    <div class="charts-body" ref="chartsBody">
      <div>
        <span class="unit unit-a">{{ unitA }}</span>
        <div
          :id="`${id}-a`"
          class="charts-contain"
          :style="{
            height: `${category.length * 22}px`,
            width: `${chartsWidth}px`,
          }"
        ></div>
      </div>
      <div class="charts-category" :style="`width:${categoryWidth}px`">
        <p
          v-for="(item, index) in renderCategoryList"
          :key="`category-${id}-${index}`"
        >
          {{ item }}
        </p>
      </div>
      <div>
        <span class="unit unit-b">{{ unitB }}</span>
        <div
          :id="`${id}-b`"
          class="charts-contain"
          :style="{
            height: `${category.length * 24}px`,
            width: `${chartsWidth}px`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
/* 
  * title 图表标题
  * className 图表容器class
  * id 用于生成echarts的元素id 
  * chartsHeight 图表高度 根据业务需求设置
  * onChange 下拉框change回调
  * 数据样例
  optionObj: {
    category: ["巴西", "印尼", "美国", "印度", "中国", "王朝网东部战区"],
    data: {
      a: [5, 20, 55, 10, 10, 20],
      b: [5, 20, 55, 10, 10, 20]
    },
  },
*/

import QuotaComponent from "@/components/QuotaComponent/index.js";

const percentList = [5, 8, 11, 14];

const defaultOptionA = (instance) => {
  const { category = [], quotaValues, dataA = [] } = instance;

  const quotaId = Number(quotaValues[0].id);

  const showPercent = percentList.includes(quotaId);

  const tooltip = {
    formatter: (params) => {
      const { data, marker, name } = params;
      if (showPercent) {
        return `<div>${marker} <span style="padding-right:10px">${name}</span> <span>${data}%</span><div>`;
      } else {
        return `<div>${marker} <span style="padding-right:10px">${name}</span> <span>${data}</span><div>`;
      }
    },
  };
  const label = {
    show: true,
    position: "left",
  };

  if (showPercent) {
    // 显示百分号
    label["formatter"] = "{c}%";
  }

  const option = {
    title: {
      show: false,
    },
    tooltip,
    grid: {
      left: 50,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: "value",
      show: false,
      inverse: true,
    },
    yAxis: {
      type: "category",
      data: category,
      show: false,
    },
    series: [
      {
        type: "bar",
        data: dataA,
        itemStyle: {
          color: "#A7D0F9",
          borderRadius: [5, 0, 0, 5],
        },
        barWidth: 10,
        barGap: 0,
        barCategoryGap: 0,
        label,
      },
    ],
  };

  return option;
};

const defaultOptionB = (instance) => {
  const { category = [], quotaValues, dataB = [] } = instance;

  const quotaId = Number(quotaValues[1].id);

  const showPercent = percentList.includes(quotaId);

  const tooltip = {
    formatter: (params) => {
      const { data, marker, name } = params;
      if (showPercent) {
        return `<div>${marker} <span style="padding-right:10px">${name}</span> <span>${data}%</span><div>`;
      } else {
        return `<div>${marker} <span style="padding-right:10px">${name}</span> <span>${data}</span><div>`;
      }
    },
  };

  const label = {
    show: true,
    position: "right",
  };

  if (showPercent) {
    label["formatter"] = "{c}%";
  }

  const option = {
    title: {
      show: false,
    },
    tooltip,
    grid: {
      left: 0,
      right: 50,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: category,
      show: false,
    },
    series: [
      {
        type: "bar",
        data: dataB,
        itemStyle: {
          color: "#A7D0F9",
          borderRadius: [0, 5, 5, 0],
        },
        barWidth: 10,
        barGap: 0,
        barCategoryGap: 0,
        label,
      },
    ],
  };

  return option;
};

const unitMap = {
  1: "万元",
  2: "万次",
  3: "元",
  4: "万次",
  5: "",
  6: "元",
  7: "个",
  8: "",
  9: "元",
  10: "个",
  11: "",
  12: "元",
  13: "个",
  14: "",
  15: "元",
};

export default {
  name: "BarChartsDouble",
  props: {
    title: {
      type: String,
      default: "指标",
    },
    id: {
      type: String,
      require: true,
    },
    chartsHeight: {
      typs: Number,
      default: 240,
    },
    optionObj: {
      type: Object,
      require: true,
    },
    quotaOptions: {
      type: Array,
    },
    quotaValues: {
      typs: Array,
    },
    className: {
      type: String,
    },
    categoryWidth: {
      type: Number,
      default: 100,
    },
  },
  data() {
    const { quotaValues } = this;
    return {
      selectValue: "10",
      quotaLength: quotaValues.length,
      chartsWidth: 270,
    };
  },
  computed: {
    category() {
      return this.optionObj ? this.optionObj.category : [];
    },
    dataA() {
      return this.optionObj ? this.optionObj.data.a : [];
    },
    dataB() {
      return this.optionObj ? this.optionObj.data.b : [];
    },
    unitA() {
      const { quotaValues } = this;
      if (quotaValues.length === 0) {
        return "";
      }
      const { name } = quotaValues[0];
      const unit = unitMap[quotaValues[0].id];
      const str = unit ? `${name}(${unit})` : `${name}`;
      return str;
    },
    unitB() {
      const { quotaValues } = this;
      if (quotaValues.length === 2) {
        const { name } = quotaValues[1];
        const unit = unitMap[quotaValues[1].id];
        const str = unit ? `${name}(${unit})` : `${name}`;
        return str;
      } else {
        return "";
      }
    },
    renderCategoryList() {
      const { category } = this;
      return JSON.parse(JSON.stringify(category)).reverse();
    },
  },
  methods: {
    initA() {
      const { id, quotaLength, optionObj, chartsWidth } = this;
      const myChart = this.$echarts.init(
        document.getElementById(`${id}-a`),
        "",
        {
          width: chartsWidth,
        }
      );
      this.$myChartA = myChart;
      myChart.showLoading();

      if (quotaLength === 0 || !optionObj || !optionObj.data.a) {
        return false;
      }
      const option = defaultOptionA(this);
      myChart.setOption(option, true);
      myChart.hideLoading();
    },
    initB() {
      const { id, quotaLength, optionObj, chartsWidth } = this;
      const myChart = this.$echarts.init(
        document.getElementById(`${id}-b`),
        "",
        {
          width: chartsWidth,
        }
      );
      this.$myChartB = myChart;
      myChart.showLoading();
      if (quotaLength === 1 || !optionObj || !optionObj.data.b) {
        return false;
      }
      const option = defaultOptionB(this);
      myChart.setOption(option, true);
      myChart.hideLoading();
    },
    resetA(dataLength) {
      const { chartsWidth } = this;
      this.$myChartA.resize({
        height: dataLength * 24,
        width: chartsWidth,
      });
      const option = defaultOptionA(this);
      this.$myChartA.setOption(option, true);
      this.$myChartA.hideLoading();
    },
    resetB(dataLength) {
      const { chartsWidth } = this;
      this.$myChartB.resize({
        height: dataLength * 24,
        width: chartsWidth,
      });
      const option = defaultOptionB(this);
      this.$myChartB.setOption(option, true);
      this.$myChartB.hideLoading();
    },
    destoryA() {
      const { id } = this;
      this.$echarts.dispose(document.getElementById(`${id}-a`));
      this.$myChartA = null;
    },
    destoryB() {
      const { id } = this;
      this.$echarts.dispose(document.getElementById(`${id}-b`));
      this.$myChartB = null;
    },
    selectChange(value) {
      const { quotaValues } = this;
      this.$emit("onChange", {
        selectValue: value,
        quotaValues: JSON.parse(JSON.stringify(quotaValues)),
      });
    },
    quotaConfirm(values) {
      const { $myChartA, $myChartB, selectValue } = this;
      const { length } = values;
      this.quotaLength = length;

      if (length === 0) {
        this.destoryA();
        this.destoryB();
      }

      if (length === 1) {
        this.destoryB();
        if (!$myChartA) {
          this.initA();
        }
      }

      if (length === 2) {
        if (!$myChartA) {
          this.initA();
        }
        if (!$myChartB) {
          this.initB();
        }
      }

      this.$emit("onChange", {
        selectValue,
        quotaValues: JSON.parse(JSON.stringify(values)),
      });
    },
  },
  mounted() {
    const { categoryWidth } = this;
    this.chartsWidth = (this.$refs.chartsBody.clientWidth - categoryWidth) / 2;

    this.initA();
    this.initB();
  },
  components: {
    QuotaComponent,
  },
  watch: {
    optionObj(newVal) {
      if (newVal) {
        this.selectValue = newVal.topN;
        if (newVal.data.a) {
          this.resetA(newVal.category.length);
        }

        if (newVal.data.b) {
          this.resetB(newVal.category.length);
        }
      }
    },
    categoryWidth(newVal) {
      if (newVal) {
        this.chartsWidth = (this.$refs.chartsBody.clientWidth - newVal) / 2;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.charts-wrapper {
  padding: 10px;
  width: 664px;
  background: #ffffff;
  font-size: 12px;

  .charts-header {
    position: relative;
    margin-bottom: 30px;
    height: 40px;
    padding-top: 4px;
    /deep/ .quota-select {
      font-size: 12px;
    }

    .charts-select {
      position: absolute;
      width: 108px;
      height: 24px;
      right: 0;
      top: 5px;
      font-size: 12px;

      /deep/ .ant-select-selection--single {
        height: 24px;
      }
      /deep/ .ant-select-selection__rendered {
        height: 24px;
        line-height: 24px;
      }
    }
  }

  .charts-body {
    display: flex;

    & > div {
      position: relative;
      .unit {
        position: absolute;
        top: -20px;
        color: #7e8294;
        &.unit-a {
          right: 0;
        }
        &.unit-b {
          left: 0;
        }
      }
    }

    .charts-category {
      & > p {
        margin: 0;
        height: 24px;
        line-height: 24px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .charts-contain {
      min-height: 240px;
    }
  }
}
</style>
