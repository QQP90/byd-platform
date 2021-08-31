<template>
  <div>
    <div class="search-box ranking">
      <div>
        <!-- <a-select v-model="rankTypeId" style="width: 160px" @change="idChange">
          <a-select-option
            v-for="(item, i) in projectDayMonthEndRank"
            :key="i"
            :value="item.rankTypeId"
          >
            {{ item.rankTypeName }}
          </a-select-option>
        </a-select> -->
        <monthPicker
          :maxMonth="month"
          :minMonth="startMonth"
          @change="hdMonthPicker"
          :values="monthPickerList"
        ></monthPicker>
        <!-- 事业部名称 -->
        <a-select
          style="width: 160px"
          mode="tags"
          v-model="deptId"
          @change="deptIdChange"
          placeholder="事业部名称"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in projectDeptDate"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
          >
            {{ item.parentDeptName }}
          </a-select-option>
        </a-select>
        <!-- 部门名称 -->
        <a-select
          style="width: 160px"
          mode="tags"
          v-model="deptSecIds"
          placeholder="部门名称"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in deptSec"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <a-select
          style="width: 170px"
          @change="dataChange"
          placeholder="项目类型"
          v-model="campaignTypeId"
          mode="tags"
          :max-tag-count="1"
          v-if="changeKey === 1"
        >
          <a-select-option
            v-for="item in projectCampaignData"
            :key="item.campaignTypeId"
            :value="item.campaignTypeId"
          >
            {{ item.campaignName }}
          </a-select-option>
        </a-select>
        <!-- <a-select
          v-model="subIndexId"
          style="width: 185px"
          v-if="changeKey == 1"
          mode="tags"
          :max-tag-count="1"
          placeholder="选择维度"
        >
          <a-select-option
            v-for="(item, index) in subIndexVal"
            :key="index"
            :value="item.indexId"
            >{{ item.indexName }}</a-select-option
          >
        </a-select> -->
      </div>
      <div>
        <a-button @click="reset()"> 重置 </a-button>
        <a-button type="primary" @click.stop="search()"> 查询 </a-button>
      </div>
    </div>
    <div class="rank">
      <a-tabs type="card" :default-active-key="1" @change="callback">
        <a-tab-pane :key="1" tab="榜单">
          <RankDataTable
            rowKey="name"
            :isProject="true"
            :dataSource="projectData"
            :type="type == 3 ? 'cost' : type == 2 ? 'order' : 'conversion'"
            @change="getChangePage"
            :columns="rankColumns"
            :rankTypeId="rankTypeId"
            :loading="loading"
            :total="rankPagination.total"
            :pagination="{
              pageSize: 10,
              total: rankPagination.total || 1,
              hideOnSinglePage: true,
              current: rankPagination.current,
            }"
            :filtersHeader="filtrateRankTableHeader"
          ></RankDataTable>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="明细数据">
          <DetailedDataTable
            rowKey="campaignName"
            ref="detailedDataTable"
            :columns="detailDataColumns"
            :rankTypeId="rankTypeId"
            :data-source="projectDataDetailList"
            :total="detailPagination.total"
            :loading="loading"
            :isProject="true"
            :pagination="{
              pageSize: 10,
              total: detailPagination.total || 1,
              hideOnSinglePage: true,
              current: detailPagination.current,
            }"
            @change="getChangePage"
          ></DetailedDataTable>
        </a-tab-pane>
        <span
          slot="tabBarExtraContent"
          v-if="changeKey == 2 && userAuth.downloadRoot"
        >
          <DownLoadData :url="downLoadUrl"></DownLoadData>
        </span>
      </a-tabs>

      <div class="change-type" v-if="isShowType">
        <span
          class="change-diamond"
          :class="[type == 3 ? 'active' : '']"
          @click="handleChangeType(3)"
        >
          投放成本
        </span>
        <span
          v-if="userAuth.roleId == 1"
          :class="[type == 2 ? 'active' : '']"
          class="change-num"
          @click="handleChangeType(2)"
        >
          投放量级
        </span>
        <!-- <span
          :class="[type == 5 ? 'active' : '']"
          class="change-num"
          @click="handleChangeType(5)"
        >
          转化率
        </span> -->
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import DetailedDataTable from "@/components/DetailedDataTable/DetailedDataTable.vue";
import RankDataTable from "@/components/RankDataTable/RankDataTable.vue";
import monthPicker from "@/components/MonthPicker/monthPicker.vue";
import DownLoadData from "@/components/DownLoadData/DownLoadData.vue";
import {
  getDeptDataByBuId,
  exportProjectDataDetailList,
  getProjectIndexs,
  getSubIndexData,
  getProjectIndexList,
  getProjectCampaignData,
  getParentDeptData,
  // getParentDeptLeaderData, //榜单一级事业部
  // getDeptLeaderDataByBuId, //榜单部门
} from "@/service/rank/project";
const crown = require("@/assets/img/crown.png");
const trophy_1 = require("@/assets/img/trophy_1.png");
const trophy_2 = require("@/assets/img/trophy_2.png");
const trophy_3 = require("@/assets/img/trophy_3.png");
// const diamond_a = require("@/assets/img/diamond_a.png");
// const diamond_clue = require("@/assets/img/diamond_clue.png");
// const diamond_p = require("@/assets/img/diamond_p.png");
// const diamond_s = require("@/assets/img/diamond_s.png");
const img = {
  trophy_1,
  trophy_2,
  trophy_3,
};
const userRole = ["1", "2"];
export default {
  name: "ProjectRank",
  components: {
    DownLoadData,
    DetailedDataTable,
    RankDataTable,
    monthPicker,
  },
  computed: {
    detailDataColumns() {
      let lis = [
        {
          title: "项目名称",
          align: "center",
          fixed: "left",
          key: "campaignName",
          dataIndex: "campaignName",
        },
      ];
      if (this.tableShowCost) {
        lis.push({
          title: this.rankTypeId == "1" ? "花费（元）" : "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          align: "center",
          fixed: "left",
          sorterId: "1",
          width: 140,
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
        });
      }
      return lis;
    },
    rankColumns() {
      let lis = [
        {
          title: "项目名称",
          align: "center",
          key: "name",
          dataIndex: "name",
        },
      ];
      if (this.tableShowCost) {
        lis.push({
          title: this.rankTypeId == "1" ? "花费（元）" : "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          sorterId: "1",
          sorter: true,
          width: 140,
          sortOrder:
            this.orderIndexId == 1 && this.ordervalue == 1
              ? "ascend"
              : this.orderIndexId == 1 && this.ordervalue == 0
              ? "descend"
              : "",
          align: "center",
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

    ...mapState("projectRank", {
      projectDayMonthEndRank: "projectDayMonthEndRank",
      projectIndexData: "projectIndexData",
      projectDayDate: "projectDayDate",
      projectMonthDate: "projectMonthDate",
      projectData: "projectData",
      projectDataDetailList: "projectDataDetailList",
      endTime: "endTime",
      total: "total",
      totalList: "totalList",
      startMonth: "startMonth",
      month: "month",
    }),
    ...mapState({ userAuth: (state) => state.userAuth }),
    downLoadUrl() {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      let str;
      if (this.deptSecIds.length > 0) {
        str = `deptId=${this.deptSecIds.toString()}`;
      } else {
        str = `parentDeptId=${this.deptId.toString()}&deptId=${this.deptSecIds.toString()}`;
      }
      return `/web-api/web/exportProjectDataDetailList?rankTypeId=${
        this.rankTypeId
      }&time=${this.getTime()}&${str}&campaignTypeId=${this.campaignTypeId.toString()}&subIndexId=${this.subIndexId.toString()}&ordervalue=${
        this.ordervalue
      }&orderIndexId=${this.orderIndexId}`;
    },
  },
  data() {
    return {
      analyseId: 1,//表头属性id:投放成本1,投放量级2,转化率3
      monthPickerList: [],
      filtrateRankTableHeader: [], // 筛选ranktable头部
      // diamond: "diamond",
      dataSource: [], //钻石表数据
      detailPagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },

      rankPagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      subIndexId: [], //维度
      time: null,//时间
      loading: false,
      paneList: [
        {
          name: "榜单",
        },
        {
          name: "明细数据",
        },
      ],
      type: 3,
      deptId: [],
      campaignTypeId: [],
      projectCampaignData: [],//项目类型
      projectDeptDate: [],

      rankTypeId: "2",

      changeKey: 1,
      pageSize: "10",
      subIndexVal: [],
      isShowType: true,//展示投放成本
      // 二级部门
      deptSec: [],
      deptSecIds: [],
      deptSecArr: [], // 所有二级部门
      orderIndexId: 3, //id
      ordervalue: "", //降序
    };
  },
  async mounted() {
    await this.getProjectDayDate();
    this.getParentDeptData();
    await this.getProjectMonthDate();
    this.getProjectDayMonthEndRank();
    this.time = moment(this.endTime);
    this.getProjectIndexs();
    // 获取二级
    this.getDeptDataByBuId();
    // 获取项目品牌组件数据
    this.getProjectCampaignData();

    this.monthPickerList = [
      String(this.projectMonthDate[this.projectMonthDate.length - 1]),
    ];
    this.getDataList();
  },
  watch: {
    changeKey(val) {
      if (val == 2) {
        this.isShowType = false;
      } else {
        this.isShowType = true;
      }
    },
  },
  methods: {
    moment,
    ...mapActions("projectRank", [
      "getProjectCampaignData",
      "getProjectDayDate",
      "getProjectMonthDate",
      "getDayMonthEndRank",
      "getProjectDayMonthEndRank",
      "getProjectDataList",
      "getProjectDataDetailList",
      "getDeptRankOverallDataList",
      "getDeptRankProjectDataList",
    ]),
    callback(key) {
      this.detailPagination.current = this.rankPagination.current = 1;
      this.changeKey = key;
      this.search();
    },

    getParentDeptData() {
      getParentDeptData().then((res) => {
        this.projectDeptDate = res.data;
      });
      // switch (this.changeKey) {
      //   case 1:
      //     getParentDeptLeaderData().then((res) => {
      //       this.projectDeptDate = res.data;
      //     });
      //     break;
      //   case 2:

      //     break;
      //   default:
      //     break;
      // }
    },
    getProjectIndexs() {
      getProjectIndexs().then((res) => {
        this.subIndexVal = res.data;
      });
    },
    getProjectCampaignData() {
      getProjectCampaignData().then((res) => {
        this.projectCampaignData = res.data;
        this.campaignTypeId = res.data.map((v) => {
          return v.campaignTypeId;
        });
      });
    },
    // 获取二级部门id
    getDeptDataByBuId() {
      // if (this.changeKey == 1) {
      //   getDeptLeaderDataByBuId({ parentDeptId: this.deptId.join(",") }).then(
      //     (res) => {
      //       this.deptSec = res.data;
      //       this.deptSecArr = res.data;
      //     }
      //   );
      // } else {
      getDeptDataByBuId({ parentDeptId: this.deptId.join(",") }).then((res) => {
        this.deptSec = res.data;
        this.deptSecArr = res.data;
      });
      // }
    },
    // 一级联动
    deptIdChange(item) {
      if (item.length == 0) {
        this.deptSec = this.deptSecArr;
        return;
      }
      const { deptSecArr, deptSecIds, projectDeptDate } = this;
      let lis = [];
      for (let i = 0, len = item.length; i < len; i++) {
        for (let index = 0, len = deptSecArr.length; index < len; index++) {
          if (Number(item[i]) === Number(deptSecArr[index].parentDeptId)) {
            lis = [...lis, deptSecArr[index]];
          }
        }
      }
      const deptIdLis = [];
      lis.forEach((item, i) => {
        if (deptSecIds.indexOf(item.deptId) > -1) {
          deptIdLis.push(item.deptId);
        }
      });

      this.deptSec = lis;
      this.deptSecIds = deptIdLis;
    },

    handleChangeType(sorterId) {
      this.type = sorterId;
      this.orderIndexId = "";
      this.ordervalue = "";
      if (sorterId == 3) {
        this.analyseId = 1;
      }
      if (sorterId == 2) {
        this.analyseId = 2;
      }
      if (sorterId == 5) {
        this.analyseId = 3;
      }
      this.search();
    },
    idChange(value) {
      if (value === "1") {
        this.time = moment(this.endTime);
      }
      this.monthPickerList = [
        String(this.projectMonthDate[this.projectMonthDate.length - 1]),
        String(this.projectMonthDate[this.projectMonthDate.length - 1]),
      ];
    },

    // 分页
    async getChangePage(parmas) {
      this.orderIndexId = parmas.orderIndexId;
      this.ordervalue = parmas.ordervalue;
      if (this.changeKey == 1) {
        this.rankPagination.current = parmas.current;
      } else {
        this.detailPagination.current = parmas.current;
      }
      this.pageSize = parmas.pageSize;
      if (this.changeKey == 1) {
        this.getDataList();
      } else {
        this.getDataDetailList();
      }
    },
    reTurnDataObj() {
      let obj = {
        rankTypeId: this.rankTypeId,
        analyseId: this.analyseId,
        time: this.getTime(), //时间
        parentDeptId: this.deptId.toString(),
        deptId: this.deptSecIds.toString(),
        campaignTypeId: this.campaignTypeId.join(","),
        currentPage:
          this.changeKey == 1
            ? this.rankPagination.current
            : this.detailPagination.current,
        pageSize: this.pageSize,
        orderIndexId: this.orderIndexId,
        ordervalue: this.ordervalue,
        indexId: this.subIndexId.join(","),
      };
      if (this.deptSecIds.length > 0) {
        delete obj["parentDeptId"];
      }
      return obj;
    },
    // 明细
    async getDataDetailList() {
      this.loading = true;
      let obj = await this.reTurnDataObj();
      await this.getProjectDataDetailList(obj);
      this.detailPagination.total = this.totalList || 0;
      this.loading = false;
    },
    // 榜单
    async getDataList() {
      this.loading = true;
      let obj = await this.reTurnDataObj();
      await this.getProjectDataList(obj);
      this.rankPagination.total = this.total;
      this.loading = false;
    },

    getTime() {
      if (this.rankTypeId == 1) {
        let dayTime = moment(this.time).format("YYYY-MM-DD");
        return dayTime;
      } else {
        return this.monthPickerList.join(",");
      }
    },
    search() {
      this.filtrateRankTableHeader = this.subIndexId;
      if (this.changeKey == 1) {
        this.getDataList();
      } else if (this.changeKey == 2) {
        this.getDataDetailList();
      }
    },
    dataChange(value) {
      this.campaignTypeId = value;
    },
    reset() {
      this.detailPagination.current = this.rankPagination.current = 1;
      this.time = moment(this.endTime);
      this.deptId = [];
      this.deptSecIds = [];
      this.subIndexId = [];
      this.campaignTypeId = [];
      this.subIndexVal = [];
      this.getProjectIndexs({
        campaignTypeId: this.campaignTypeId.join(","),
      });
      this.getProjectCampaignData();
      this.getParentDeptData();
      this.getDeptDataByBuId();
      this.search();
      this.monthPickerList = [
        String(this.projectMonthDate[this.projectMonthDate.length - 1]),
        String(this.projectMonthDate[this.projectMonthDate.length - 1]),
      ];
    },
    hdMonthPicker(value) {
      this.monthPickerList = value;
    },
  },
};
</script>
<style lang="less" scoped>
.rank {
  position: relative;
  margin-top: 20px;

  .change-type {
    position: absolute;
    right: 0;
    top: 0;
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
  .hint {
    position: absolute;
    top: 7px;
    left: 246px;
  }
}
</style>
<style lang="less">
.rank-box {
  .ant-select {
    .ant-select-selection--multiple {
      .ant-select-selection__choice {
        width: 60px;
      }
    }
  }
}
</style>
