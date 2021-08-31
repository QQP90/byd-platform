<template>
  <div>
    <!-- 筛选区域 -->
    <div class="search-box project">
      <div>
        <!-- 项目 -->
        <a-select
          v-model="projectId"
          style="width: 160px"
          placeholder="选择项目"
          :maxTagCount="1"
        >
          <a-select-option
            v-for="item in projectList.list"
            :key="item.campaignId"
            :value="item.campaignId"
          >
            {{ item.campaignName }}
          </a-select-option>
        </a-select>

        <!-- 时间选择 -->
        <a-range-picker
          v-model="rangeTime"
          :disabledDate="disabledDate"
          :showToday="false"
          style="width: 230px"
        >
        </a-range-picker>

        <!-- 时间类型 -->
        <a-select
          v-model="timeTypeId"
          style="width: 160px"
          placeholder="时间类型"
        >
          <a-select-option
            v-for="item in dateTypeList"
            :key="item.timeType"
            :value="item.timeType"
          >
            {{ item.timeName }}
          </a-select-option>
        </a-select>

        <!-- 区域类型 -->
        <a-select
          style="width: 160px"
          placeholder="按省份"
          v-model="areaIds"
          @change="changeArea"
          v-if="currentTabs == 4"
        >
          <a-select-option
            v-for="item in area"
            :key="item.areaType"
            :value="item.areaType"
            >{{ item.areaName }}</a-select-option
          >
        </a-select>

        <!-- 区域列表 -->
        <a-select
          style="width: 160px"
          placeholder="省份"
          v-model="provinceIds"
          v-if="currentTabs == 4 && areaIds != '2'"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="(item, index) in provinces"
            :key="index"
            :value="item.id"
            >{{ item.name }}
          </a-select-option>
        </a-select>
        <QuotaComponent
          v-if="currentTabs == 4 && areaIds == '2'"
          placeholder="区域"
          :options="areaList"
          :values="areaValues"
          @onConfirm="areaQuotaConfirm"
          :selectAll="true"
        ></QuotaComponent>
        <QuotaComponent
          v-if="currentTabs != 2 && currentTabs != 3"
          placeholder="检测指标"
          :options="quotaList"
          :values="quotaValues"
          @onConfirm="quotaConfirm"
          :selectAll="true"
        ></QuotaComponent>
        <!-- 检测指标 -->
      </div>

      <!-- 查询按钮 -->
      <div>
        <a-button @click="resetSearch"> 重置 </a-button>
        <a-button type="primary" @click="search()"> 查询 </a-button>
      </div>
    </div>

    <div class="insight-bottom">
      <a-tabs v-model="currentTabs" @change="tabsChange">
        <a-tab-pane
          v-for="item in insightTabsList"
          :key="item.id"
          :tab="item.name"
        >
        </a-tab-pane>
      </a-tabs>

      <!-- 关键指标 -->
      <keyQuota
        v-if="currentTabs === 1"
        ref="keyQuota"
        :quotaValues="quotaValues"
        @pageChange="keyQuotaPageChange"
      ></keyQuota>
      <!-- 到达分析 -->
      <arriveAnalyse
        v-if="currentTabs === 2"
        :params="{
          projectId,
          timeTypeId,
          rangeTime,
        }"
      ></arriveAnalyse>
      <time-period-analysis v-if="currentTabs === 3"></time-period-analysis>
      <regional-analysis
        :columnsTitle="columnsTitle"
        v-if="currentTabs === 4"
        ref="regionalAnalysis"
        @changeRegionalAnalysis="saveRegionalAnalysis"
        :dataSource="areaAnalysis.dataSource"
        :total="areaAnalysis.total"
        :areaType="areaType"
      ></regional-analysis>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import moment from "moment";
import areaAnalysisApi from "@/service/project/areaAnalysis";
import QuotaComponent from "@/components/QuotaComponent";
import keyQuota from "./projectInsight/keyQuota.vue";
import arriveAnalyse from "./projectInsight/arriveAnalyse.vue";
import TimePeriodAnalysis from "./projectInsight/timePeriodAnalysis.vue";
import RegionalAnalysis from "./projectInsight/regionalAnalysis.vue";

const defaultQuotaValues = [
  { id: "2", name: "PV", parentId: "2", selected: false },
  { id: "5", name: "UV", parentId: "3", selected: false },
  { id: "8", name: "线索量", parentId: "4", selected: false },
  { id: "9", name: "有效线索量", parentId: "5", selected: false },
  { id: "12", name: "成交量", parentId: "6", selected: false },
];

const keyQuotaDownloadUrl = "/web-api/web/downloadCampaignKeyIndexData";
const downloadRegionalAnalysisData =
  "/web-api/web/downloadRegionalAnalysisData";

export default {
  name: "projectInsight",
  data() {
    return {
      projectId: "",
      timeTypeId: "1",
      rangeTime: [],
      quotaValues: defaultQuotaValues,
      currentTabs: 1,
      columnsTitle: [],
      areaIds: "1", //省份
      areaType: "0", //切换表头
      areaList: [], //区域列表
      areaValues: [], //选中区域
      provinceIds: [], //选中省份ids
      area: [], //省区切换
      provinces: [],
      areaAnalysis: {
        //区域分析参数
        dataSource: [],
        currentPage: 1,
        pageSize: 10,
        orderIndexId: "",
        orderValue: 0,
        total: 0,
        pagination: {
          hideOnSinglePage: true,
        },
      },
      orderValue: 0,
      orderIndexId: "",
    };
  },
  computed: {
    ...mapState("projectInsight", [
      "dateList",
      "projectList",
      "dateTypeList",
      "quotaList",
    ]),
    insightTabsList() {
      return [
        {
          name: "关键指标",
          id: 1,
        },
        // {
        //   name: "到达分析",
        //   id: 2,
        // },
        // {
        //   name: "时段分析",
        //   id: 3,
        // },
        {
          name: "区域分析",
          id: 4,
        },
      ];
    },
  },
  methods: {
    ...mapActions("projectInsight", [
      "getCampaignKeyIndexTimeData",
      "getCampaignKeyIndexProjectList",
      "getCampaignKeyIndexTimePeriod",
      "getCampaignKeyIndexSubIndexData",
      "getCampaignKeyIndexDataList",
    ]),
    ...mapMutations("projectInsight", [
      "SET_KEY_QUOTA_TABLE_LOADING",
      "SET_KEY_QUOTA_CHART_LOADING",
    ]),
    disabledDate(current) {
      const { dateList } = this;
      return (
        current < moment(dateList.startTime) ||
        current > moment(dateList.endTime)
      );
    },
    quotaConfirm(values) {
      this.quotaValues = values;
    },
    saveRegionalAnalysis(val) {
      this.areaAnalysis.currentPage = val.current;
      this.areaAnalysis.orderIndexId = val.orderIndex;
      this.areaAnalysis.orderValue = val.orderValue;
      this.search();
    },
    resetSearch() {
      const rangeTime = [
        moment(this.dateList.endTime).subtract(1, "month"),
        moment(this.dateList.endTime),
      ];
      this.projectId = this.projectList.firstImp
        ? this.projectList.firstImp.campaignId
        : "";
      this.timeTypeId = "1";
      this.rangeTime = rangeTime;
      this.quotaValues = defaultQuotaValues;
      this.areaValues = [];
      this.areaIds = "1";
    },
    search(page) {
      const {
        projectId,
        timeTypeId,
        rangeTime,
        quotaValues,
        orderValue,
        orderIndexId,
        currentTabs,
      } = this;
      const time = `${rangeTime[0].format("YYYY-MM-DD")},${rangeTime[1].format(
        "YYYY-MM-DD"
      )}`;

      const subIndexId = quotaValues.map((item) => item.id);

      if (currentTabs === 1) {
        this.SET_KEY_QUOTA_TABLE_LOADING(true);
        if (!page) {
          this.SET_KEY_QUOTA_CHART_LOADING(true);
        }

        this.getCampaignKeyIndexDataList({
          campaignId: projectId,
          time,
          timePeriod: timeTypeId,
          subIndexId: subIndexId.join(","),
          orderIndexId,
          orderValue,
          currentPage: page || 1,
          pageSize: 10,
        });
      }
      if (currentTabs === 4) {
        this.columnsTitle = this.quotaValues;
        this.areaType = this.areaIds;
        this.$nextTick(() => {
          this.$refs.regionalAnalysis.loading = true;
        });

        const time = `${rangeTime[0].format(
          "YYYY-MM-DD"
        )},${rangeTime[1].format("YYYY-MM-DD")}`;
        const subIndexId = quotaValues.map((item) => item.id);
        let obj = {
          campaignId: projectId,
          time,
          timePeriod: timeTypeId,
          areaType: this.areaIds,
          provinceId: this.provinceIds.join(","),
          cityId: this.areaValues.map((v) => v.id).join(","),
          subIndexId: subIndexId.join(","),
          currentPage: this.areaAnalysis.currentPage,
          pageSize: 10,
          orderIndexId: this.areaAnalysis.orderIndexId,
          orderValue: this.areaAnalysis.orderValue,
        };
        if (obj.cityId) {
          obj.provinceId = "";
        }
        areaAnalysisApi
          .getRegionalAnalysisDataList(obj)
          .then((res) => {
            this.areaAnalysis.dataSource = res.data.list;
            this.areaAnalysis.total = res.data.total;
            this.$nextTick(() => {
              this.$refs.regionalAnalysis.loading = false;
            });
          })
          .catch((e) => {
            this.areaAnalysis.dataSource = [];
            this.areaAnalysis.total = 0;
            this.$nextTick(() => {
              this.$refs.regionalAnalysis.loading = false;
            });
          });
      }
    },
    keyQuotaPageChange(params) {
      const { current, orderIndexId, orderValue } = params;
      this.orderValue = orderValue;
      this.orderIndexId = orderIndexId;
      this.search(current);
    },
    tabsChange(current) {
      const { projectId } = this;
      if (projectId) {
        this.search();
      }
    },
    projectDownload() {
      const {
        projectId,
        timeTypeId,
        rangeTime,
        quotaValues,
        orderValue,
        orderIndexId,
        currentTabs,
      } = this;
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      const token = localStorage.getItem("token");
      const time = `${rangeTime[0].format("YYYY-MM-DD")},${rangeTime[1].format(
        "YYYY-MM-DD"
      )}`;
      const subIndexId = quotaValues.map((item) => item.id);

      let downloadUrl;

      if (currentTabs === 1) {
        downloadUrl = `${baseApiUrl}${keyQuotaDownloadUrl}?campaignId=${projectId}&time=${time}&timePeriod=${timeTypeId}&subIndexId=${subIndexId.join(
          ","
        )}&orderIndexId=${orderIndexId}&orderValue=${orderValue}&authorization=${token}`;
      }

      if (currentTabs === 4) {
        let cityId = this.areaValues.map((v) => v.id).join(",");
        downloadUrl = `${baseApiUrl}${downloadRegionalAnalysisData}?campaignId=${projectId}&time=${time}&timePeriod=${timeTypeId}&areaType=${
          this.areaIds
        }&province=${this.provinceIds.join(
          ","
        )}&cityId=${cityId}&subIndexId=${subIndexId.join(",")}&orderIndexId=${
          this.areaAnalysis.orderIndexId
        }&orderValue=${this.areaAnalysis.orderValue}&authorization=${token}`;
      }

      if (downloadUrl) {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Chrome") > -1) {
          window.open(downloadUrl, "_blank");
        } else {
          window.location.href = downloadUrl;
        }
      }
    },
    // 区域分析
    async getAreaAnalysisApi() {
      await this.getProvinceAndCityData();
      await this.getRegionalAnalysisAreaData();
    },
    areaQuotaConfirm(values) {
      this.areaValues = values;
    },
    changeArea(val) {
      this.areaAnalysis.currentPage = 1;

      if (val == 2) {
        this.provinceIds = [];
      } else {
        this.areaValues = [];
      }
    },

    getProvinceAndCityData() {
      areaAnalysisApi.getProvinceAndCityData().then((res) => {
        let arr = [];
        res.data.forEach((el) => {
          let obj = {
            id: el.provinceId,
            name: el.provinceName,
          };
          if (el.list) {
            obj.children = el.list.map((v) => {
              let item = {
                id: v.cityId,
                name: v.cityName,
              };
              return item;
            });
          }
          arr.push(obj);
        });
        this.provinces = arr;
      });

      areaAnalysisApi.getProvinceAndCityData({ areaType: 2 }).then((res) => {
        let arr = [];
        res.data.forEach((el) => {
          let obj = {
            id: el.provinceId,
            name: el.provinceName,
          };
          if (el.list) {
            obj.children = el.list.map((v) => {
              let item = {
                id: v.cityId,
                name: v.cityName,
              };
              return item;
            });
          }
          arr.push(obj);
        });
        this.areaList = arr;
      });
    },

    // 按省份区域
    getRegionalAnalysisAreaData() {
      areaAnalysisApi.getRegionalAnalysisAreaData().then((res) => {
        this.area = res.data;
      });
    },
  },
  mounted() {
    this.getCampaignKeyIndexTimeData();
    this.getCampaignKeyIndexTimePeriod();
    this.getCampaignKeyIndexSubIndexData();
    this.getAreaAnalysisApi();
  },
  components: {
    QuotaComponent,
    keyQuota,
    arriveAnalyse,
    TimePeriodAnalysis,
    RegionalAnalysis,
  },
  watch: {
    projectList(newVal) {
      if (newVal) {
        this.projectId = newVal.firstImp ? newVal.firstImp.campaignId : "";
        this.search();
      }
    },
    dateList(newVal) {
      if (newVal) {
        const rangeTime = [
          moment(newVal.endTime).subtract(1, "month"),
          moment(newVal.endTime),
        ];

        this.rangeTime = rangeTime;

        const time = `${rangeTime[0].format(
          "YYYY-MM-DD"
        )},${rangeTime[1].format("YYYY-MM-DD")}`;

        this.getCampaignKeyIndexProjectList({
          time,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.insight-bottom {
  margin-top: 10px;
  user-select: none;

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
}

#app .insight-bottom {
  /deep/.ant-tabs-bar {
    .ant-tabs-tab {
      font-size: 12px;
      &.ant-tabs-tab-active {
        font-size: 14px;
      }
    }
  }

  /deep/ .ant-table-thead > tr > th {
    border: 0;
  }
}
</style>
