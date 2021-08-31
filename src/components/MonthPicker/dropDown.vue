<template>
  <div
    class="month-dropDown"
    :style="show ? { display: 'block' } : { display: 'none' }"
  >
    <div class="month-header">
      <a-icon type="double-left" @click="lastYear" />
      <span>{{ currentYear }}</span>
      <a-icon type="double-right" @click="nextYear" />
    </div>

    <div class="month-body">
      <div
        class="month-wrap"
        v-for="(item, index) in monthList"
        :key="`month-${index}`"
      >
        <span @click="clickMonth(index + 1)" :class="initClassName(index + 1)">
          {{ monthStringList[index] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "monthDropDown",
  props: {
    show: {
      type: Boolean,
    },
    selectValue: {
      type: Array,
    },
    maxMonth: {
      type: String,
    },
    minMonth: {
      type: String,
    },
  },
  data() {
    return {
      currentYear: this.selectValue.length
        ? this.selectValue[1]
          ? this.selectValue[1].slice(0, 4)
          : this.selectValue[0].slice(0, 4)
        : parseInt(moment().format("YYYY")),
      monthList: new Array(12),
    };
  },
  computed: {
    monthStringList() {
      return [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ];
    },
  },
  methods: {
    nextYear() {
      this.currentYear++;
    },
    lastYear() {
      this.currentYear--;
    },
    initClassName(month) {
      const { currentYear, selectValue, maxMonth, minMonth } = this;
      const currentMonth = month < 10 ? `0${month}` : month;
      const currentYM = `${currentYear}${currentMonth}`;

      if (currentYM < minMonth || currentYM > maxMonth) {
        return "disabled";
      }

      if (selectValue.length) {
        if (
          currentYM === selectValue[0] ||
          (selectValue[1] && currentYM === selectValue[1])
        ) {
          return "selected";
        }
        if (
          currentYM > selectValue[0] &&
          selectValue[1] &&
          currentYM < selectValue[1]
        ) {
          return "between";
        }
      }
    },
    clickMonth(month) {
      const { currentYear, minMonth, maxMonth } = this;
      const selectMonth = month < 10 ? `0${month}` : month;
      const selectYM = `${currentYear}${selectMonth}`;

      if (selectYM < minMonth || selectYM > maxMonth) {
        return;
      }

      this.$emit("clickMonth", selectYM);
    },
  },
};
</script>

<style lang="less" scoped>
.month-dropDown {
  position: absolute;
  top: 40px;
  left: 0;
  width: 278px;
  height: 288px;
  background-color: #fff;
  box-shadow: 0px 0px 20px #ddd;
  transition: all 0.2s linear;
  z-index: 10;

  .month-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 20px;
    font-size: 12px;
    & > span {
      display: inline-block;
      width: 50px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }

  .month-body {
    display: flex;
    flex-wrap: wrap;
    color: #000000;
    .month-wrap {
      width: 33.33%;
      height: 61.5px;
      line-height: 61.5px;
      text-align: center;
      & > span {
        display: inline-block;
        border-radius: 2px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        &.disabled {
          cursor: not-allowed;
          background-color: #eaeaea;
        }
        &:hover:not("disabled") {
          background-color: #0073c6;
          color: #fff;
        }
        &.selected {
          background-color: #0073c6;
          color: #fff;
        }
        &.between {
          background-color: #abdcff;
        }
      }
    }
  }
}
</style>