<template>
  <a-table
    :rowKey="rowKey"
    :columns="tableColumns"
    :data-source="dataSource"
    :scroll="{ x: 'max-content' }"
    :pagination="pageOptions"
    @change="change"
    :rowClassName="rowClassName"
    :loading="loading"
  >
    <template slot="customCell" slot-scope="text, record">
      <span :class="{ 'bule-font': record.totalCostFlag === '1' }">{{
        text
      }}</span>
    </template>
  </a-table>
</template>
<script>
const crown = require("@/assets/img/crown.png");
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: "campaignName",
    },
    total: {
      type: Number,
      default: 10,
    },
    // 1为日榜
    rankTypeId: {
      default: "default",
      type: String,
    },
    pagination: {
      type: Object || Boolean,
      default: () => ({
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: false,
        hideOnSinglePage: true,
      }),
    },
    columns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isProject: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tableColumns() {
      const { columns, sorterInfo } = this;

      let lis = [
        ...columns,
        //         {
        //   title: this.rankTypeId == "1" ? "花费（元）" : "花费（万元）",
        //   key: "totalCost",
        //   dataIndex: "totalCost",
        //   align: "center",
        //   fixed: "left",
        //   sorterId: "1",
        //   sorter: true,
        //   sortOrder: this.orderIndexId == 1 && this.ordervalue == 1
        //       ? "ascend"
        //       : this.orderIndexId == 1 && this.ordervalue == 0
        //       ? "descend"
        //       : "",
        //   scopedSlots: {
        //     customRender: "customCell",
        //   },
        //   customRender: this.tableRender("totalCostFlag"),
        // },
        {
          title: "PV维度",
          children: [
            {
              title: this.rankTypeId == "1" ? "PV (个)" : "PV (万)",
              key: "pvValue",
              sorter: true,
              align: "center",
              customRender: this.tableRender("pvValueFlag"),
              sorterId: "2",
              sortOrder: sorterInfo.columnKey === "pvValue" && sorterInfo.order,
              dataIndex: "pvValue",
            },
            {
              title: "PV成本(元)",
              key: "pvCost",
              sorter: true,
              align: "center",
              sorterId: "3",
              sortOrder: sorterInfo.columnKey === "pvCost" && sorterInfo.order,
              dataIndex: "pvCost",
              customRender: this.tableRender("pvCostFlag"),
            },
          ],
        },
        {
          title: "UV维度",
          children: [
            {
              title: this.rankTypeId == "1" ? "UV (个)" : "UV (万)",
              key: "uvValue",
              sorter: true,
              align: "center",
              sorterId: "4",
              sortOrder: sorterInfo.columnKey === "uvValue" && sorterInfo.order,
              dataIndex: "uvValue",
              customRender: this.tableRender("uvValueFlag"),
            },
            {
              title: "点击率",
              key: "uvRate",
              sorter: true,
              sorterId: "5",
              align: "center",
              dataIndex: "uvRate",
              customRender: this.tableRender("uvRateFlag"),
              sortOrder: sorterInfo.columnKey === "uvRate" && sorterInfo.order,
            },
            {
              title: "UV成本 (元)",
              key: "uvCost",
              sorter: true,
              sorterId: "6",
              align: "center",
              dataIndex: "uvCost",
              customRender: this.tableRender("uvCostFlag"),
              sortOrder: sorterInfo.columnKey === "uvCost" && sorterInfo.order,
            },
          ],
        },
        {
          title: "线索",
          children: [
            {
              title: "线索量(个)",
              key: "clueValue",
              align: "center",
              sorter: true,
              sorterId: "7",
              dataIndex: "clueValue",
              customRender: this.tableRender("clueValueFlag"),
              sortOrder:
                sorterInfo.columnKey === "clueValue" && sorterInfo.order,
            },
            {
              title: "留资率",
              key: "clueRate",
              sorter: true,
              align: "center",
              sorterId: "8",
              dataIndex: "clueRate",
              customRender: this.tableRender("clueRateFlag"),
              sortOrder:
                sorterInfo.columnKey === "clueRate" && sorterInfo.order,
            },
            {
              title: "线索成本(元)",
              key: "clueCost",
              dataIndex: "clueCost",
              sorter: true,
              align: "center",
              sorterId: "9",
              sortOrder: sorterInfo.columnKey === "cpl" && sorterInfo.order,
              customRender: this.tableRender("clueCostFlag"),
            },
          ],
        },
        {
          title: "有效线索维度",
          children: [
            {
              title: "有效线索量(个)",
              key: "vailClueValue",
              sorter: true,
              align: "center",
              sorterId: "10",
              dataIndex: "vailClueValue",
              customRender: this.tableRender("vailClueValueFlag"),
              sortOrder:
                sorterInfo.columnKey === "vailClueValue" && sorterInfo.order,
            },
            {
              title: "有效线索率",
              key: "vailClueRate",
              sorterId: "11",
              sorter: true,
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "vailClueRate" && sorterInfo.order,
              dataIndex: "vailClueRate",
              customRender: this.tableRender("vailClueRateFlag"),
            },
            {
              title: "有效线索成本(元)",
              key: "vailClueCost",
              sorter: true,
              sorterId: "12",
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "vailClueCost" && sorterInfo.order,
              dataIndex: "vailClueCost",
              customRender: this.tableRender("vailClueCostFlag"),
            },
          ],
        },
        {
          title: "成交维度",
          children: [
            {
              title: "成交量(个)",
              key: "dealValue",
              sorter: true,
              sorterId: "13",
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "dealValue" && sorterInfo.order,
              dataIndex: "dealValue",
              customRender: this.tableRender("dealValueFlag"),
            },
            {
              title: "成交率",
              key: "dealRate",
              sorterId: "14",
              sorter: true,
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "dealRate" && sorterInfo.order,
              dataIndex: "dealRate",
              customRender: this.tableRender("dealRateFlag"),
            },
            {
              title: "成交成本(元)",
              key: "dealCost",
              sorter: true,
              sorterId: "15",
              align: "center",
              dataIndex: "dealCost",
              customRender: this.tableRender("dealCostFlag"),
              sortOrder:
                sorterInfo.columnKey === "dealCost" && sorterInfo.order,
            },
          ],
        },
      ];
      if (this.isProject) {
        let deptArr = [
          {
            title: "事业部",

            align: "center",
            key: "parentDeptName",
            dataIndex: "parentDeptName",
          },
          {
            title: "投放部门",
            align: "center",

            key: "deptName",
            dataIndex: "deptName",
          },
        ];
        lis = [...lis, ...deptArr];
      }
      return lis;
    },
  },
  data() {
    return {
      pageOptions: {
        total: this.total,
        ...this.pagination,
      },
      sorterInfo: {},
    };
  },
  created() {
    this.$on("clearSorter", this.clearSorter);
  },
  methods: {
    rowClassName(record, index) {
      let className = "light";
      if (index % 2 === 1) className = "dark";
      return className;
    },
    change(page, filters, sorter) {
      let ordervalue = "";
      let orderIndexId = "";
      if (JSON.stringify(sorter) != "{}") {
        if (sorter.order) {
          ordervalue = sorter.order == "ascend" ? "1" : "0";
        } else {
          ordervalue = "1";
          sorter.order = "ascend";
        }
        if (sorter.column) {
          orderIndexId = sorter.column.sorterId;
        } else {
          orderIndexId = this.sorterInfo.column.sorterId;
        }
      }
      const obj = {
        orderIndexId,
        ordervalue,
        ...page,
      };
      if (JSON.stringify(this.sorterInfo) != JSON.stringify(sorter)) {
        obj.current = 1;
      }
      this.$emit("change", obj);
      this.sorterInfo = sorter;
    },
    tableRender(flag) {
      return (text, record, index) => {
        let htmls = "";
        if (text && text != "-") {
          htmls = `${text}%`;
        } else if (text) {
          htmls = text;
        }
        let showText = "";
        if (
          flag == "clueRateFlag" ||
          flag == "dealRateFlag" ||
          flag == "uvRateFlag" ||
          flag == "vailClueRateFlag"
        ) {
          showText = htmls;
        } else {
          showText = text;
        }
        return (
          <span class={record[flag] === "1" && "bule-font"}>{showText}</span>
        );
      };
    },
    clearSorter() {
      this.sorterInfo = {};
    },
  },
  watch: {
    pagination: {
      deep: true,
      handler: function(newVal) {
        this.pageOptions = {
          total: this.total,
          ...newVal,
        };
      },
    },
    total(newVal) {
      this.pageOptions = {
        total: newVal,
        ...this.pagination,
      };
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-table .dark {
  background-color: #f7f7f7 !important;
}
/deep/ .ant-table-thead > tr > th {
  background-color: #c1d7ec;
}
.bule-font {
  color: #0073c6;
  font-weight: bold;
}
</style>
