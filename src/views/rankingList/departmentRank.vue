<template>
  <div>
    <div class="search-box ranking">
      <div>
        <a-select
          v-model="analysisTypeId"
          @change="analysisChange"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in analysisTypeList"
            :key="item.analysisTypeId"
            :value="item.analysisTypeId"
          >
            {{ item.analysisTypeName }}
          </a-select-option>
        </a-select>

        <a-select
          v-model="rankTypeId"
          style="width: 160px"
          placeholder="选择榜单"
        >
          <template v-for="item in rankTypeList">
            <a-select-option
              v-if="
                analysisTypeId == 1 ||
                (analysisTypeId == 2 && item.rankTypeId != 4)
              "
              :key="item.rankTypeId"
              :value="item.rankTypeId"
            >
              {{ item.rankTypeName }}
            </a-select-option>
          </template>
        </a-select>

        <div v-if="analysisTypeId == 1">
          <a-month-picker
            v-model="monthDate"
            v-if="rankTypeId == '1'"
            placeholder="选择月份"
            :disabled-date="disabledDate"
          />
          <QuarterPick
            v-else-if="rankTypeId == '2'"
            v-model="quarterDate"
            :minDate="quarterList[0].toString()"
            :maxDate="quarterList[quarterList.length - 1].toString()"
          ></QuarterPick>
          <a-select
            v-else-if="rankTypeId == '3'"
            style="width: 160px"
            placeholder="选择年份"
            v-model="yearDate"
          >
            <a-select-option v-for="item in yearList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
          <MonthPicker
            v-if="rankTypeId == '4'"
            :values="monthPickerList"
            :maxMonth="maxMonth"
            :minMonth="minMonth"
            @change="monthPickerChange"
          ></MonthPicker>
        </div>
        <!-- 明细数据部门 -->
        <a-select
          v-model="deptId"
          v-if="activeTabs == 2"
          style="width: 160px"
          placeholder="选择部门"
        >
          <a-select-option
            v-for="item in departmentList"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <!-- 榜单部门 -->
        <a-select
          v-model="deptId"
          v-if="activeTabs == 1"
          style="width: 160px"
          placeholder="选择部门"
        >
          <a-select-option value=""> 全部 </a-select-option>
          <a-select-option
            v-for="item in rankDepartmentList"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <!-- <a-select
          v-model="quotaValues"
          style="width: 185px"
          v-if="activeTabs == 1 && analysisTypeId == 1"
          mode="tags"
          :max-tag-count="1"
          placeholder="选择维度"
        >
          <a-select-option
            v-for="(item, index) in quotaList"
            :key="index"
            :value="item.indexId"
            >{{ item.indexName }}</a-select-option
          > -->
        <!-- </a-select> -->
        <quota
          v-if="analysisTypeId == 2"
          :options="indexDataCpmputed"
          placeholder="监测指标"
          :values="subIndexId"
          @onConfirm="onConfirm"
          :max="1"
        ></quota>
        <!-- <a-select
          class="select-underline"
          v-model="subIndexId"
          style="width: 160px"
          v-if="analysisTypeId == 2"
        >
          <a-select-option
            v-for="(item, index) in quotaList"
            :key="index"
            :value="item.indexId"
            >{{ item.indexName }}</a-select-option
          >
        </a-select> -->
      </div>
      <div>
        <a-button @click="resetSearch"> 重置 </a-button>
        <a-button
          type="primary"
          @click="
            () => {
              resetSorter();
              current = 1;
              search();
            }
          "
        >
          查询
        </a-button>
      </div>
    </div>

    <div class="rank" v-if="analysisTypeId == 2">
      <!-- <a-table
        :columns="rankChangeColumns"
        :data-source="rankChangeDataInit"
        :scroll="{ x: 'max-content' }"
        :pagination="false"
      >
      </a-table>

      <div class="more-btn" @click="toogleShowMore">
        <div v-if="showTopTen">
          <span>更多</span>
          <a-icon type="down"></a-icon>
        </div>

        <div v-else>
          <span>收起</span>
          <a-icon type="up"></a-icon>
        </div> -->
      <!-- </div> -->
      <RankChangeTable
        :data-source="rankChangeData"
        :rankTypeId="rankTypeId"
        :title="RankChangeTableTitle"
        :loading="loading"
      ></RankChangeTable>
    </div>

    <div class="rank" v-else>
      <a-tabs type="card" v-model="activeTabs" @change="activeTabsChange">
        <a-tab-pane :key="1" tab="榜单">
          <RankDataTable
            ref="rankDateTable"
            :dataSource="rankData.list"
            :pagination="{
              pageSize: 11,
              total: rankData.total || 1,
              hideOnSinglePage: true,
              current,
            }"
            :columns="RankDataColumn"
            :filtersHeader="filtrateRankTableHeader"
            :type="dataType"
            @change="pageChange"
            rowKey="name"
            :loading="loading"
          ></RankDataTable>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="明细数据">
          <DetailedDataTable
            ref="detailedDataTable"
            :data-source="detailData.list"
            @change="pageChange"
            :columns="detailDataColumns"
            :pagination="{
              pageSize: 10,
              total: detailData.total || 1,
              hideOnSinglePage: true,
              current,
            }"
            rowKey="resourceId"
            :loading="loading"
          ></DetailedDataTable>
        </a-tab-pane>
        <span v-if="activeTabs === 1" slot="tabBarExtraContent">
          <!-- <span class="type-box" style="margin-right: 10px">
            <span
              class="type-data"
              :class="{ 'type-heightlight': rankType == 0 }"
              @click="rankTypeChange(0)"
              >总体</span
            >
            <span
              class="type-data"
              :class="{
                'type-heightlight': rankType == 1,
                'type-disable': indicatorShow != 4,
              }"
              @click="rankTypeChange(1)"
              >按项目</span
            >
          </span> -->
          <span class="type-box">
            <span
              class="type-data"
              :class="{ 'type-heightlight': dataType == 'cost' }"
              @click="dataTypeChange('cost', 3, 1)"
              >投放成本</span
            >
            <span
              v-if="userAuth.roleId == 1"
              class="type-data"
              :class="{
                'type-heightlight': dataType == 'order',
                'type-disable': rankType == 1,
              }"
              @click="dataTypeChange('order', 2, 2)"
              >投放量级</span
            >
            <!-- <span
              class="type-data"
              :class="{
                'type-heightlight': dataType == 'conversion',
                'type-disable': rankType == 1,
              }"
              @click="dataTypeChange('conversion', 5, 3)"
              >转化率</span
            > -->
          </span>
        </span>
        <span
          slot="tabBarExtraContent"
          v-if="activeTabs === 2 && userAuth.downloadRoot"
        >
          <DownLoadData :url="downLoadUrl"></DownLoadData>
        </span>
      </a-tabs>

      <!-- <Hint
        class="hint"
        title="钻石规则说明"
        :content="rankType == 1 ? projectExplain : overallExplain"
      >
        钻石规则说明<a-icon type="question-circle" style="margin-left: 5px" />
      </Hint> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Hint from "@/components/HintTips/HintTips.vue";
import DetailedDataTable from "@/components/DetailedDataTable/DetailedDataTable.vue";
import QuarterPick from "@/components/QuarterPick/QuarterPick.vue";
import moment from "moment";
import MonthPicker from "@/components/MonthPicker";
import quota from "@/components/QuotaComponent";
import RankDataTable from "@/components/RankDataTable/RankDataTable.vue";
import DownLoadData from "@/components/DownLoadData/DownLoadData.vue";
import RankChangeTable from "@/components/RankChangeTable/RankChangeTable.vue";
const projectExplain = " <p>各部门钻石数量表示：该部门获取钻石的项目个数</p> ";
const overallExplain = `<p>1、产品中心、乘用车品牌及公关事业部：指标排名TOP1部门（排名范围：在所选事业部下排名），获取钻石；</p>
        <p>2、王朝网销售事业部、e网销售事业部：指标排名TOP2部门（排名范围：在所选事业部下排名），获取钻石。</p>`;
const unitMap = {
  2: "万次",
  3: "元",
  4: "万次",
  5: "",
  6: "元",
  7: "个",
  8: "",
  9: "元",
  10: "个",
  11: "",
  12: "元",
  13: "个",
  15: "元",
};
const userRole = ["1", "2"];
export default {
  name: "DepartmentRank",
  components: {
    // Hint,
    DetailedDataTable,
    QuarterPick,
    MonthPicker,
    RankDataTable,
    DownLoadData,
    quota,
    RankChangeTable,
  },
  computed: {
    ...mapState({
      analysisTypeList: (state) => state.departmentRank.analysisTypeList, // 分析维度列表
      rankTypeList: (state) => state.departmentRank.rankTypeList, // 排行类型
      departmentList: (state) => state.departmentRank.departmentList, // 部门列表
      campaignList: (state) => state.departmentRank.campaignList, // 品牌类型
      quotaList: (state) => state.departmentRank.quotaList, // 指标数组
      yearList: (state) => state.departmentRank.yearList, // 年份数组
      monthList: (state) => state.departmentRank.monthList, // 月份数组
      quarterList: (state) => state.departmentRank.quarterList, // 季度数组
      rankData: (state) => state.departmentRank.rankData, // 榜单数据
      rankChangeData: (state) => state.departmentRank.rankChangeData, // 排名变化数据
      detailData: (state) => state.departmentRank.detailData, // 明细数据
      subIndex: (state) => state.departmentRank.subIndex, // 指标id
      loading: (state) => state.departmentRank.loading, // 请求数据加载状态
      rankDepartmentList: (state) => state.departmentRank.rankDepartmentList, // 榜单部门数据
      userAuth: (state) => state.userAuth, // 角色权限字段
    }),
    // rankChangeDataInit() {
    //   const { rankChangeData, showTopTen } = this;
    //   if (rankChangeData.list.length < 10) {
    //     return rankChangeData.list;
    //   }

    //   if (showTopTen) {
    //     return rankChangeData.list.slice(0, 10);
    //   } else {
    //     return rankChangeData.list;
    //   }
    // },
    // 加入榜单table的表头
    RankDataColumn() {
      const lis = [
        {
          dataIndex: "name",
          key: "name",
          title: "部门",
          align: "center",
          fixed: "left",
          width: 150,
        },
      ];
      if (this.tableShowCost) {
        lis.push({
          title: "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          sorterId: "1",
          sorter: true,
          width: 150,
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
    // 加入明细数据table的表头
    detailDataColumns() {
      const lis = [
        {
          dataIndex: "parentName",
          key: "parentName",
          title: "事业部",
          align: "center",
          fixed: "left",
          width: 150,
        },
        {
          dataIndex: "name",
          key: "name",
          title: "投放部门",
          fixed: "left",
          width: 150,
          align: "center",
        },
        {
          title: "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          align: "center",
          fixed: "left",
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
        },
      ];
      // if (this.tableShowCost) {
      //   lis.push({
      //     title: "花费（万元）",
      //     key: "totalCost",
      //     dataIndex: "totalCost",
      //     align: "center",
      //     fixed: "left",
      //     sorterId: "1",
      //     sorter: true,
      //     width: 150,
      //     sortOrder:
      //       this.orderIndexId == 1 && this.ordervalue == 1
      //         ? "ascend"
      //         : this.orderIndexId == 1 && this.ordervalue == 0
      //         ? "descend"
      //         : "",
      //     scopedSlots: {
      //       customRender: "customCell",
      //     },
      //   });
      // }

      return lis;
    },
    // 表格是否显示花费字段
    tableShowCost() {
      return userRole.includes(this.userAuth.roleId);
    },
    // 最大可选月份
    maxMonth() {
      return moment(this.monthList[this.monthList.length - 1]).format("YYYYMM");
    },
    // 最小可选月份
    minMonth() {
      return moment(this.monthList[0]).format("YYYYMM");
    },
    // 下载数据url
    downLoadUrl() {
      return `/web-api/web/exportDeptDataDetailList?rankTypeId=${
        this.rankTypeId
      }&time=${this.timer()}&deptId=${this.deptId}
      &indexId=${this.quotaValues}&orderIndexId=${
        this.orderIndexId
      }&ordervalue=${this.ordervalue}`;
    },
    // 检测指标
    indexDataCpmputed() {
      let lis = [];
      this.subIndex.forEach((item) => {
        let list = [];
        if (item.list && item.list.length) {
          item.list.forEach((item) => {
            list.push({
              indexId: item.indexId,
              id: item.subIndexId,
              name: item.subIndexName,
            });
          });
        }
        lis.push({
          name: item.indexName,
          id: item.indexId,
          children: list,
        });
      });
      return lis;
    },
  },
  data() {
    return {
      projectExplain, // 项目获取钻石说明
      overallExplain, // 总体获取钻石说明
      indicatorShow: "1", // 控制按钻石，按项目显示数据
      subIndexId: [{ id: "2", name: "PV维度", parentId: "2" }], // 监测指标数组
      analysisTypeId: "1", // 分析指标类型
      rankTypeId: "4", // 排行类型
      deptId: "13", // 部门id
      monthDate: undefined, // 单月份时间选择
      quarterDate: undefined, // 季度时间选择
      yearDate: undefined, // 年度时间选择
      quotaValues: [], // 维度选择
      // rankBtnType: 1,
      activeTabs: 1, // tabs 焦点
      // type: 1,
      RankChangeTableTitle: "PV维度(万次)",
      // rankChangeColumns: [
      //   {
      //     dataIndex: "key",
      //     key: "key",
      //     title: "PV",
      //     align: "center",
      //     customRender: (text, record, index) => {
      //       return <span>No.{index + 1}</span>;
      //     },
      //   },
      // ],
      // showTopTen: true,
      monthPickerList: [], // 月份区间选择
      rankType: 0, // 0:总体 1项目
      dataType: "cost", // 显示数据类型  (diamond钻石  numerical数值  旧)  cost投放成本 order量级  conversion转化率
      orderIndexId: "", // 排序id
      ordervalue: "", // 排序:0(降序)，1(升序)
      filtrateRankTableHeader: [], // 筛选ranktable头部
      analyseId: 1, // 表头属性id:投放成本1,投放量级2,转化率3
      current: 1,
    };
  },
  mounted() {
    this.getDeptCurrentRankType(),
      this.getDeptDayMonthEndRankType(),
      this.getDeptCampaignData(),
      this.getDeptIndexData(),
      this.getDeptYearDate(),
      this.getDeptQuarterDate(),
      this.getIndexSubIndexData(),
      this.getDeptForLeaderDeptData();
    Promise.all([
      this.getDeptMonthDate(),
      this.getDeptYearDate(),
      this.getDeptForDeptData(),
    ]).then(() => {
      this.monthPickerList = [
        moment(this.monthList[this.monthList.length - 1]).format("YYYYMM"),
        moment(this.monthList[this.monthList.length - 1]).format("YYYYMM"),
      ];
      this.search();
    });
    // await this.getDeptCurrentRankType();
    // await this.getDeptDayMonthEndRankType();
    // await this.getDeptForDeptData();
    // await this.getDeptCampaignData();
    // await this.getDeptIndexData();
    // await this.getDeptYearDate();
    // await this.getDeptMonthDate();
    // await this.getDeptQuarterDate();
    // await this.getIndexSubIndexData();
    this.getDeptRankDataChangeList({
      rankTypeId: "1",
      deptId: "13",
      subIndexId: this.subIndexId.map((item) => item.id).toString(),
    });
  },
  methods: {
    ...mapActions("departmentRank", [
      "getDeptCurrentRankType",
      "getDeptDayMonthEndRankType",
      "getDeptForDeptData",
      "getDeptCampaignData",
      "getDeptIndexData",
      "getDeptYearDate",
      "getDeptMonthDate",
      "getDeptQuarterDate",
      "getDeptRankDataDetailList",
      "getDeptRankDataChangeList",
      "getDeptRankOverallDataList",
      "getDeptRankProjectDataList",
      "getIndexSubIndexData",
      "getDeptForLeaderDeptData",
    ]),
    // 表头筛选
    unit(name, id) {
      const unit = unitMap[id];
      const str = unit ? `${name}(${unit})` : `${name}`;
      return str;
    },
    // 禁选月份
    disabledDate(current) {
      const { monthList } = this;
      const startMonth = monthList[0];
      const endMonth = monthList[1];
      return (
        (current && current < moment(startMonth)) ||
        current > moment(endMonth).add(30, "days")
      );
    },
    // tabs改变
    activeTabsChange() {
      this.orderIndexId = this.ordervalue = "";
      if (this.activeTabs == 2)
        for (let index = 0; index < this.departmentList.length; index++) {
          if (this.deptId == this.departmentList[index].deptId) {
            break;
          }
          if (index + 1 == this.departmentList.length) {
            this.deptId = this.departmentList[0].deptId;
          }
        }
      this.search(1);
    },
    // 表格页码改变
    pageChange(obj) {
      this.orderIndexId = obj.orderIndexId;
      this.ordervalue = obj.ordervalue;
      this.current = obj.current;
      this.search(obj.current);
    },
    // 重置选项
    resetSearch() {
      this.analysisTypeId = "1";
      this.defaultState();
    },
    defaultState() {
      if (this.activeTabs == 1) {
        this.deptId = "13";
      } else {
        this.deptId = this.rankDepartmentList[0].deptId;
      }
      if (this.analysisTypeId == 1) {
        this.rankTypeId = "4";
      } else {
        this.rankTypeId = "1";
      }
      this.monthDate = moment(this.monthList[1]);
      this.quarterDate = String(this.quarterList[this.quarterList.length - 1]);
      this.yearDate = this.yearList[this.yearList.length - 1];
      this.monthPickerList = [
        moment(this.monthList[this.monthList.length - 1]).format("YYYYMM"),
        moment(this.monthList[this.monthList.length - 1]).format("YYYYMM"),
      ];

      this.quotaValues = [];
      this.rankBtnType = 1;
      this.activeTabs = 1;
      this.rankType = 0;
      this.subIndexId = [{ id: "2", name: "PV维度", parentId: "2" }];
    },
    // 用于搜索的时间筛选
    timer() {
      if (this.rankTypeId == 1) {
        return moment(this.monthDate).format("YYYYMM");
      }
      if (this.rankTypeId == 2) {
        return this.quarterDate;
      }
      if (this.rankTypeId == 3) {
        return this.yearDate;
      }
      if (this.rankTypeId == 4) {
        return this.monthPickerList.join(",");
      }
    },
    // 搜索
    search(page) {
      const {
        analysisTypeId,
        rankTypeId = "",
        deptId,
        quotaValues,
        activeTabs,
        orderIndexId,
        ordervalue,
        subIndexId,
        analyseId,
      } = this;
      const obj = {
        rankTypeId,
        time: this.timer(),
        indexId: quotaValues.join(","),
        deptId,
        currentPage: page || 1,
        pageSize: 10,
        orderIndexId,
        ordervalue,
        analyseId,
      };
      if (rankTypeId != 4) {
        this.rankType = 0;
      }
      this.indicatorShow = rankTypeId;
      this.filtrateRankTableHeader = quotaValues;
      if (analysisTypeId == 2) {
        this.RankChangeTableTitle = this.unit(
          subIndexId.map((item) => item.name).toString(),
          subIndexId.map((item) => item.id).toString()
        );
        this.getDeptRankDataChangeList({
          rankTypeId,
          deptId,
          subIndexId: subIndexId.map((item) => item.id).toString(),
        });
      } else {
        if (activeTabs === 1) {
          if (this.rankType) {
            this.getDeptRankProjectDataList(obj);
          } else {
            this.getDeptRankOverallDataList(obj);
          }
        } else {
          this.getDeptRankDataDetailList(obj);
        }
      }
    },
    // 分析类型改变
    analysisChange(value) {
      const defaultObj = {
        analyseId: 1,
        rankTypeId: "1",
        time: moment(this.monthList[1]).format("YYYYMM"),
        deptId: "13",
        indexId: this.quotaValues.join(","),
        currentPage: 1,
        pageSize: 10,
        orderIndexId: "",
        ordervalue: "",
        subIndexId: this.subIndexId.map((item) => item.id).toString(),
      };
      this.dataType = "cost";
      this.rankType = 0;
      this.defaultState();
      if (value == 1) {
        this.getDeptRankOverallDataList(defaultObj);
        this.getDeptRankDataDetailList({ ...defaultObj, subIndexId: "" });
      } else {
        this.getDeptRankDataChangeList({
          rankTypeId: defaultObj.rankTypeId,
          deptId: defaultObj.deptId,
          subIndexId: defaultObj.subIndexId,
        });
      }
    },
    // toogleShowMore() {
    //   this.showTopTen = !this.showTopTen;
    // },
    // 榜单类型改变
    rankTypeChange(num) {
      if (this.indicatorShow != 4) {
        return;
      }
      this.rankType = num;
      const {
        analysisTypeId,
        rankTypeId = "",
        deptId,
        quotaValues,
        activeTabs,
        orderIndexId,
        ordervalue,
      } = this;
      this.filtrateRankTableHeader = quotaValues;
      const obj = {
        rankTypeId,
        time: this.timer(),
        indexId: quotaValues.join(","),
        deptId,
        currentPage: this.rankData.currentPage || 1,
        pageSize: 10,
        orderIndexId,
        ordervalue,
      };
      this.resetSorter();
      if (num) {
        this.dataType = "cost";
        this.getDeptRankProjectDataList(obj);
      } else {
        this.getDeptRankOverallDataList(obj);
      }
    },
    // 投放成本，投放量级，转化率改变
    dataTypeChange(type, sorterId, analyseId = 1) {
      if (this.rankType) return;
      this.dataType = type;
      this.orderIndexId = sorterId;
      this.ordervalue = "";
      this.analyseId = analyseId;

      this.search(1);
    },
    // rankTypeIdChange(value) {
    //   if (value != 4) {
    //     this.rankType = 0;
    //   }
    // },
    // 重置排序
    resetSorter() {
      this.orderIndexId = "";
      this.ordervalue = "";
      if (this.$refs.rankDateTable)
        this.$refs.rankDateTable.$emit("clearSorter");
      if (this.$refs.detailedDataTable)
        this.$refs.detailedDataTable.$emit("clearSorter");
    },
    // 检测指标改变
    onConfirm(val) {
      this.subIndexId = val;
    },
    // 月份选择
    monthPickerChange(value) {
      this.monthPickerList = value;
    },
  },
  watch: {
    monthList(newVal) {
      this.monthDate = moment(newVal[1]);
    },
    quarterList(newVal) {
      this.quarterDate = String(newVal[newVal.length - 1]);
    },
    yearList(newVal) {
      this.yearDate = newVal[newVal.length - 1];
    },
  },
};
</script>

<style lang="less" scoped>
.rank {
  position: relative;
  margin-top: 20px;

  .hint {
    position: absolute;
    top: 7px;
    left: 246px;
  }

  .rank-btn-ctn {
    .rank-btn {
      color: #d9d9d9;
      cursor: pointer;
      &.selected {
        color: #000000;
      }
    }
  }

  .more-btn {
    margin: 10px auto;
    width: 100px;
    text-align: center;
    color: #8d8e99;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      opacity: 0.6;
    }
  }
}
.changePro {
  right: 200px;
}

.type-box {
  display: inline-block;
}
.type-data {
  display: inline-block;
  border: 1px solid #d9d9d9;
  width: 77px;
  height: 32px;
  line-height: 32px;
  color: #212121;
  cursor: pointer;
  text-align: center;
}
.type-heightlight {
  border-color: #0073c6;
  background-color: #0073c6;
  color: white;
}
.type-disable {
  cursor: not-allowed;
}
</style>
