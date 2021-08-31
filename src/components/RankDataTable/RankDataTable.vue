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
    <template slot="rank" slot-scope="text, record">
      <img
        v-if="record.rank <= 3"
        :src="ranking['rank_' + record.rank]"
        style="width: 36px; heigth: 36px"
        alt=""
      />
      <span v-else>
        {{ record.rank }}
      </span>
    </template>
    <!-- <template slot="PV" slot-scope="text, record">
      <span
        v-show="type === 'diamond' && text && text != 0"
        class="diamond diamond-p"
      >
        X {{ text }}
      </span>
      <span v-show="type === 'numerical'">
        <span v-for="(item, i) in record.pvList" :key="item.subIndexId">
          {{ item.subIndexName }}&nbsp;{{ item.value }}
          <span v-if="i !== record.pvList.length - 1">|</span>
        </span>
      </span>
    </template>
    <template slot="UV" slot-scope="text, record">
      <span
        v-show="type === 'diamond' && text && text != 0"
        class="diamond diamond-u"
      >
        X {{ text }}
      </span>
      <span v-show="type === 'numerical'">
        <span v-for="(item, i) in record.uvList" :key="item.subIndexId">
          {{ item.subIndexName }}&nbsp;
          <span v-if="item.subIndexName == '点击率' && item.value !== '-'">
            {{ item.value }}%
          </span>
          <span v-else>{{ item.value }}</span>
          <span v-if="i !== record.uvList.length - 1">|</span>
        </span>
      </span>
    </template>
    <template slot="clue" slot-scope="text, record">
      <span
        v-show="type === 'diamond' && text && text != 0"
        class="diamond diamond-clue"
      >
        X {{ text }}
      </span>
      <span v-show="type === 'numerical'">
        <span v-for="(item, i) in record.clueList" :key="item.subIndexId">
          {{ item.subIndexName }}&nbsp;
          <span v-if="item.subIndexName == '留资率' && item.value !== '-'">
            {{ item.value }}%
          </span>
          <span v-else>{{ item.value }}</span>

          <span v-if="i !== record.clueList.length - 1">|</span>
        </span>
      </span>
    </template>
    <template slot="vailClue" slot-scope="text, record">
      <span
        v-show="type === 'diamond' && text && text != 0"
        class="diamond diamond-a"
      >
        X {{ text }}
      </span>
      <span v-show="type === 'numerical'">
        <span v-for="(item, i) in record.vailClueList" :key="item.subIndexId">
          {{ item.subIndexName }}&nbsp;
          <span v-if="item.subIndexName == '线索有效率' && item.value !== '-'">
            {{ item.value }}%
          </span>
          <span v-else>{{ item.value }}</span>
          <span v-if="i !== record.vailClueList.length - 1">|</span>
        </span>
      </span>
    </template>
    <template slot="deal" slot-scope="text, record">
      <span
        v-show="type === 'diamond' && text && text != 0"
        class="diamond diamond-s"
      >
        X {{ text }}
      </span>
      <span v-show="type === 'numerical'">
        <span v-for="(item, i) in record.dealList" :key="item.subIndexId">
          {{ item.subIndexName }}&nbsp;
          <span v-if="item.subIndexName == '成交率' && item.value !== '-'">
            {{ item.value }}%
          </span>
          <span v-else>{{ item.value }}</span>
          <span v-if="i !== record.dealList.length - 1">|</span>
        </span>
      </span>
    </template> -->
  </a-table>
</template>
<script>
const diamond_a = require("@/assets/img/diamond_a.png");
const diamond_u = require("@/assets/img/diamond_u.png");
const diamond_p = require("@/assets/img/diamond_p.png");
const diamond_s = require("@/assets/img/diamond_s.png");
const diamond_clue = require("@/assets/img/diamond_clue.png");
const rank_1 = require("@/assets/img/rank_1.png");
const rank_2 = require("@/assets/img/rank_2.png");
const rank_3 = require("@/assets/img/rank_3.png");
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    // type: {
    //   type: String,
    //   default: "diamond", // 显示数据类型  diamond钻石  numerical数值
    // },
    type: {
      type: String,
      default: "cost", // 修改表头  cost投放成本 order投放量级  conversion转化率
    },
    filtersHeader: {
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
    // 1传递的是日榜，修改标题
    rankTypeId: {
      type: String,
      default: "default",
    },
    pagination: {
      type: Object || Boolean,
      default: () => ({
        pageSize: 11, //每页中显示10条数据
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
      const { columns, filtersHeader, sorterInfo } = this;
      // const columnsList = [
      //   {
      //     title: "PV",
      //     key: "pvFlag",
      //     dataIndex: "pvFlag",
      //     sorter: true,
      //     sortOrder: sorterInfo.columnKey === "pvFlag" && sorterInfo.order,
      //     sorterId: "2",
      //     scopedSlots: {
      //       customRender: "PV",
      //     },
      //     align: "center",
      //   },
      //   {
      //     title: "UV",
      //     key: "uvFlag",
      //     dataIndex: "uvFlag",
      //     sorterId: "3",
      //     sorter: true,
      //     sortOrder: sorterInfo.columnKey === "uvFlag" && sorterInfo.order,
      //     scopedSlots: {
      //       customRender: "UV",
      //     },
      //     align: "center",
      //   },
      //   {
      //     title: "线索",
      //     sorterId: "4",
      //     key: "clueFlag",
      //     dataIndex: "clueFlag",
      //     sorter: true,
      //     sortOrder: sorterInfo.columnKey === "clueFlag" && sorterInfo.order,
      //     scopedSlots: {
      //       customRender: "clue",
      //     },
      //     align: "center",
      //   },
      //   {
      //     title: "有效线索",
      //     sorterId: "5",
      //     key: "vailClueFlag",
      //     dataIndex: "vailClueFlag",
      //     sorter: true,
      //     sortOrder:
      //       sorterInfo.columnKey === "vailClueFlag" && sorterInfo.order,
      //     scopedSlots: {
      //       customRender: "vailClue",
      //     },
      //     align: "center",
      //   },
      //   {
      //     title: "成交",
      //     key: "dealFlag",
      //     sorterId: "6",
      //     dataIndex: "dealFlag",
      //     sorter: true,
      //     sortOrder: sorterInfo.columnKey === "dealFlag" && sorterInfo.order,
      //     scopedSlots: {
      //       customRender: "deal",
      //     },
      //     align: "center",
      //   },
      // ];
      // cost投放成本 order量级  conversion转化率
      let columnsList = [];
      switch (this.type) {
        case "cost":
          columnsList = [
            {
              title: "PV成本",
              key: "pvCost",
              sorter: true,
              align: "center",
              sorterId: "3",
              sortOrder: sorterInfo.columnKey === "pvCost" && sorterInfo.order,
              dataIndex: "pvCost",
              customRender: this.tableRender("pvCostRank"),
            },
            {
              title: "UV成本",
              key: "uvCost",
              sorter: true,
              sorterId: "6",
              align: "center",
              dataIndex: "uvCost",
              customRender: this.tableRender("uvCostRank"),
              sortOrder: sorterInfo.columnKey === "uvCost" && sorterInfo.order,
            },
            {
              title: "线索成本",
              key: "clueCost",
              dataIndex: "clueCost",
              sorter: true,
              align: "center",
              sorterId: "9",
              sortOrder:
                sorterInfo.columnKey === "clueCost" && sorterInfo.order,
              customRender: this.tableRender("clueCostRank"),
            },
            {
              title: "有效线索成本",
              key: "vailClueCost",
              sorter: true,
              sorterId: "12",
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "vailClueCost" && sorterInfo.order,
              dataIndex: "vailClueCost",
              customRender: this.tableRender("vailClueCostRank"),
            },
            {
              title: "成交成本",
              key: "dealCost",
              sorter: true,
              sorterId: "15",
              align: "center",
              dataIndex: "dealCost",
              customRender: this.tableRender("dealCostRank"),
              sortOrder:
                sorterInfo.columnKey === "dealCost" && sorterInfo.order,
            },
          ];
          break;
        case "order":
          columnsList = [
            {
              title: this.rankTypeId == "1" ? "PV (个)" : "PV (万)",
              key: "pvValue",
              sorter: true,
              align: "center",
              customRender: this.tableRender("pvValueRank"),
              sorterId: "2",
              sortOrder: sorterInfo.columnKey === "pvValue" && sorterInfo.order,
              dataIndex: "pvValue",
            },
            {
              title: this.rankTypeId == "1" ? "UV (个)" : "UV (万)",
              key: "uvValue",
              sorter: true,
              align: "center",
              sorterId: "4",
              sortOrder: sorterInfo.columnKey === "uvValue" && sorterInfo.order,
              dataIndex: "uvValue",
              customRender: this.tableRender("uvValueRank"),
            },
            {
              title: "线索量(个)",
              key: "clueValue",
              align: "center",
              sorter: true,
              sorterId: "7",
              dataIndex: "clueValue",
              customRender: this.tableRender("clueValueRank"),
              sortOrder:
                sorterInfo.columnKey === "clueValue" && sorterInfo.order,
            },
            {
              title: "有效线索量(个)",
              key: "vailClueValue",
              sorter: true,
              align: "center",
              sorterId: "10",
              dataIndex: "vailClueValue",
              customRender: this.tableRender("vailClueValueRank"),
              sortOrder:
                sorterInfo.columnKey === "vailClueValue" && sorterInfo.order,
            },
            {
              title: "成交量(个)",
              key: "dealValue",
              sorter: true,
              sorterId: "13",
              align: "center",
              sortOrder:
                sorterInfo.columnKey === "dealValue" && sorterInfo.order,
              dataIndex: "dealValue",
              customRender: this.tableRender("dealValueRank"),
            },
          ];
          break;
        case "conversion":
          columnsList = [
            {
              title: "点击率",
              key: "uvRate",
              sorter: true,
              sorterId: "5",
              align: "center",
              dataIndex: "uvRate",
              customRender: this.tableRender("uvRateRank"),
              sortOrder: sorterInfo.columnKey === "uvRate" && sorterInfo.order,
            },
            {
              title: "留资率",
              key: "clueRate",
              sorter: true,
              align: "center",
              sorterId: "8",
              dataIndex: "clueRate",
              customRender: this.tableRender("clueRateRank"),
              sortOrder:
                sorterInfo.columnKey === "clueRate" && sorterInfo.order,
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
              customRender: this.tableRender("vailClueRateRank"),
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
              customRender: this.tableRender("dealRateRank"),
            },
          ];
          break;
      }
      const projectColumns = [
        {
          dataIndex: "parentDeptName",
          key: "parentDeptName",
          title: "事业部",
          align: "center",
        },
        {
          dataIndex: "deptName",
          key: "deptName",
          title: "投放部门",
        },
      ];
      let filtersHeaderList = [];
      if (this.isProject) {
        filtersHeaderList = [...columnsList, ...projectColumns];
      } else {
        filtersHeaderList = [...columnsList];
      }
      // if (filtersHeader.length) {
      //   columnsList.forEach((item) => {
      //     if (filtersHeader.includes(item.sorterId)) {
      //       filtersHeaderList.push(item);
      //     }
      //   });
      // } else {
      // filtersHeaderList = JSON.parse(JSON.stringify(columnsList));
      // }
      return [
        {
          title: "序号",
          key: "rank",
          fixed: "left",
          align: "center",
          dataIndex: "rank",
          width: 100,
          scopedSlots: {
            customRender: "rank",
          },
        },
        ...columns,
        ...filtersHeaderList,
      ];
    },
  },
  data() {
    return {
      pageOptions: {
        total: this.total,
        ...this.pagination,
      },
      sorterInfo: {},
      ranking: {
        rank_1,
        rank_2,
        rank_3,
      },
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
    clearSorter() {
      this.sorterInfo = {};
    },
    tableRender(flag) {
      const { pageOptions, type } = this;

      return (text, record, index) => {
        if (pageOptions.total <= 3) {
          return (
            <span class={record[flag] == 1 && "highlight"}>
              {`${text}${type == "conversion" ? "%" : ""}${
                record[flag] ? "/" + record[flag] : ""
              }`}
            </span>
          );
        } else {
          return (
            <span class={record[flag] <= 3 && "highlight"}>
              {`${text}${type == "conversion" ? "%" : ""}${
                record[flag] ? "/" + record[flag] : ""
              }`}
            </span>
          );
        }
      };
    },
  },
  watch: {
    pagination: {
      deep: true,
      handler: function (newVal) {
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
.diamond {
  display: inline-block;
  height: 24px;
  width: 62px;
  background-size: 62px 24px;
  padding-left: 30px;
  color: white;
}
.diamond-p {
  background-image: url("~@/assets/img/diamond_p.png");
}
.diamond-a {
  background-image: url("~@/assets/img/diamond_a.png");
}
.diamond-u {
  background-image: url("~@/assets/img/diamond_u.png");
}
.diamond-s {
  background-image: url("~@/assets/img/diamond_s.png");
}
.diamond-clue {
  background-image: url("~@/assets/img/diamond_clue.png");
}
.highlight {
  font-weight: bold;
  font-size: 16px;
  color: #0073c6;
}
</style>
