<template>
  <div>
    <div class="search-box ranking">
      <div>
        <a-select
          v-model="rankTypeId"
          style="width: 160px"
          @change="timeTypeChange"
        >
          <a-select-option
            v-for="(item, i) in timeRankType"
            :key="i"
            :value="item.rankTypeId"
          >
            {{ item.rankTypeName }}
          </a-select-option>
        </a-select>
        <a-month-picker
          v-model="monthPick"
          v-if="rankTypeId === '1'"
          :disabledDate="disabledDate"
          placeholder="选择月份"
        />
        <quarterPick
          v-if="rankTypeId === '2'"
          v-model="quarterPick"
          :minDate="quarterDate[0]"
          :maxDate="quarterDate[1]"
        />
        <a-select
          style="width: 160px"
          v-model="rankYear"
          v-if="rankTypeId === '3'"
        >
          <a-select-option
            v-for="(item, i) in yearList"
            :key="i"
            :value="item"
            >{{ item }}</a-select-option
          >
        </a-select>
        <monthPicker
          :maxMonth="maxMonth"
          :minMonth="minMonth"
          :values="monthPickerList"
          v-if="rankTypeId === '4'"
          @change="hdMonthPicker"
        ></monthPicker>
        <!-- <a-select
          v-model="indexId"
          style="width: 185px"
          v-if="tabsIndex == 1"
          mode="tags"
          :max-tag-count="1"
          placeholder="选择指标"
        >
          <a-select-option
            v-for="(item, index) in indexIdArr"
            :key="index"
            :value="item.indexId"
            >{{ item.indexName }}</a-select-option
          >
        </a-select> -->
      </div>
      <div>
        <a-button @click="reset"> 重置 </a-button>
        <a-button @click="search" type="primary"> 查询 </a-button>
      </div>
    </div>
    <div class="rank">
      <a-tabs
        type="card"
        v-model="tabsIndex"
        :default-active-key="1"
        @change="tabsChange"
      >
        <a-tab-pane :key="1" tab="榜单">
          <RankDataTable
            rowKey="name"
            :loading="loading"
            :data-source="dataTable"
            :columns="tableColumns"
            :type="type == 3 ? 'cost' : type == 2 ? 'order' : 'conversion'"
            :filtersHeader="filtrateRankTableHeader"
            :total="rankPagination.total"
            :pagination="{
              pageSize: 10,
              total: rankPagination.total || 1,
              hideOnSinglePage: true,
              current: rankPagination.current,
            }"
            @change="getChangePage"
          ></RankDataTable>
        </a-tab-pane>
        <a-tab-pane :key="2" v-if="userAuth.business" tab="明细数据">
          <DetailedDataTable
            rowKey="name"
            ref="detailedDataTable"
            :loading="loading"
            :dataSource="detailDataTable"
            :pagination="{
              pageSize: 10,
              total: detailPagination.total || 1,
              hideOnSinglePage: true,
              current: detailPagination.current,
            }"
            @change="getChangePage"
            :total="detailPagination.total"
            :columns="detailDataColumn"
          ></DetailedDataTable>
        </a-tab-pane>
        <span
          slot="tabBarExtraContent"
          v-if="tabsIndex === 2 && userAuth.downloadRoot"
          class="download"
        >
          <DownLoadData :url="downLoadUrl"></DownLoadData>
        </span>
      </a-tabs>
      <div class="change-type" v-if="isShowType">
        <span
          class="change-diamond"
          :class="[type == 3 ? 'active' : '']"
          @click="handleChangeType(3, 1)"
        >
          投放成本
        </span>
        <span
          v-if="userAuth.roleId == 1"
          :class="[type == 2 ? 'active' : '']"
          class="change-num"
          @click="handleChangeType(2, 2)"
        >
          投放量级
        </span>
        <!-- <span
          :class="[type == 5 ? 'active' : '']"
          class="change-num"
          @click="handleChangeType(5, 3)"
        >
          转化率
        </span> -->
      </div>
      <!-- <Hint
        class="hint"
        title="钻石规则说明"
        content="按指标排名获取钻石，指标排名TOP1事业部，获取钻石"
      >
        钻石规则说明<a-icon type="question-circle" style="margin-left: 5px" />
      </Hint> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import Hint from "@/components/HintTips/HintTips.vue";
import DetailedDataTable from "@/components/DetailedDataTable/DetailedDataTable.vue";
import RankDataTable from "@/components/RankDataTable/RankDataTable.vue";
import monthPicker from "@/components/MonthPicker/monthPicker.vue";
import quarterPick from "@/components/QuarterPick/QuarterPick.vue";
import moment from "moment";
import {
  exportBuDataDetailList,
  getBuMonthDate,
  getBuQuarterDate,
  getBuRankDataDetailList,
  getBuRankDataList,
  getBuYearDate,
  selectIndexData,
  getBuRankDate,
  getDoneMonthDate,
} from "@/service/rank/business";
import DownLoadData from "@/components/DownLoadData/DownLoadData.vue";
const crown = require("@/assets/img/crown.png");
const trophy_1 = require("@/assets/img/trophy_1.png");
const trophy_2 = require("@/assets/img/trophy_2.png");
const trophy_3 = require("@/assets/img/trophy_3.png");
const img = {
  trophy_1,
  trophy_2,
  trophy_3,
};
const userRole = ["1", "2"];
export default {
  name: "ProjectRank",
  components: {
    // Hint,
    DetailedDataTable,
    quarterPick,
    DownLoadData,
    RankDataTable,
    monthPicker,
  },
  computed: {
    ...mapState({
      userAuth: (state) => state.userAuth, // 角色权限字段
    }),
    detailDataColumn() {
      return [
        {
          title: "事业部",
          key: "name",
          dataIndex: "name",
          fixed: "left",
          width: 150,
          align: "center",
        },
        {
          title: this.rankTypeId == "1" ? "花费（元）" : "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          align: "center",
          fixed: "left",
          width: 140,
          sorterId: "1",
          sorter: true,
          sortOrder:
            this.orderIndexId == 1 && this.ordervalue == 1
              ? "ascend"
              : this.orderIndexId == 1 && this.ordervalue == 0
              ? "descend"
              : "",
          scopedSlots: {
            customRender: "customCell",
          },
        },
      ];
    },
    tableColumns() {
      const lis = [
        {
          dataIndex: "name",
          key: "name",
          title: "事业部",
          align: "center",
          fixed: "left",
          width: 150,
        },
      ];
      if (this.tableShowCost) {
        lis.push({
          title: "花费（万元）",
          key: "totalCost",

          fixed: "left",
          dataIndex: "totalCost",
          align: "center",
          sorterId: "1",
          sorter: true,
          width: 140,
          sortOrder:
            this.orderIndexId == 1 && this.ordervalue == 1
              ? "ascend"
              : this.orderIndexId == 1 && this.ordervalue == 0
              ? "descend"
              : "",
          scopedSlots: {
            customRender: "customCell",
          },
        });
      }
      return lis;
    },
    // 表格是否显示花费字段
    tableShowCost() {
      if (userRole.includes(this.userAuth.roleId)) {
        return true;
      } else {
        return false;
      }
    },
    quarter() {
      const quarter = this.quarterPick.replace(/[^0-9]/gi, "");
      return quarter;
    },
    downLoadUrl() {
      return `/web-api/web/exportBuDataDetailList?rankTypeId=${
        this.rankTypeId
      }&time=${this.timer()}&orderIndexId=${this.orderIndexId}&ordervalue=${
        this.ordervalue
      }`;
    },
  },
  data() {
    return {
      loading: false,
      analyseId: 1, //表头属性id:投放成本1,投放量级2,转化率3
      timeRankType: [], // 日榜。月榜，年榜选择器数据数组
      rankTypeId: "4", // 日榜。月榜，年榜选择器选择的值，默认月榜
      yearList: [], // 年份选择数组
      rankYear: new Date().getFullYear(),
      monthDate: [], // 月份数组
      quarterDate: [], // 季度数组
      monthPick: null,
      quarterPick: null, // 选择的季度
      cownShow: true, // 控制榜单
      indexIdArr: [], //维度数组
      columns: [
        {
          dataIndex: "rank",
          key: "rank",
          title: "排行",
          align: "center",
          customRender: (text, record, index) => {
            if (text < 4) {
              return <img src={img[`trophy_${index + 1}`]} />;
            } else {
              return <span>{index + 1}</span>;
            }
          },
        },
        {
          dataIndex: "buName",
          key: "buName",
          title: "事业部",
          align: "center",
        },
        {
          dataIndex: "crownCount",
          key: "crownCount",
          align: "center",
          scopedSlots: {
            customRender: "crownCountColumns",
            title: "crownCountTitle",
          },
        },
      ],
      dataTable: [], // 榜单数据
      detailDataTable: [], // 明细数据数组
      indexId: [], // 监测指标数组
      orderIndexId: "", //排序字段Id
      ordervalue: "", //0,1升降
      minMonth: "", //最小月份
      maxMonth: "", //最大月份
      rankPagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      }, // 榜单分页
      isShowType: true,
      type: 3,
      detailPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      }, // 明细数据分页
      tabsIndex: 1, // 榜单和明细数据tabsindex
      time: null,
      filtrateRankTableHeader: [], // 筛选ranktable头部
      monthPickerList: [], // 完结榜时间
    };
  },
  async mounted() {
    Promise.all([
      this.getBuRankDate(),
      this.getBuYearDate(),
      this.getDoneMonthDate(),
      this.getBuMonthDate(),
      this.getBuQuarterDate(),
      this.selectIndexData(),
    ]).then(() => {
      this.search();
    });
  },
  methods: {
    // 获取事业部年度时间数据
    async getBuYearDate() {
      try {
        const res = await getBuYearDate();
        this.yearList = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单数据列表
    async getBuRankDataList() {
      this.dataTable = [];
      this.loading = true;
      const obj = {
        rankTypeId: this.rankTypeId,
        time: this.timer(),
        indexId: this.indexId.toString(),
        currentPage: this.rankPagination.current,
        pageSize: 10,
        orderIndexId: this.orderIndexId,
        ordervalue: this.ordervalue,
        analyseId: this.analyseId,
      };
      try {
        const res = await getBuRankDataList(obj);
        this.dataTable = res.data.list;
        this.rankPagination.total = res.data.total;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.dataTable = [];
        this.rankPagination.total = 0;
      }
    },
    // 维度
    selectIndexData() {
      selectIndexData()
        .then((res) => {
          this.indexIdArr = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 完结榜回调2
    hdMonthPicker(val) {
      this.monthPickerList = val;
    },
    // 完结榜单的日期
    getDoneMonthDate() {
      getDoneMonthDate()
        .then((res) => {
          this.minMonth = res.data.sort()[0].toString();
          let dataArr = res.data.sort()[res.data.sort().length - 1];
          this.maxMonth = dataArr.toString();
          // 修改monthPickerList展示方式
          this.monthPickerList = [this.maxMonth];
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 表单回调
    async getChangePage(parmas) {
      this.orderIndexId = parmas.orderIndexId;
      if (this.tabsIndex == 1) {
        this.rankPagination.current = parmas.current;
      } else {
        this.detailPagination.current = parmas.current;
      }
      this.ordervalue = parmas.ordervalue;
      if (this.tabsIndex == 1) {
        this.getBuRankDataList();
      } else {
        this.getBuRankDataDetailList();
      }
    },
    // 获取事业部榜单明细数据
    async getBuRankDataDetailList() {
      this.loading = true;
      try {
        const obj = {
          rankTypeId: this.rankTypeId,
          time: this.timer(),
          indexId: this.indexId.map((item) => item.id).toString(),
          currentPage: this.detailPagination.current,
          pageSize: 10,
          orderIndexId: this.orderIndexId,
          ordervalue: this.ordervalue,
        };
        const res = await getBuRankDataDetailList(obj);
        this.detailDataTable = res.data.list;
        this.detailPagination.total = res.data.total;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.detailDataTable = [];
        this.detailPagination.total = 0;
      }
    },
    // 获取事业部季度时间数据
    async getBuQuarterDate() {
      try {
        const res = await getBuQuarterDate();
        this.quarterDate = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    getBuRankDate() {
      getBuRankDate()
        .then((res) => {
          this.timeRankType = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 获取事业部月时间数据
    async getBuMonthDate() {
      try {
        const res = await getBuMonthDate();
        this.monthDate = res.data;
        this.monthPick = moment(
          res.data[res.data.length - 1].toString(),
          "YYYYMM"
        );
      } catch (err) {
        console.error(err);
      }
    },

    //Ant Design封装年份选择组件
    openChange(status) {
      if (status) {
        this.open = true;
      } else {
        this.open = false;
      }
    },
    panelChange(value) {
      this.year = value;
      this.open = false;
    },
    disabledDate(current) {
      const startMonth = this.monthDate[0];
      const endMonth = this.monthDate[this.monthDate.length - 1];
      return (
        current < moment(startMonth, "YYYYMM") ||
        current > moment(endMonth, "YYYYMM")
      );
    },
    // 检测指标选择返回值
    onConfirm(val) {
      this.indexId = val;
    },
    timeTypeChange(val) {
      if (val === 1) {
        this.monthPick = this.monthDate[this.monthDate.length - 1].toString();
      } else if (val === 2) {
        this.rankYear = this.yearList[this.yearList.length - 1];
      } else {
        this.quarterPick =
          this.quarterDate[this.quarterDate.length - 1].toString();
      }
    },
    handleChangeType(type, analyseId) {
      this.type = type;
      this.analyseId = analyseId;
      this.search();
    },
    rankChange(page) {
      this.rankPagination.current = page.current;
      this.getBuRankDataList();
    },

    reset() {
      this.rankTypeId = "4";
      this.monthPick = moment(
        this.monthDate[this.monthDate.length - 1].toString(),
        "YYYYMM"
      );
      this.selectCampaign = ["1", "2"];
      this.indexId = [];
      this.monthPickerList = [this.maxMonth, this.maxMonth];
      this.search();
    },
    search() {
      this.detailPagination.current = this.rankPagination.current = 1;
      this.filtrateRankTableHeader = this.indexId;
      if (this.tabsIndex === 1) {
        this.getBuRankDataList();
      } else {
        this.getBuRankDataDetailList();
      }
    },
    tabsChange(val) {
      this.indexId = [];
      this.selectCampaign = ["1", "2"];
      this.isShowType = val == 1 ? true : false;
      this.search();
    },
    timer() {
      if (this.rankTypeId === "1") {
        return moment(this.monthPick).format("YYYYMM");
      } else if (this.rankTypeId === "2") {
        return this.quarterPick;
      } else if (this.rankTypeId === "3") {
        return this.rankYear;
      } else {
        return this.monthPickerList.join(",");
      }
    },
  },
  watch: {
    tabsIndex(val) {
      // if (val == 2) {
      // }
    },
  },
};
</script>
<style lang="less" scoped>
.change-type {
  position: absolute;
  right: 0;
  top: 0px;
  .change-diamond,
  .change-num {
    display: inline-block;
    width: 77px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    background: #eff1f2;
    text-align: center;
    border: 1px solid #d9d9d9;

    &.active {
      border-color: #0073c6;
      background: #0073c6;
      color: #fff;
    }
  }
}
.rank {
  position: relative;
  margin-top: 20px;

  .hint {
    position: absolute;
    top: 7px;
    left: 246px;
  }
  .download {
    cursor: pointer;
  }
  .cown-dart {
    color: #7e8294;
    font-weight: 500;
    cursor: pointer;
  }
  .cown-linght {
    color: #000000;
    font-weight: 500;
  }
}
</style>
