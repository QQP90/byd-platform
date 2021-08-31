<template>
  <div class="monthPicker-wrapper" v-click-outside="handleOutSide">
    <div class="monthPicker-select" @click="showDrop">
      <span>{{ inputString }}</span>
      <a-icon
        :class="{ 'select-icon': true, rotate: show }"
        type="down"
      ></a-icon>
    </div>

    <DropDown
      :maxMonth="maxMonth"
      :minMonth="minMonth"
      :show="show"
      :selectValue="selectValue"
      @clickMonth="clickMonth"
    ></DropDown>
  </div>
</template>

<script>
import moment from "moment";
import ClickOutside from "vue-click-outside";
import DropDown from "./dropDown.vue";

export default {
  name: "MonthPicker",
  model: {
    prop: "values",
    event: "change",
  },
  props: {
    maxMonth: {
      type: String,
      default: moment().format("YYYYMM"),
    },
    minMonth: {
      type: String,
      default: moment("1970-01").format("YYYYMM"),
    },
    values: {
      type: Array,
    },
    placeholder: {
      type: String,
      default: "选择月份",
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectValue: this.values || [],
      show: this.isOpen,
    };
  },
  computed: {
    inputString() {
      const { placeholder, values, selectValue } = this;
      let start;
      let end;
      let string = placeholder;

      if (values) {
        if (values.length === 2) {
          start = `${values[0].slice(0, 4)}年${values[0].slice(4, 6)}月`;
          end = `${values[1].slice(0, 4)}年${values[1].slice(4, 6)}月`;
          string = `${start}-${end}`;
        }
        if (values.length === 1) {
          start = `${values[0].slice(0, 4)}年${values[0].slice(4, 6)}月`;
          end = start;
          string = `${start}-${end}`;
        }
      } else if (selectValue.length) {
        if (selectValue.length === 2) {
          start = `${selectValue[0].slice(0, 4)}年${selectValue[0].slice(
            4,
            6
          )}月`;
          end = `${selectValue[1].slice(0, 4)}年${selectValue[1].slice(
            4,
            6
          )}月`;
          string = `${start}-${end}`;
        }

        if (selectValue.length === 1) {
          start = `${selectValue[0].slice(0, 4)}年${selectValue[0].slice(
            4,
            6
          )}月`;
          end = start;
          string = `${start}-${end}`;
        }
      }

      return string;
    },
  },
  methods: {
    handleOutSide() {
      const { selectValue, closeDrop, show } = this;
      if (show) {
        closeDrop();
        this.$emit("change", selectValue);
      }
    },
    showDrop() {
      const { values } = this;
      if (values != undefined) {
        this.selectValue = values;
      }
      this.show = true;
    },
    closeDrop() {
      this.show = false;
    },
    clickMonth(selectMonth) {
      let selectValue = JSON.parse(JSON.stringify(this.selectValue));

      if (selectValue.length === 0) {
        selectValue.push(selectMonth);
      } else {
        const i = selectValue.indexOf(selectMonth);

        if (selectValue.length === 1) {
          if (i === -1) {
            if (selectMonth > selectValue[0]) {
              selectValue.push(selectMonth);
            } else {
              selectValue.unshift(selectMonth);
            }
          } else {
            selectValue.splice(i, 1);
          }
        } else if (selectValue.length === 2) {
          if (i === -1) {
            selectValue = [selectMonth];
          } else {
            selectValue.splice(i, 1);
          }
        }
      }

      this.selectValue = selectValue;
    },
  },
  directives: {
    ClickOutside,
  },
  components: {
    DropDown,
  },
};
</script>

<style lang="less" scoped>
.monthPicker-wrapper {
  position: relative;
  width: 190px;
  user-select: none;
  background-color: #fff;

  .monthPicker-select {
    position: relative;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 22px 0 12px;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .select-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      transition: all 0.2s linear;
      &.rotate {
        top: 9px;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
