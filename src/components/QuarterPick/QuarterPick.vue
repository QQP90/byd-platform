<template>
  <VueQuarterSelect
    :value="date"
    :default-value="defaultValue"
    @change="quarterChange"
    @clear="clear"
    :max-date="maxDate | maxQuarter"
    :min-date="minDate | minQuarter"
    :format="format || quarterFormat"
    :value-format="valueFormat"
    style="width: 160px; height: 32px"
  >
  </VueQuarterSelect>
</template>
<script>
import VueQuarterSelect from "@3scarecrow/vue-quarter-select";
import moment from "moment";
export default {
  components: { VueQuarterSelect },
  model: {
    prop: "date",
  },
  props: {
    maxDate: {
      type: [Date, String, Number],
      default: "",
    },
    minDate: {
      type: [Date, String, Number],
      default: "",
    },
    date: {
      type: [String, Array],
      default: () => [],
    },
    format: {
      type: Function,
      default: null,
    },
    valueFormat: {
      type: String,
      default: "yyyy-MM",
    },
  },
  data() {
    return {};
  },
  methods: {
    clear(arg) {
      this.$emit("clear", arg);
    },
    quarterChange(newVal) {
      const arr = newVal.split("年");
      const quarterValue = `${arr[0]}${parseInt(arr[1])}`;
      this.$emit("input", quarterValue);
      this.$emit("change", quarterValue);
    },
    quarterFormat(year, quarter, date) {
      return `${year}年${quarter}季度`;
    },
  },
  computed: {
    defaultValue() {
      const { date } = this;
      return date ? new Date(moment(date, "YYYYQ")) : new Date();
    },
  },
  filters: {
    minQuarter(data) {
      const minQuarter = moment(data, "YYYYQ").format("YYYY-MM");
      return minQuarter;
    },
    maxQuarter(data) {
      const maxQuarter = moment(data, "YYYYQ").format("YYYY-MM");
      return maxQuarter;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .sw__selection {
  line-height: 16px;
}
</style>