<template>
  <div class="charts-wrapper" :class="className">
    <div class="charts-header">
      <p class="title">{{ title }}</p>
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
      <div class="charts-category" :style="`width:${categoryWidth}px`">
        <p v-for="(item, index) in category" :key="`category-${id}-${index}`">
          {{ item }}
        </p>
      </div>

      <div class="charts-contain">
        <div
          :id="id"
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
  * onChange 下拉框change回调
  * 数据样例
  optionObj: {
    category: ["巴西", "印尼", "美国", "印度", "中国", "王朝网东部战区"],
    data: [5, 20, 55, 10, 10, 20],
  },
*/

const defaultOption = (instance) => {
  const option = {
    title: {
      show: false,
    },
    tooltip: {},
    grid: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 50,
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: instance.category || [],
      show: false,
    },
    series: [
      {
        type: "bar",
        data: instance.data || [],
        itemStyle: {
          color: "#A7D0F9",
          borderRadius: [0, 5, 5, 0],
        },
        barWidth: 10,
        barGap: 0,
        barCategoryGap: 0,
        label: {
          show: true,
          position: "right",
        },
      },
    ],
  };

  return option;
};

export default {
  name: "BarChartsSingle",
  props: {
    title: {
      type: String,
      default: "指标",
    },
    id: {
      type: String,
      require: true,
    },
    optionObj: {
      type: Object,
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
    return {
      selectValue: "10",
      chartsWidth: 320,
    };
  },
  computed: {
    category() {
      return this.optionObj ? this.optionObj.category : [];
    },
    data() {
      return this.optionObj ? this.optionObj.data : [];
    },
  },
  methods: {
    init() {
      const { id, optionObj, chartsWidth, category } = this;

      const myChart = this.$echarts.init(document.getElementById(id), "", {
        width: chartsWidth,
        height: category.length * 24,
      });
      this.$myChart = myChart;

      myChart.showLoading();

      if (!optionObj) {
        return false;
      }

      const option = defaultOption(this);
      myChart.setOption(option, true);
      myChart.hideLoading();
    },
    reset(dataLength) {
      const { chartsWidth } = this;
      const option = defaultOption(this);
      this.$myChart.setOption(option, true);
      this.$myChart.hideLoading();
      this.$myChart.resize({
        width: chartsWidth,
        height: dataLength * 24,
      });
    },
    selectChange(value) {
      this.$emit("onChange", value);
    },
  },
  mounted() {
    const { categoryWidth } = this;
    this.chartsWidth = this.$refs.chartsBody.clientWidth - categoryWidth - 10;
    this.init();
  },
  watch: {
    optionObj(newVal) {
      if (newVal) {
        this.selectValue = newVal.topN;
        if (newVal.category.length > 0) {
          this.reset(newVal.category.length);
        }
      }
    },
    categoryWidth(newVal) {
      if (newVal) {
        this.chartsWidth = this.$refs.chartsBody.clientWidth - newVal - 10;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.charts-wrapper {
  padding: 10px;
  min-width: 440px;
  background: #ffffff;
  font-size: 12px;

  .charts-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    .title {
      margin: 0 0 0 10px;
      font-size: 14px;
      color: #22343c;
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
    .charts-category {
      padding-right: 8px;
      & > p {
        margin: 0;
        height: 24px;
        line-height: 24px;
        text-align: right;
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