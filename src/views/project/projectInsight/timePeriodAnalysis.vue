<template>
  <div class="data-ctn">
    <div style="display: flex; justify-content: flex-end">
      <!-- 检测指标 -->
      <a-select placeholder="监测指标" style="width: 160px">
        <a-select-option value="1">PV</a-select-option>
        <a-select-option value="2">曝光量</a-select-option>
        <a-select-option value="3">有效曝光量</a-select-option>
      </a-select>
    </div>
    <LineCharts id="time" :datasource="lineChartsData"></LineCharts>
    <div class="table-ctn">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="{
          pageSize: 10,
          current: current,
          total: total,
        }"
        rowKey="media"
        @change="pageChange"
        :loading="loading"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
import LineCharts from "@/components/LineCharts";
const Hour24Data = () => {
  let hourArr = [];
  for (let i = 0; i <= 23; i++) {
    hourArr.push(String(i + ":00"));
  }
  return hourArr;
};
export default {
  props: {
    option: {
      type: Object,
      default: () => ({}),
    }, // 搜索选项
  },
  components: { LineCharts },
  data() {
    return {
      dataSource: [], // 表格数据
      loading: false, // 表格loading状态
      current: 1, // 当前页码
      total: 10, // 总条数
      lineChartsData: {}, // charts 数据
    };
  },
  computed: {
    chartData() {
      const category = Hour24Data();
      const series = [];
      for (let i = 0; i < 4; i++) {
        let lis = category.map((item) => {
          return Math.ceil(Math.random() * 300);
        });
        series.push({
          name: i,
          data: lis,
          type: "line",
          symbol: "none",
        });
      }
      return {
        category: category,
        series,
      };
    },
    columns() {
      const lis = [
        {
          title: "日期",
          dataIndex: "date",
          key: "date",
          align: "center",
        },
        {
          title: "媒体",
          dataIndex: "media",
          key: "media",
          align: "center",
        },
        {
          title: "广告位",
          dataIndex: "advertising",
          key: "advertising",
          align: "center",
        },
        {
          title: "指标",
          dataIndex: "target",
          key: "target",
          align: "center",
        },
      ];
      const timeList = Hour24Data().map((item) => {
        return {
          title: item,
          dataIndex: item,
          key: item,
          align: "center",
        };
      });
      return [...lis, ...timeList];
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.lineChartsData = this.chartData;
    });
  },
  methods: {
    pageChange() {},
  },
};
</script>
<style lang="less" scoped>
.data-ctn {
  padding: 20px 10px 30px;
  width: 100%;
  min-height: 100px;
  background: #fff;

  .table-ctn {
    margin-top: 10px;
    padding: 0 100px;
  }
}
</style>
