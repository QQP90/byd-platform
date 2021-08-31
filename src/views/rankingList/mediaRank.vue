<template>
  <div>
    <!-- 筛选区域 -->
    <div class="search-box ranking" style="flex-wrap: wrap">
      <div class="media-subject-ctn" style="width: 100%; flex-shrink: 0">
        <div
          class="subject-item"
          :class="
            analysisSubjectTypeId === item.analysisSubjectTypeId && 'selected'
          "
          v-for="item in analysisSubjectList"
          :key="item.analysisSubjectTypeId"
          @click="selectAnalysisSubject(item.analysisSubjectTypeId)"
        >
          {{ item.analysisSubjectTypeName }}
        </div>
      </div>

      <div>
        <!-- 筛选主体 -->
        <!-- <a-select v-model="analysisSubjectTypeId" style="width: 160px">
          <a-select-option
            v-for="item in analysisSubjectList"
            :key="item.analysisSubjectTypeId"
            :value="item.analysisSubjectTypeId"
          >
            {{ item.analysisSubjectTypeName }}
          </a-select-option>
        </a-select> -->

        <!-- 筛选类型 -->
        <a-select
          v-model="analysisTypeId"
          v-if="analysisSubjectTypeId == 1"
          @change="analysisChange"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in analysisTypeList"
            :key="item.rankTypeId"
            :value="item.rankTypeId"
          >
            {{ item.rankTypeName }}
          </a-select-option>
        </a-select>
        <!-- 媒体 -->
        <MediaComponent
          placeholder="媒体"
          :options="mediaList"
          v-model="mediaValues"
          @onConfirm="mediaConfirm"
          :mode="mediaMode"
          v-else
        ></MediaComponent>

        <!-- 榜单及当期表现的榜单 -->
        <a-select
          v-model="rankTypeId"
          style="width: 160px"
          placeholder="选择榜单"
          @change="rankTypeChange"
          v-if="analysisTypeId == 1"
        >
          <a-select-option
            v-for="item in rankTypeList"
            :key="item.rankTypeId"
            :value="item.rankTypeId"
          >
            {{ item.rankTypeName }}
          </a-select-option>
        </a-select>
        <!-- 排名变化的榜单 -->
        <a-select
          v-model="rankTypeId"
          style="width: 160px"
          placeholder="选择榜单"
          @change="rankTypeChange"
          v-if="analysisTypeId == 2"
        >
          <template v-for="item in rankTypeList">
            <a-select-option
              v-if="item.rankTypeId != 4"
              :key="item.rankTypeId"
              :value="item.rankTypeId"
            >
              {{ item.rankTypeName }}
            </a-select-option>
          </template>
        </a-select>

        <!-- 时间筛选组件 -->
        <div v-if="analysisTypeId == 1">
          <a-month-picker
            style="width: 160px"
            v-model="monthDate"
            v-if="rankTypeId === '1'"
            placeholder="选择月份"
            :disabled-date="disabledDate"
          />
          <QuarterPick
            v-else-if="rankTypeId === '2'"
            v-model="quarterDate"
            :minDate="quarterList[0]"
            :maxDate="quarterList[1]"
          ></QuarterPick>
          <a-select
            v-else-if="rankTypeId === '3'"
            style="width: 160px"
            placeholder="选择年份"
            v-model="yearDate"
          >
            <a-select-option v-for="item in yearList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>

          <MonthPicker
            v-if="rankTypeId === '4'"
            v-model="monthPickerList"
            :maxMonth="monthRange[1]"
            :minMonth="monthRange[0]"
          ></MonthPicker>
        </div>

        <!-- 项目类型 -->
        <a-select
          v-model="campaignTypeId"
          style="width: 170px"
          placeholder="选择类别"
          mode="multiple"
          :maxTagCount="1"
          v-if="
            (analysisSubjectTypeId == 1 && analysisTypeId == 2) ||
            (analysisSubjectTypeId == 1 && activeTabs == 1) ||
            (analysisSubjectTypeId == 1 && activeTabs == 4)
          "
        >
          <a-select-option
            v-for="item in campaignList"
            :key="item.campaignTypeId"
            :value="item.campaignTypeId"
          >
            {{ item.campaignName }}
          </a-select-option>
        </a-select>

        <!-- 检测指标 -->
        <QuotaComponent
          v-if="(analysisTypeId == 1 && activeTabs == 2) || analysisTypeId == 2"
          placeholder="检测指标"
          :options="quotaList"
          :values="quotaValues"
          @onConfirm="quotaConfirm"
          :max="analysisTypeId == 2 ? 1 : 6"
        ></QuotaComponent>

        <!-- 检测维度 -->
        <!-- <a-select
          v-model="dimensionId"
          style="width: 185px"
          placeholder="选择指标"
          mode="multiple"
          :maxTagCount="1"
          v-if="activeTabs == 1 && analysisTypeId != 2"
        >
          <a-select-option
            v-for="item in dimensionInitList"
            :key="item.indexId"
            :value="item.indexId"
          >
            {{ item.indexName }}
          </a-select-option>
        </a-select> -->
      </div>

      <!-- 查询按钮 -->
      <div>
        <a-button @click="resetSearch"> 重置 </a-button>
        <a-button type="primary" @click="search()"> 查询 </a-button>
      </div>
    </div>

    <!-- 排名变化 -->
    <div class="rank" v-if="analysisTypeId == 2 && analysisSubjectTypeId == 1">
      <RankChangeTable
        :data-source="rankChangeData"
        :rankTypeId="rankTypeId"
        :title="RankChangeTableTitle"
      ></RankChangeTable>
    </div>

    <!-- 榜单、单双指标、明细数据 -->
    <div class="rank" v-else ref="mediaRankWrapper">
      <a-tabs type="card" v-model="activeTabs" @change="tabsChange">
        <a-tab-pane :key="1" tab="榜单">
          <RankDataTable
            ref="rankDateTable"
            :dataSource="rankData.list"
            :pagination="{
              pageSize: 11,
              showSizeChanger: false,
              hideOnSinglePage: true,
              total: rankData.total || 1,
            }"
            :columns="rankColumns"
            :filtersHeader="filtrateRankTableHeader"
            :type="dataType"
            @change="pageChange"
            rowKey="index"
            :loading="rankTableLoading"
          ></RankDataTable>
        </a-tab-pane>
        <a-tab-pane
          :key="2"
          v-if="rankTypeId != '4' && analysisSubjectTypeId == '1'"
          tab="单指标"
        >
          <div class="quota-ctn">
            <div class="single-quota-ctn">
              <BarChartsSingle
                v-for="(item, index) in singleQuotaList"
                :key="`single-${index}`"
                :id="`single-${index}`"
                className="quota-wrap"
                :style="`width:${singleChartsWidth}px`"
                :title="item && unitTitle(item.title, item.id)"
                :optionObj="item && item.data"
                :categoryWidth="categoryWidth"
                @onChange="singleChange(...arguments, index)"
              ></BarChartsSingle>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          :key="3"
          v-if="rankTypeId != '4' && analysisSubjectTypeId == '1'"
          tab="双指标"
        >
          <div class="quota-ctn">
            <div class="double-quota-ctn">
              <BarChartsDouble
                v-for="(item, index) in doubleQuotaValues"
                className="quota-wrap"
                :key="`double-${index}`"
                :id="`double-${index}`"
                :optionObj="doubleQuotaList[index]"
                :quotaValues="item"
                :quotaOptions="quotaList"
                :categoryWidth="categoryWidth"
                @onChange="doubleChange(...arguments, index)"
              ></BarChartsDouble>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="4" tab="明细数据">
          <DetailedDataTable
            ref="detailTable"
            :data-source="detailData.list"
            @change="pageChange"
            :columns="detailDataColumns"
            :total="detailData.total"
            rowKey="key"
          ></DetailedDataTable>
        </a-tab-pane>
        <span v-if="activeTabs === 1" slot="tabBarExtraContent">
          <!-- <span class="type-box">
            <span
              class="type-data"
              :class="{ 'type-heightlight': dataType == 'diamond' }"
              @click="dataTypeChange('diamond')"
              >钻石</span
            >
            <span
              class="type-data"
              :class="{
                'type-heightlight': dataType == 'numerical',
                'type-disable': rankType == 1,
              }"
              @click="dataTypeChange('numerical')"
              >数值</span
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
          v-if="activeTabs === 4 && userAuth.downloadRoot"
        >
          <DownLoadData :url="downLoadUrl"></DownLoadData>
        </span>
      </a-tabs>
      <!-- <Hint
        class="hint"
        :style="`left:${hintLeft}px`"
        title="钻石规则说明"
        :content="diamondText"
      >
        钻石规则说明<a-icon type="question-circle" style="margin-left: 5px" />
      </Hint> -->
    </div>
  </div>
</template>

<script>

import { mapState, mapActions, mapMutations } from "vuex";
import Hint from "@/components/HintTips/HintTips.vue";
import DetailedDataTable from "@/components/DetailedDataTable/DetailedDataTable.vue";
import QuotaComponent from "@/components/QuotaComponent";
import QuarterPick from "@/components/QuarterPick/QuarterPick.vue";
import moment from "moment";
import MediaComponent from "@/components/MediaComponent/";
import BarChartsSingle from "@/components/BarChartsSingle/index.vue";
import BarChartsDouble from "@/components/BarChartsDouble/index.vue";
import RankDataTable from "@/components/RankDataTable/RankDataTable.vue";
import MonthPicker from "@/components/MonthPicker";
import DownLoadData from "@/components/DownLoadData/DownLoadData.vue";
import RankChangeTable from "@/components/RankChangeTable/RankChangeTable.vue";

const defaultSingleQuota = [
  // { name: "PV", id: "2", parentId: "2" },
  // { name: "PV成本", id: "3", parentId: "2" },
  // { name: "UV", id: "4", parentId: "3" },
  // { name: "点击率", id: "5", parentId: "3" },
  // { name: "UV成本", id: "6", parentId: "3" },
  { name: "线索成本", id: "9", parentId: "4" },
];

const defaultDoubleQuota = [
  [
    { name: "PV", id: "2", parentId: "2" },
    { name: "PV成本", id: "3", parentId: "2" },
  ],
  [
    { name: "UV", id: "4", parentId: "3" },
    { name: "点击率", id: "5", parentId: "3" },
  ],
  [
    { name: "线索量", id: "7", parentId: "4" },
    { name: "留资率", id: "8", parentId: "4" },
  ],
  [
    { name: "成交量", id: "13", parentId: "5" },
    { name: "成交率", id: "14", parentId: "5" },
  ],
];

const unitMap = {
  1: "万元",
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
const defaultCampaign = [];

const diamondText = ` <p>1、媒体：</p>
<p> ①当媒体数量≥7，指标排名TOP3（各指标下参与打榜的媒体数量）媒体获取钻石；</p>
<p>②当4≤媒体数量≤6，指标排名TOP2（各指标下参与打榜的媒体数量）媒体获取钻石；</p>
<p>③当1≤媒体数量≤3，指标排名TOP1（各指标下参与打榜的媒体数量）媒体获取钻石。</p>
<p>2、媒体-部门：</p>
<p>①当部门数量≥7，指标排名TOP3（各指标下参与打榜的部门数量）部门获取钻石；</p>
<p>②当4≤部门数量≤6，指标排名TOP2（各指标下参与打榜的部门数量）部门获取钻石；</p>
<p>③当1≤部门数量≤3，指标排名TOP1（各指标下参与打榜的部门数量）部门获取钻石。</p>
<p>3、媒体-项目：</p>
<p>①当项目数量≥7，指标排名TOP3（各指标下参与打榜的项目数量）项目获取钻石；</p>
<p>②当4≤项目数量≤6，指标排名TOP2（各指标下参与打榜的项目数量）项目获取钻石；</p>
<p>③当1≤项目数量≤3，指标排名TOP1（各指标下参与打榜的项目数量）项目获取钻石。</p>`;

const costAuthList = ["1", "2"];

export default {
  name: "MediaRank",
  components: {
    // Hint,
    DetailedDataTable,
    QuotaComponent,
    QuarterPick,
    MediaComponent,
    BarChartsSingle,
    BarChartsDouble,
    RankDataTable,
    MonthPicker,
    DownLoadData,
    RankChangeTable,
  },
  computed: {
    ...mapState("mediaRank", {
      analysisSubjectList: "analysisSubjectList",
      analysisTypeList: "analysisTypeList",
      rankTypeList: "rankTypeList",
      campaignList: "campaignList",
      quotaList: "quotaList",
      yearList: "yearList",
      monthList: "monthList",
      quarterList: "quarterList",
      rankChangeData: "rankChangeData",
      detailData: "detailData",
      mediaList: "mediaList",
      singleQuotaList: "singleQuotaList",
      doubleQuotaList: "doubleQuotaList",
      rankData: "rankData",
      dimensionList: "dimensionList",
      rankTableLoading: "rankTableLoading",
    }),
    ...mapState(["userAuth"]),
    rankChangeDataInit() {
      const { rankChangeData, showTopTen } = this;
      if (rankChangeData.list.length < 10) {
        return rankChangeData.list;
      }

      if (showTopTen) {
        return rankChangeData.list.slice(0, 10);
      } else {
        return rankChangeData.list;
      }
    },
    mediaMode() {
      // const { activeTabs } = this;
      // if (Number(activeTabs) === 4) {
      //   return "multiple";
      // } else {
      //   return "normal";
      // }

      return "normal";
    },
    monthRange() {
      const { monthList } = this;
      return [
        moment(monthList[0]).format("YYYYMM"),
        moment(monthList[1]).format("YYYYMM"),
      ];
    },
    dimensionInitList() {
      const { campaignTypeId, dimensionList } = this;

      if (campaignTypeId.toString() === "2") {
        return [dimensionList[0], dimensionList[1]];
      }
      return dimensionList;
    },
    downLoadUrl() {
      const {
        analysisSubjectTypeId,
        campaignTypeId,
        rankTypeId,
        mediaValues,
        dimensionId,
        orderIndexId,
        orderValue,
      } = this;

      const mediaIdList = mediaValues.map((item) => item.id);

      return `/web-api/web/exportMediaDataDetailList?analysisSubjectTypeId=${analysisSubjectTypeId}&campaignTypeId=${campaignTypeId.join(
        ","
      )}&rankTypeId=${rankTypeId}&time=${this.timer()}&mediaId=${mediaIdList.join(
        ","
      )}&indexId=${dimensionId.join(
        ","
      )}&orderIndexId=${orderIndexId}&orderValue=${orderValue}`;
    },
    hintLeft() {
      const { rankTypeId, analysisSubjectTypeId } = this;
      if (rankTypeId != "4" && analysisSubjectTypeId == "1") {
        return 462;
      } else {
        return 246;
      }
    },
  },
  data() {
    return {
      diamondText, // 获取钻石说明文案
      paneList: [
        {
          name: "榜单",
        },
        {
          name: "明细数据",
        },
      ],
      analysisSubjectTypeId: "3",
      analysisTypeId: "1",
      rankTypeId: "4",
      campaignTypeId: defaultCampaign,
      monthDate: undefined,
      quarterDate: undefined,
      yearDate: undefined,
      quotaValues: defaultSingleQuota,
      rankBtnType: 1,
      activeTabs: 1,
      mediaValues: [{ id: "3", name: "效果通" }],
      showTopTen: true,
      doubleQuotaValues: defaultDoubleQuota,
      detailDataColumns: [
        {
          dataIndex: "name",
          key: "name",
          title: "媒体",
          align: "center",
          fixed: "left",
          width: 150,
        },
      ],
      rankColumns: [
        {
          dataIndex: "name",
          key: "name",
          title: "媒体",
          align: "center",
          width: 150,
        },
      ],
      dimensionId: [],
      orderIndexId: "", // 排序id
      orderValue: "", // 排序:0(降序)，1(升序)
      rankType: 0, // 0:总体 1项目
      // dataType: "diamond", // 显示数据类型  diamond钻石  numerical数值
      dataType: "cost", // 显示数据类型  diamond钻石  numerical数值
      filtrateRankTableHeader: [], // 筛选ranktable头部
      RankChangeTableTitle: "PV维度",
      monthPickerList: [],
      singleTopN: ["10", "10", "10", "10", "10", "10"],
      doubleTopN: ["10", "10", "10", "10", "10", "10"],
      categoryWidth: 100,
      singleChartsWidth: (1435 - 30) / 3,
      rankTableTypeId: 1,
    };
  },
  mounted() {
    if (this.$refs.mediaRankWrapper.clientWidth > 1435) {
      this.singleChartsWidth =
        (this.$refs.mediaRankWrapper.clientWidth - 45) / 3;
    }

    this.setRankTableColumns();
    this.setDetailDataColumns();
    this.getMediaChangeRankType();
    this.getMediaChangeCurrentRankType();
    this.getMediaChangeMQYRankType();
    this.getMediaChangeCampaignData();
    this.getMediaChangeIndexData();
    this.getMedaiChangeYearDate();
    this.getMedaiChangeMonthDate();
    this.getMedaiChangeQuarterDate();
    this.getMediaMessage();
    this.getMediaIndexData();
  },
  methods: {
    ...mapActions("mediaRank", [
      "getMediaChangeRankType",
      "getMediaChangeCurrentRankType",
      "getMediaChangeMQYRankType",
      "getMediaChangeCampaignData",
      "getMediaChangeIndexData",
      "getMedaiChangeYearDate",
      "getMedaiChangeMonthDate",
      "getMedaiChangeQuarterDate",
      "getMediaMessage",
      "getMediaChangeRankDataList",
      "getMediaCurrentChangeDataList",
      "getMediaSingleQuotaCharts",
      "getMediaDoubleQuotaCharts",
      "getMediaInfoDetailList",
      "getMediaIndexData",
      "getMediaTopList",
    ]),
    ...mapMutations("mediaRank", [
      "SET_DEFAULT_SINGLE_QUOTA_LIST",
      "SET_RANK_LOADING",
      "SET_DETAIL_LOADING",
    ]),
    unitTitle(name, id) {
      const unit = unitMap[id];
      const str = unit ? `${name}(${unit})` : `${name}`;
      return str;
    },
    disabledDate(current) {
      const { monthList } = this;
      const startMonth = monthList[0];
      const endMonth = monthList[1];
      return (
        (current && current < moment(startMonth)) ||
        current > moment(endMonth).add(30, "days")
      );
    },
    quotaConfirm(values) {
      this.quotaValues = values;
    },
    mediaConfirm(values) {
      this.mediaValues = values;
    },
    pageChange(obj) {
      this.orderIndexId = obj.orderIndexId;
      this.orderValue = obj.ordervalue;
      this.search(obj.current);
    },
    resetSearch() {
      this.rankTypeId = "4";
      this.campaignTypeId = defaultCampaign;
      this.monthDate = moment(this.monthList[1]);
      this.quarterDate = this.quarterList[1];
      this.yearDate = this.yearList[this.yearList.length - 1];
      this.quotaValues = defaultSingleQuota;
      this.mediaValues = [{ id: "3", name: "效果通" }];
      this.dimensionId = [];
      this.monthPickerList = [
        (moment(this.monthList[0]).format("YYYYMM"),
        moment(this.monthList[1]).format("YYYYMM")),
      ];
      this.analysisSubjectTypeId = "3";

      this.search(1)
    },
    search(page) {
      const {
        analysisSubjectTypeId,
        analysisTypeId,
        rankTypeId = "",
        campaignTypeId,
        activeTabs,
        monthDate,
        quarterDate,
        yearDate,
        mediaValues,
        quotaValues,
        doubleQuotaValues,
        dimensionId,
        monthPickerList,
        orderIndexId,
        orderValue,
        singleTopN,
        doubleTopN,
        rankTableTypeId,
      } = this;
      if ((activeTabs == 2 || activeTabs == 3) && this.rankTypeId == 4) {
        this.activeTabs = 1;
      }
      const subIndexIdList = quotaValues.map((item) => item.id);
      const mediaIdList = mediaValues.map((item) => item.id);

      const initTime = () => {
        if (rankTypeId == 2) {
          return quarterDate;
        }
        if (rankTypeId == 3) {
          return yearDate;
        }
        if (rankTypeId == 4) {
          return monthPickerList.join(",");
        }
        return moment(monthDate).format("YYYYMM");
      };

      this.filtrateRankTableHeader = dimensionId;

      if (analysisTypeId == 2) {
        this.RankChangeTableTitle = this.unitTitle(
          quotaValues[0].name,
          quotaValues[0].id
        );
        this.getMediaChangeRankDataList({
          rankTypeId,
          campaignTypeId: campaignTypeId.join(","),
          subIndexId: subIndexIdList.join(","),
        });
      } else {
        if (activeTabs === 1) {
          const rankDataObj = {
            analysisSubjectTypeId,
            rankTypeId,
            time: initTime(),
            campaignTypeId: campaignTypeId.join(","),
            mediaId: analysisSubjectTypeId == 1 ? "" : mediaIdList.join(","),
            indexId: dimensionId.join(","),
            currentPage: page || 1,
            pageSize: 10,
            orderIndexId,
            orderValue,
            analyseId: rankTableTypeId,
          };

          this.SET_RANK_LOADING(true);

          this.setRankTableColumns();

          this.getMediaTopList(rankDataObj);
        } else if (activeTabs === 2) {
          this.SET_DEFAULT_SINGLE_QUOTA_LIST();

          quotaValues.forEach((item, index) => {
            const time = initTime();

            const quotaObj = {
              params: {
                analysisSubjectTypeId,
                rankTypeId,
                time,
                mediaId:
                  analysisSubjectTypeId == 1 ? "" : mediaIdList.join(","),
                campaignTypeId: campaignTypeId.join(","),
                topN: singleTopN[index],
                subIndexId: item.id,
              },
              index,
            };
            this.getMediaSingleQuotaCharts(quotaObj);
          });
        } else if (activeTabs === 3) {
          this.$store.commit("mediaRank/SET_DEFAULT_DOUBLE_QUOTA_LIST");

          const time = initTime();

          doubleQuotaValues.forEach((list, index) => {
            const doubleList = list.map((item) => item.id);
            const quotaObj = {
              params: {
                analysisSubjectTypeId,
                rankTypeId,
                time,
                mediaId:
                  analysisSubjectTypeId == 1 ? "" : mediaIdList.join(","),
                campaignTypeId: campaignTypeId.join(","),
                topN: doubleTopN[index],
                subIndexId: doubleList.join(","),
              },
              index,
            };
            this.getMediaDoubleQuotaCharts(quotaObj);
          });
        } else if (activeTabs === 4) {
          const searchObj = {
            analysisSubjectTypeId,
            rankTypeId,
            time: initTime(),
            campaignTypeId: campaignTypeId.join(","),
            mediaId: mediaIdList.join(","),
            currentPage: page || 1,
            orderIndexId,
            orderValue,
            pageSize: 10,
          };
          this.setDetailDataColumns();

          this.SET_DETAIL_LOADING(true);

          this.getMediaInfoDetailList(searchObj);
        }
      }

      this.categoryWidth = analysisSubjectTypeId == 2 ? 230 : 100;
    },
    rankBtnTypeClick(type) {
      this.rankBtnType = type;
    },
    analysisChange(value) {
      if (this.analysisTypeId == 2) {
        this.rankTypeId = "1";
      } else {
        this.rankTypeId = "4";
      }
      this.quotaValues = [{ name: "线索成本", id: "9", parentId: "4" }];
      this.campaignTypeId = ["1"];
      this.monthPickerList = [
        (moment(this.monthList[0]).format("YYYYMM"),
        moment(this.monthList[1]).format("YYYYMM")),
      ];
      this.search();

      // this.resetSearch();
    },
    toogleShowMore() {
      this.showTopTen = !this.showTopTen;
    },
    singleChange(value, index) {
      const subIndexId = this.quotaValues[index].id;
      const {
        analysisSubjectTypeId,
        mediaValues,
        rankTypeId,
        monthDate,
        quarterDate,
        yearDate,
        campaignTypeId,
      } = this;

      let time = moment(monthDate).format("YYYYMM");

      const mediaIdList = mediaValues.map((item) => item.id);

      if (rankTypeId == 2) {
        time = quarterDate;
      }

      if (rankTypeId == 3) {
        time = yearDate;
      }

      const quotaObj = {
        params: {
          analysisSubjectTypeId,
          mediaId: analysisSubjectTypeId == 1 ? "" : mediaIdList.join(","),
          rankTypeId,
          time,
          campaignTypeId: campaignTypeId.join(","),
          subIndexId,
          topN: value,
        },
        index,
      };

      this.singleTopN[index] = value;

      this.getMediaSingleQuotaCharts(quotaObj);
    },
    doubleChange(value, index) {
      const { selectValue, quotaValues } = value;

      const doubleQuotaValues = JSON.parse(
        JSON.stringify(this.doubleQuotaValues)
      );

      doubleQuotaValues[index] = quotaValues;

      const subIndexId = quotaValues.map((item) => item.id);

      const {
        analysisSubjectTypeId,
        mediaValues,
        rankTypeId,
        monthDate,
        quarterDate,
        yearDate,
        campaignTypeId,
      } = this;

      const mediaIdList = mediaValues.map((item) => item.id);

      let time = moment(monthDate).format("YYYYMM");

      if (rankTypeId == 2) {
        time = quarterDate;
      }

      if (rankTypeId == 3) {
        time = yearDate;
      }

      const quotaObj = {
        params: {
          analysisSubjectTypeId,
          mediaId: analysisSubjectTypeId == 1 ? "" : mediaIdList.join(","),
          rankTypeId,
          time,
          campaignTypeId: campaignTypeId.join(","),
          subIndexId: subIndexId.join(","),
          topN: selectValue,
        },
        index,
      };

      this.getMediaDoubleQuotaCharts(quotaObj);

      this.doubleTopN[index] = selectValue;

      this.doubleQuotaValues = doubleQuotaValues;
    },
    setDetailDataColumns() {
      const { analysisSubjectTypeId, userAuth } = this;
      const { roleId } = userAuth;
      let detailDataColumns = [];

      if (analysisSubjectTypeId == 1) {
        detailDataColumns.push({
          dataIndex: "name",
          key: "name",
          title: "媒体",
          align: "center",
          fixed: "left",
          width: 150,
        });
      }
      if (analysisSubjectTypeId == 2) {
        detailDataColumns.push({
          dataIndex: "name",
          key: "name",
          title: "项目",
          align: "center",
          fixed: "left",
          width: 500,
        });
      }
      if (analysisSubjectTypeId == 3) {
        detailDataColumns.push({
          dataIndex: "name",
          key: "name",
          title: "部门",
          align: "center",
          fixed: "left",
          width: 150,
        });
      }

      // if (costAuthList.includes(roleId)) {
      detailDataColumns.push({
        title: "花费（万元）",
        key: "totalCost",
        dataIndex: "totalCost",
        sorterId: "1",
        sorter: true,
        sortOrder:
          this.orderIndexId == 1 && this.orderValue == 1
            ? "ascend"
            : this.orderIndexId == 1 && this.orderValue == 0
            ? "descend"
            : "",
        align: "center",
        width: 140,
      });
      // }

      this.detailDataColumns = [...detailDataColumns];
    },
    setRankTableColumns() {
      const { analysisSubjectTypeId, userAuth } = this;

      const { roleId } = userAuth;

      let columns = [];

      if (Number(analysisSubjectTypeId) === 1) {
        columns = [
          {
            dataIndex: "name",
            key: "name",
            title: "媒体",
            align: "center",
            width: 150,
          },
        ];
      }

      if (Number(analysisSubjectTypeId) === 2) {
        columns = [
          {
            dataIndex: "name",
            key: "name",
            title: "项目",
            align: "center",
            width: 500,
          },
        ];
      }

      if (Number(analysisSubjectTypeId) === 3) {
        columns = [
          {
            dataIndex: "name",
            key: "name",
            title: "部门",
            align: "center",
            width: 150,
          },
        ];
      }

      if (costAuthList.includes(roleId)) {
        columns.push({
          title: "花费（万元）",
          key: "totalCost",
          dataIndex: "totalCost",
          sorterId: "1",
          sorter: true,
          sortOrder:
            this.orderIndexId == 1 && this.orderValue == 1
              ? "ascend"
              : this.orderIndexId == 1 && this.orderValue == 0
              ? "descend"
              : "",
          align: "center",
          width: 140,
        });
      }

      this.rankColumns = columns;
    },
    tabsChange(key) {
      this.campaignTypeId = defaultCampaign;

      this.search();
    },
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
    // 钻石，数值类型改变
    dataTypeChange(type, sorterId, rankTableTypeId) {
      // if (this.rankType) return;
      this.dataType = type;
      this.orderIndexId = sorterId;
      this.orderValue = "";
      this.rankTableTypeId = rankTableTypeId;

      this.search(1);
    },
    resetSorter() {
      this.orderIndexId = "";
      this.orderValue = "";
      if (this.$refs.rankDateTable)
        this.$refs.rankDateTable.$emit("clearSorter");
      if (this.$refs.detailedDataTable)
        this.$refs.detailedDataTable.$emit("clearSorter");
    },
    selectAnalysisSubject(id) {
      const { activeTabs } = this;
      if (this.analysisSubjectTypeId == 1) {
        this.analysisTypeId = "1";
      }
      if (id == 2 || id == 3) {
        if (activeTabs === 2 || activeTabs === 3) {
          this.activeTabs = 1;
        }
      }

      this.analysisSubjectTypeId = id;
    },
    rankTypeChange(value) {
      const { activeTabs } = this;
      if (value == 4) {
        if (activeTabs === 2 || activeTabs === 3) {
          this.activeTabs = 1;
        }
      }
    },
  },
  watch: {
    monthList(newVal) {
      this.monthDate = moment(newVal[1]);

      this.monthPickerList = [
        (moment(newVal[0]).format("YYYYMM"),
        moment(newVal[1]).format("YYYYMM")),
      ];
    },
    quarterList(newVal) {
      this.quarterDate = newVal[newVal.length - 1];
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
}

.media-subject-ctn {
  .subject-item {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    width: 160px;
    height: 32px;
    line-height: 32px;
    background: #ffffff;
    text-align: center;
    user-select: none;
    cursor: pointer;
    color: #333333;
    transition: all 0.2s linear;

    &:hover {
      border-color: #0073c6;
    }

    &.selected {
      border-color: #0073c6;
      color: #ffffff;
      background: #0073c6;
    }
  }
}

.quota-ctn {
  overflow-x: auto;
  .single-quota-ctn {
    min-width: 1435px;
    .quota-wrap {
      float: left;
      margin: 0 5px 10px;
    }
  }

  .double-quota-ctn {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-width: 1435px;
    .quota-wrap {
      flex-shrink: 0;
      flex-grow: 1;
      margin: 0 5px 10px;
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

.changeTable-cell {
  p {
    margin: 0;
  }
}

.type-box {
  display: inline-block;
}

.type-data {
  display: inline-block;
  border: 1px solid #d9d9d9;
  color: #212121;
  cursor: pointer;
  width: 77px;
  height: 32px;
  line-height: 32px;
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
