<template>
  <div>
    <a-table
      :columns="getColumnsTitle"
      :data-source="dataSource"
      @change="tableChange"
      :loading="loading"
      :pagination="{
        pageSize: 10,
        hideOnSinglePage: true,
        current: currentPage,
        total: total,
      }"
      rowKey="index"
      :scroll="{ x: 'max-content' }"
    >
    </a-table>
  </div>
</template>
<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => ({}),
    }, // 搜索选项
    columnsTitle: {
      type: [],
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    dataSource: [],
    areaType: { type: String, default: "0" },
  },
  data() {
    return {
      columns: [],
      currentPage: 1,
      sorterInfo: {},
      loading: false,
    };
  },

  methods: {
    // 修改列表
    tableChange(page, filters, sorter) {
      let orderValue = "";
      let orderIndex = "";
      if (JSON.stringify(sorter) != "{}") {
        if (sorter.order) {
          orderValue = sorter.order == "ascend" ? "1" : "0";
        } else {
          orderValue = "1";
          sorter.order = "ascend";
        }
        if (sorter.column) {
          orderIndex = sorter.column.sorterId;
        } else {
          orderIndex = this.sorterInfo.column.sorterId;
        }
      }
      if (JSON.stringify(this.sorterInfo) != JSON.stringify(sorter)) {
        page.current = 1;
      }

      this.sorterInfo = sorter;
      this.currentPage = page.current;
      let obj = { ...page, orderValue, orderIndex };
      this.$emit("changeRegionalAnalysis", obj);
    },
  },
  computed: {
    getColumnsTitle() {
      const { sorterInfo } = this;
      const defaultColumns = [
        {
          title: "花费",
          sorterId: "1",
          key: "totalCost",
          sorter: true,
          align: "center",
          dataIndex: "totalCost",
          sortOrder: sorterInfo.columnKey === "totalCost" && sorterInfo.order,
        },
        {
          title: "PV",
          sorterId: "2",
          sorter: true,
          align: "center",
          key: "pvValue",
          dataIndex: "pvValue",
          sortOrder: sorterInfo.columnKey === "pvValue" && sorterInfo.order,
        },
        {
          title: "曝光量",
          sorterId: "3",
          sorter: true,
          align: "center",
          key: "imp",
          dataIndex: "imp",
          sortOrder: sorterInfo.columnKey === "imp" && sorterInfo.order,
        },
        {
          title: "有效曝光量",
          sorterId: "4",
          sorter: true,
          align: "center",
          key: "effImp",
          dataIndex: "effImp",
          sortOrder: sorterInfo.columnKey === "effImp" && sorterInfo.order,
        },
        {
          title: "UV",
          sorterId: "5",
          sorter: true,
          align: "center",
          key: "uvValue",
          dataIndex: "uvValue",
          sortOrder: sorterInfo.columnKey === "uvValue" && sorterInfo.order,
        },
        {
          title: "点击量",
          sorterId: "6",
          sorter: true,
          align: "center",
          key: "click",
          dataIndex: "click",
          sortOrder: sorterInfo.columnKey === "click" && sorterInfo.order,
        },
        {
          title: "有效点击量",
          sorterId: "7",
          sorter: true,
          align: "center",
          key: "effClick",
          dataIndex: "effClick",
          sortOrder: sorterInfo.columnKey === "effClick" && sorterInfo.order,
        },
        {
          title: "线索量",
          sorterId: "8",
          sorter: true,
          align: "center",
          key: "leads",
          dataIndex: "leads",
          sortOrder: sorterInfo.columnKey === "leads" && sorterInfo.order,
        },
        {
          title: "有效线索量",
          sorterId: "9",
          sorter: true,
          align: "center",
          key: "effLeads",
          dataIndex: "effLeads",
          sortOrder: sorterInfo.columnKey === "effLeads" && sorterInfo.order,
        },
        {
          title: "试乘试驾量",
          sorterId: "10",
          sorter: true,
          align: "center",
          key: "driveNum",
          dataIndex: "driveNum",
          sortOrder: sorterInfo.columnKey === "driveNum" && sorterInfo.order,
        },
        {
          title: "直接成交量",
          sorterId: "11",
          sorter: true,
          align: "center",
          key: "directDealNum",
          dataIndex: "directDealNum",
          sortOrder:
            sorterInfo.columnKey === "directDealNum" && sorterInfo.order,
        },
        {
          title: "(促进)成交量",
          sorterId: "12",
          sorter: true,
          align: "center",
          key: "dealNum",
          dataIndex: "dealNum",
          sortOrder: sorterInfo.columnKey === "dealNum" && sorterInfo.order,
        },
        {
          title: "pv成本",
          sorterId: "13",
          sorter: true,
          align: "center",
          key: "pvCost",
          dataIndex: "pvCost",
          sortOrder: sorterInfo.columnKey === "pvCost" && sorterInfo.order,
        },
        {
          title: "曝光成本",
          sorterId: "14",
          sorter: true,
          align: "center",
          key: "impCost",
          dataIndex: "impCost",
          sortOrder: sorterInfo.columnKey === "impCost" && sorterInfo.order,
        },
        {
          title: "有效曝光成本",
          sorterId: "15",
          sorter: true,
          align: "center",
          key: "effImpCost",
          dataIndex: "effImpCost",
          sortOrder: sorterInfo.columnKey === "effImpCost" && sorterInfo.order,
        },
        {
          title: "uv成本",
          sorterId: "16",
          sorter: true,
          align: "center",
          key: "uvCost",
          dataIndex: "uvCost",
          sortOrder: sorterInfo.columnKey === "uvCost" && sorterInfo.order,
        },
        {
          title: "点击成本",
          sorterId: "17",
          sorter: true,
          align: "center",
          key: "clickCost",
          dataIndex: "clickCost",
          sortOrder: sorterInfo.columnKey === "clickCost" && sorterInfo.order,
        },
        {
          title: "有效点击成本",
          sorterId: "18",
          sorter: true,
          align: "center",
          key: "effClickCost",
          dataIndex: "effClickCost",
          sortOrder:
            sorterInfo.columnKey === "effClickCost" && sorterInfo.order,
        },
        {
          title: "线索成本",
          sorterId: "19",
          sorter: true,
          align: "center",
          key: "leadsCost",
          dataIndex: "leadsCost",
          sortOrder: sorterInfo.columnKey === "leadsCost" && sorterInfo.order,
        },
        {
          title: "有效线索成本",
          sorterId: "20",
          sorter: true,
          align: "center",
          key: "effLeadsCost",
          dataIndex: "effLeadsCost",
          sortOrder:
            sorterInfo.columnKey === "effLeadsCost" && sorterInfo.order,
        },
        {
          title: "试乘试驾成本",
          sorterId: "21",
          sorter: true,
          align: "center",
          key: "driveCost",
          dataIndex: "driveCost",
          sortOrder: sorterInfo.columnKey === "driveCost" && sorterInfo.order,
        },
        {
          title: "直接成交成本",
          sorterId: "22",
          sorter: true,
          align: "center",
          key: "directDealCost",
          dataIndex: "directDealCost",
          sortOrder:
            sorterInfo.columnKey === "directDealCost" && sorterInfo.order,
        },
        {
          title: "成交成本",
          sorterId: "23",
          sorter: true,
          align: "center",
          key: "dealCost",
          dataIndex: "dealCost",
          sortOrder: sorterInfo.columnKey === "dealCost" && sorterInfo.order,
        },
        {
          title: "有效曝光率",
          sorterId: "24",
          sorter: true,
          align: "center",
          key: "effImpRate",
          dataIndex: "effImpRate",
          sortOrder: sorterInfo.columnKey === "effImpRate" && sorterInfo.order,
        },
        {
          title: "点击率",
          sorterId: "25",
          sorter: true,
          align: "center",
          key: "clickRate",
          dataIndex: "clickRate",
          sortOrder: sorterInfo.columnKey === "clickRate" && sorterInfo.order,
        },
        {
          title: "有效点击率",
          sorterId: "26",
          sorter: true,
          align: "center",
          key: "effClickRate",
          dataIndex: "effClickRate",
          sortOrder:
            sorterInfo.columnKey === "effClickRate" && sorterInfo.order,
        },
        {
          title: "留资率",
          sorterId: "27",
          sorter: true,
          align: "center",
          key: "retainedRate",
          dataIndex: "retainedRate",
          sortOrder:
            sorterInfo.columnKey === "retainedRate" && sorterInfo.order,
        },
        {
          title: "线索有效率",
          sorterId: "28",
          sorter: true,
          align: "center",
          key: "effLeadsRate",
          dataIndex: "effLeadsRate",
          sortOrder:
            sorterInfo.columnKey === "effLeadsRate" && sorterInfo.order,
        },
        {
          title: "试乘试驾率",
          sorterId: "29",
          sorter: true,
          align: "center",
          key: "driveRate",
          dataIndex: "driveRate",
          sortOrder: sorterInfo.columnKey === "driveRate" && sorterInfo.order,
        },
        {
          title: "直接成交率",
          sorterId: "30",
          sorter: true,
          align: "center",
          key: "directDealRate",
          dataIndex: "directDealRate",
          sortOrder:
            sorterInfo.columnKey === "directDealRate" && sorterInfo.order,
        },
        {
          title: "成交率",
          sorterId: "31",
          sorter: true,
          align: "center",
          key: "dealRate",
          dataIndex: "dealRate",
          sortOrder: sorterInfo.columnKey === "dealRate" && sorterInfo.order,
        },
      ];
      let columns = [];
      if (this.areaType == "1") {
        columns = [
          {
            title: "日期",
            align: "center",
            key: "date",
            dataIndex: "date",
            fixed: "left",
            width: 188,
          },

          {
            title: "省份",
            align: "center",
            key: "provinceName",
            dataIndex: "provinceName",
            fixed: "left",
            width: 150,
          },
        ];
      } else {
        columns = [
          {
            title: "日期",
            align: "center",
            key: "date",
            dataIndex: "date",
            fixed: "left",
            width: 188,
          },
          {
            title: "城市",
            fixed: "left",
            align: "center",
            key: "cityName",
            dataIndex: "cityName",
            width: 150,
          },
        ];
      }
      defaultColumns.forEach((v) => {
        this.columnsTitle.forEach((item) => {
          if (item.id == v.sorterId) {
            columns.push(v);
          }
        });
      });
      return columns;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-table-column-title {
  font-weight: 600;
}
</style>
