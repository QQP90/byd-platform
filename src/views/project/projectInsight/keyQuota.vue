<template>
  <div class="data-ctn key-quota">
    <InsightTabsScroll
      v-if="quotaList.length > 0 && keyQuotaTabsList.length > 0"
      :tabsList="keyQuotaTabsList"
      v-model="currentTab"
      @change="selectTabs"
    ></InsightTabsScroll>

    <div class="line-chart-ctn">
      <LineCharts
        id="keyQuotaLineChart"
        :datasource="lineChartsData"
        :unit="currentUnit"
        :loading="keyQuotaChartLoading"
      ></LineCharts>
    </div>

    <div class="table-ctn">
      <a-table
        :columns="tableColumns"
        :data-source="keyQuotaData"
        :pagination="{
          pageSize: 10,
          current: keyQuotaCurrent,
          total: keyQuotaTotal,
        }"
        :scroll="{ x: 'max-content' }"
        @change="keyQuotaPageChange"
        :loading="keyQuotaTableLoading"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import InsightTabsScroll from "@/components/InsightTabsScroll";
import LineCharts from "@/components/LineCharts";

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

const columnsMap = {
  1: { title: "花费", dataIndex: "totalCost", align: "center" },
  2: { title: "PV", dataIndex: "pvValue", align: "center" },
  3: { title: "曝光量", dataIndex: "imp", align: "center" },
  4: { title: "有效曝光量", dataIndex: "effImp", align: "center" },
  5: { title: "UV", dataIndex: "uvValue", align: "center" },
  6: { title: "点击量", dataIndex: "click", align: "center" },
  7: { title: "有效点击量", dataIndex: "effClick", align: "center" },
  8: { title: "线索量", dataIndex: "leads", align: "center" },
  9: { title: "有效线索量", dataIndex: "effLeads", align: "center" },
  10: { title: "试乘试驾量", dataIndex: "driveNum", align: "center" },
  11: { title: "直接成交量", dataIndex: "directDealNum", align: "center" },
  12: { title: "成交量", dataIndex: "dealNum", align: "center" },
  13: { title: "PV成本", dataIndex: "pvCost", align: "center" },
  14: { title: "曝光成本", dataIndex: "impCost", align: "center" },
  15: { title: "有效曝光成本", dataIndex: "effImpCost", align: "center" },
  16: { title: "UV成本", dataIndex: "uvCost", align: "center" },
  17: { title: "点击成本", dataIndex: "clickCost", align: "center" },
  18: { title: "有效点击成本", dataIndex: "effClickCost", align: "center" },
  19: { title: "线索成本", dataIndex: "leadsCost", align: "center" },
  20: { title: "有效线索成本", dataIndex: "effLeadsCost", align: "center" },
  21: { title: "试乘试驾成本", dataIndex: "driveCost", align: "center" },
  22: { title: "直接成交成本", dataIndex: "directDealCost", align: "center" },
  23: { title: "成交成本", dataIndex: "dealCost", align: "center" },
  24: { title: "有效曝光率", dataIndex: "effImpRate", align: "center" },
  25: { title: "点击率", dataIndex: "clickRate", align: "center" },
  26: { title: "有效点击率", dataIndex: "effClickRate", align: "center" },
  27: { title: "留资率", dataIndex: "retainedRate", align: "center" },
  28: { title: "线索有效率", dataIndex: "effLeadsRate", align: "center" },
  29: { title: "试乘试驾率", dataIndex: "driveRate", align: "center" },
  30: { title: "直接成交率", dataIndex: "directDealRate", align: "center" },
  31: { title: "成交率", dataIndex: "dealRate", align: "center" },
};

const defaultColumns = [
  {
    title: "日期",
    dataIndex: "dtime",
    align: "center",
    sorter: true,
    sorterId: "0",
  },
  {
    title: "媒体",
    dataIndex: "mediaName",
    align: "center",
  },
  {
    title: "广告位",
    dataIndex: "campaignAdSlotName",
    align: "center",
  },
];

export default {
  components: {
    InsightTabsScroll,
    LineCharts,
  },
  props: {
    quotaValues: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentTab: "1",
      lineChartsData: {},
      keyQuotaCurrent: 1,
      keyQuotaTotal: 0,
      keyQuotaData: [],
      keyQuotaColumns: defaultColumns,
      sorterInfo: null,
    };
  },
  mounted() {
    const { projectList } = this;
    if (!projectList.list) {
      this.SET_KEY_QUOTA_TABLE_LOADING(false);
      this.SET_KEY_QUOTA_CHART_LOADING(false);
    }
  },
  computed: {
    ...mapState("projectInsight", [
      "quotaList",
      "keyQuotaDataList",
      "keyQuotaTableLoading",
      "keyQuotaChartLoading",
      "projectList",
    ]),
    keyQuotaTabsList() {
      const { quotaList, keyQuotaDataList } = this;
      const line = keyQuotaDataList && keyQuotaDataList.line;
      const totalValue = line && line.totalValue;

      if (quotaList.length === 0 || !line || !totalValue) {
        return [];
      }

      const list = [];

      quotaList.forEach((element) => {
        const { children } = element;
        children.forEach((item) => {
          const value = totalValue[item.id].replace("-", "");
          const unit = unitMap[item.id];
          list.push({
            ...item,
            value: `${value}${unit}`,
          });
        });
      });

      return list;
    },
    currentUnit() {
      const { currentTab } = this;
      return unitMap[currentTab];
    },
    tableColumns() {
      const { keyQuotaColumns, sorterInfo } = this;

      const columns = keyQuotaColumns.map((item) => {
        return {
          ...item,
          sortOrder: sorterInfo
            ? sorterInfo.columnKey === item.dataIndex && sorterInfo.order
            : "",
        };
      });

      return columns;
    },
  },
  methods: {
    ...mapMutations("projectInsight", [
      "SET_KEY_QUOTA_TABLE_LOADING",
      "SET_KEY_QUOTA_CHART_LOADING",
    ]),
    selectTabs(id) {
      const { keyQuotaDataList } = this;
      const { line } = keyQuotaDataList;
      this.currentTab = id;
      this.lineChartsData = {
        category: line.dateList,
        series: [
          {
            data: line.listMap[id],
            type: "line",
            symbol: "none",
          },
        ],
      };
    },
    keyQuotaPageChange(pagination, filters, sorter) {
      let orderValue = "";
      let orderIndexId = "";
      let newSorter = { ...sorter };
      if (JSON.stringify(newSorter) != "{}") {
        if (newSorter.order) {
          orderValue = newSorter.order == "ascend" ? "1" : "0";
        } else {
          orderValue = "1";
          newSorter.order = "ascend";
        }
        if (newSorter.column) {
          orderIndexId = newSorter.column.sorterId;
        } else {
          orderIndexId = this.sorterInfo.column.sorterId;
        }
      }
      const { current } = pagination;

      this.sorterInfo = newSorter;
      this.keyQuotaCurrent = current;
      this.$emit("pageChange", { current, orderIndexId, orderValue });
    },
    initData() {
      const { currentTab, quotaValues, keyQuotaDataList } = this;
      const { line, tableList } = keyQuotaDataList;
      const { list, total } = tableList;
      const columns = quotaValues.map((item) => {
        return {
          ...columnsMap[item.id],
          sorter: true,
          sorterId: item.id,
        };
      });

      this.lineChartsData = {
        category: line.dateList,
        series: [
          {
            data: line.listMap[currentTab],
            type: "line",
            symbol: "none",
          },
        ],
      };
      this.keyQuotaData = list.map((item) => {
        return {
          ...item,
          key: `${item.dtime}${item.campaignAdSlotId}${item.mediaId}`,
        };
      });
      this.keyQuotaTotal = total;
      this.keyQuotaColumns = [...defaultColumns, ...columns];
      this.SET_KEY_QUOTA_TABLE_LOADING(false);
      this.SET_KEY_QUOTA_CHART_LOADING(false);
    },
  },
  watch: {
    projectList(newVal) {
      if (newVal) {
        if (!newVal.list) {
          this.SET_KEY_QUOTA_TABLE_LOADING(false);
          this.SET_KEY_QUOTA_CHART_LOADING(false);
        }
      }
    },
    keyQuotaDataList(newVal) {
      if (newVal) {
        this.initData();
      }
    },
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
  &.key-quota {
    /deep/.ant-tabs-bar {
      .ant-tabs-tab {
        font-size: 12px;
        &.ant-tabs-tab-active {
          font-size: 14px;
        }
      }
    }

    .line-chart-ctn {
      margin-top: 30px;
    }
  }
}
</style>
