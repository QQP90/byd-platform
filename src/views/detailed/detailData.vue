<template>
  <div>
    <div class="search-box ranking">
      <div>
        <a-select
          :maxTagCount="1"
          placeholder="请选择投放状态"
          mode="multiple"
          style="width: 160px"
          v-model="state"
        >
          <a-select-option
            v-for="item in stateData"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-date-picker
          format="YYYY-MM-DD"
          :showToday="false"
          style="width: 230px"
          placeholder="项目开始时间"
          v-model="startTime"
          :disabledDate="startTimeDisable"
        >
        </a-date-picker>
        <a-date-picker
          format="YYYY-MM-DD"
          :showToday="false"
          style="width: 230px"
          placeholder="项目结束时间"
          v-model="endTime"
          :disabledDate="endTimeDisable"
        >
        </a-date-picker>
        <a-select
          :maxTagCount="1"
          placeholder="事业部名称"
          mode="tags"
          style="width: 160px"
          @change="parentDeptIdChange"
          v-model="parentDeptId"
        >
          <a-select-option
            v-for="item in parentDeptData"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
            >{{ item.parentDeptName }}</a-select-option
          >
        </a-select>
        <a-select
          :maxTagCount="1"
          placeholder="部门名称"
          mode="tags"
          style="width: 160px"
          v-model="deptId"
        >
          <a-select-option
            v-for="item in secondDeptList"
            :key="item.deptId"
            :value="item.deptId"
            >{{ item.deptName }}</a-select-option
          >
        </a-select>

        <MediaComponent
          placeholder="请选择媒体"
          :options="mediaData"
          v-model="mediaId"
          mode="multiple"
          style="width: 160px"
        >
        </MediaComponent>
      </div>
      <div>
        <a-button @click="reset"> 重置 </a-button>
        <a-button type="primary" @click="search"> 查询 </a-button>
      </div>
    </div>
    <div class="filtrate">
      <MediaComponent
        placeholder="项目基本信息"
        :options="campaignBaseDataFilter"
        :values="baseDataId"
        mode="multiple"
        style="width: 160px"
        @change="campaignBaseIdChange"
      >
      </MediaComponent>
      <quota
        :options="indexDataCpmputed"
        placeholder="监测指标"
        :values="subIndexId"
        :selectAll="true"
        @onConfirm="(value) => (subIndexId = value)"
      ></quota>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      rowKey="campaginAdslotId"
      :scroll="{ x: 'max-content' }"
      :pagination="pageOptions"
      :loading="loading"
      @change="tableChange"
    ></a-table>
  </div>
</template>
<script>
import MediaComponent from "@/components/MediaComponent/index";
import quota from "@/components/QuotaComponent";
import {
  getDoubleIndexSubIndexData,
  getCampaignDate,
  getDeliveryStatus,
  getParentDeptList,
  getDeptList,
  getProjectMediaData,
  getCampaignBaseDataList,
  getCampaignDetailDataList,
  downloadDetailData,
} from "@/service/detailed/detailData";
import { _download } from "@/assets/js/utils";
import moment from "moment";
const projectInfo = [
  {
    title: "事业部",
    sorterId: "1",
    dataIndex: "parentDeptName",
    key: "parentDeptName",
    align: "center",
  },
  {
    title: "部门",
    sorterId: "2",
    align: "center",
    dataIndex: "deptName",
    key: "deptName",
  },
  {
    title: "子车系",
    sorterId: "3",
    align: "center",
    dataIndex: "subModelName",
    key: "subModelName",
  },
  {
    title: "活动阶段",
    sorterId: "4",
    align: "center",
    dataIndex: "activePhaseName",
    key: "activePhaseName",
  },
  {
    title: "推广活动名称",
    sorterId: "5",
    align: "center",
    width: 200,
    dataIndex: "campaginName",
    key: "campaginName",
  },
  {
    title: "推广活动ID",
    sorterId: "6",
    align: "center",
    dataIndex: "campaginId",
    key: "campaginId",
  },
  {
    title: "项目编号",
    sorterId: "7",
    align: "center",
    dataIndex: "campaginNo",
    key: "campaginNo",
  },
  {
    title: "开始日期",
    sorterId: "8",
    align: "center",
    dataIndex: "putStartTime",
    key: "putStartTime",
  },
  {
    title: "结束日期",
    sorterId: "9",
    align: "center",
    dataIndex: "putEndTime",
    key: "putEndTime",
  },
  {
    title: "投放目标",
    sorterId: "10",
    align: "center",
    dataIndex: "putCampaginType",
    key: "putCampaginType",
  },
  {
    title: "参与打榜",
    sorterId: "11",
    align: "center",
    dataIndex: "isPlayList",
    key: "isPlayList",
  },
  {
    title: "是否补量",
    sorterId: "12",
    align: "center",
    dataIndex: "isFillAmount",
    key: "isFillAmount",
  },
  {
    title: "代理名称",
    sorterId: "13",
    align: "center",
    dataIndex: "agentName",
    key: "agentName",
  },
  {
    title: "媒体名称",
    sorterId: "14",
    align: "center",
    dataIndex: "mediaName",
    key: "mediaName",
  },
  {
    title: "预估曝光量",
    sorterId: "15",
    align: "center",
    dataIndex: "forecastImpl",
    key: "forecastImpl",
  },
  {
    title: "预估点击量",
    sorterId: "16",
    align: "center",
    dataIndex: "forecastClick",
    key: "forecastClick",
  },
  {
    title: "预估留资量",
    sorterId: "17",
    align: "center",
    dataIndex: "forecastLeave",
    key: "forecastLeave",
  },
  {
    title: "预估总费用",
    sorterId: "18",
    align: "center",
    dataIndex: "forecastCost",
    key: "forecastCost",
  },
  {
    title: "投放区域",
    sorterId: "19",
    align: "center",
    dataIndex: "putArea",
    key: "putArea",
  },
];
const advertisingInfo = [
  {
    title: "终端类型",
    sorterId: "20",
    align: "center",
    dataIndex: "deviceType",
    key: "deviceType",
  },
  {
    title: "投放位置",
    sorterId: "21",
    align: "center",
    dataIndex: "putLocation",
    key: "putLocation",
  },
  {
    title: "投放位置ID",
    sorterId: "22",
    align: "center",
    dataIndex: "putLocationId",
    key: "putLocationId",
  },
  {
    title: "广告位名称",
    sorterId: "23",
    align: "center",
    dataIndex: "adslotName",
    key: "adslotName",
  },
  {
    title: "广告形式",
    sorterId: "24",
    align: "center",
    dataIndex: "adslotType",
    key: "adslotType",
  },
  {
    title: "广告尺寸",
    sorterId: "25",
    align: "center",
    dataIndex: "adslotSzie",
    key: "adslotSzie",
  },
  {
    title: "落地页URL",
    sorterId: "26",
    align: "center",
    dataIndex: "adslotLocationUrl",
    key: "adslotLocationUrl",
  },
  {
    title: "是否赠送",
    sorterId: "27",
    align: "center",
    dataIndex: "isGiving",
    key: "isGiving",
  },
  {
    title: "购买方式",
    sorterId: "28",
    align: "center",
    dataIndex: "buyType",
    key: "buyType",
  },
  {
    title: "结算方式",
    sorterId: "29",
    align: "center",
    dataIndex: "settlementType",
    key: "settlementType",
  },
  {
    title: "投放数量",
    sorterId: "30",
    align: "center",
    dataIndex: "putNum",
    key: "putNum",
  },
  {
    title: "广告位刊例价",
    sorterId: "31",
    align: "center",
    dataIndex: "adslotQuotedPrice",
    key: "adslotQuotedPrice",
  },
  {
    title: "广告位刊例总价",
    sorterId: "32",
    align: "center",
    dataIndex: "adslotQuotedTotalPrice",
    key: "adslotQuotedTotalPrice",
  },
  {
    title: "折扣",
    sorterId: "33",
    align: "center",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "综合折扣",
    sorterId: "34",
    align: "center",
    dataIndex: "totalDiscount",
    key: "totalDiscount",
  },
  {
    title: "净总价（广告位折后价）",
    sorterId: "35",
    align: "center",
    dataIndex: "netPrice",
    key: "netPrice",
  },
  {
    title: "单价（广告位折后单价）",
    sorterId: "36",
    align: "center",
    dataIndex: "unitPrice",
    key: "unitPrice",
  },
  {
    title: "是否专项",
    sorterId: "37",
    align: "center",
    dataIndex: "isSpecial",
    key: "isSpecial",
  },
  {
    title: "预估总曝光量",
    sorterId: "38",
    align: "center",
    dataIndex: "forecastTotalImpl",
    key: "forecastTotalImpl",
  },
  {
    title: "预估总点击量",
    sorterId: "39",
    align: "center",
    dataIndex: "forecastTotalClick",
    key: "forecastTotalClick",
  },
  {
    title: "预估总留资量",
    sorterId: "40",
    align: "center",
    dataIndex: "forecastTotalLeave",
    key: "forecastTotalLeave",
  },
  {
    title: "支持第三方曝光监测",
    sorterId: "41",
    align: "center",
    dataIndex: "supportThirdImplMonitor",
    key: "supportThirdImplMonitor",
  },
  {
    title: "支持第三方点击监测",
    sorterId: "42",
    align: "center",
    dataIndex: "supportThirdClickMonitor",
    key: "supportThirdClickMonitor",
  },
];
const campaignDisabledIdLis = [
  "20",
  "21",
  "22",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
];
export default {
  title: "detailData",
  components: { MediaComponent, quota },
  data() {
    return {
      dataSource: [], // table数据
      loading: false, // table数据加载
      pageOptions: {
        total: 10,
        showSizeChanger: false,
        hideOnSinglePage: true,
        current: 1,
        pageSize: 10,
      }, // 页码信息
      timeData: [], // 项目时间组件数据
      deptData: [], // 二级部门组件数据
      parentDeptData: [], // 一级事业部组件数据
      stateData: [], // 投放状态组件数据
      subIndexData: [], // 监测指标数据
      mediaData: [], // 媒体组件数据
      parentDeptId: [], // 事业部选择
      deptId: [], // 二级部门选择回调
      state: [], // 投放状态选择
      mediaId: [], // 媒体选择
      baseDataId: [
        { name: "事业部", id: "1" },
        { name: "部门", id: "2" },
        // { name: "子车系", id: "3" },
        // { name: "活动阶段", id: "4" },
        { name: "推广活动名称", id: "5" },
        // { name: "开始日期", id: "8" },
        // { name: "结束日期", id: "9" },
        // { name: "投放区域", id: "19" },
      ], // 项目基本信息选择id
      subIndexId: [
        { name: "PV", id: "2" },
        { name: "UV", id: "5" },
        { name: "线索量", id: "8" },
        { name: "有效线索量", id: "9" },
        { name: "成交量", id: "12" },
        { name: "PV成本", id: "13" },
        { name: "UV成本", id: "16" },
        { name: "有效线索成本", id: "20" },
        { name: "线索成本", id: "19" },
        { name: "成交成本", id: "23" },
      ], // 监测指标id
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      campaignBaseData: [], // 项目基本信息组件数据
      orderIndexId: "", // 排序id
      orderValue: "", // 升序/降序 1/0
      sorterInfo: {}, // 排序信息
    };
  },
  computed: {
    // table表头
    columns() {
      const { projectInfo, advertisingInfo, indexInfo } = this;
      return [...projectInfo, ...advertisingInfo, ...indexInfo];
    },
    // 项目基本信息
    projectInfo() {
      const { baseDataIdLis, filtrateColumns } = this;
      const lis = JSON.parse(JSON.stringify(projectInfo));
      const columnsLis = filtrateColumns(baseDataIdLis, lis);
      const columns = [
        {
          title: "项目基本信息",
          align: "center",
          children: columnsLis,
        },
      ];
      if (columnsLis.length) {
        return columns;
      }
      return [];
    },
    // 广告基本信息
    advertisingInfo() {
      const { baseDataIdLis, filtrateColumns } = this;
      const lis = JSON.parse(JSON.stringify(advertisingInfo));
      const columnsLis = filtrateColumns(baseDataIdLis, lis);
      const columns = [
        {
          title: "广告基本信息",
          align: "center",
          children: columnsLis,
        },
      ];
      if (columnsLis.length) {
        return columns;
      }
      return [];
    },
    // 监测指标表头
    indexInfo() {
      const { magnitudeDimension, costDimension, CVRDimension } = this;
      const lis = [...magnitudeDimension, ...costDimension, ...CVRDimension];
      const columns = [
        {
          title: "监测指标",
          align: "center",
          children: lis,
        },
      ];
      if (lis.length) {
        return columns;
      }
      return [];
    },
    // 量级维度表头
    magnitudeDimension() {
      const { subIndexIdLis, filtrateColumns, orderIndex } = this;
      const lis = [
        {
          title: "花费（元）",
          key: "totalCost",
          dataIndex: "totalCost",
          align: "center",
          sorterId: "1",
          sorter: true,
          width: 150,
          sortOrder: orderIndex(1),
        },
        {
          title: "PV（次）",
          key: "pvValue",
          sorter: true,
          align: "center",
          sorterId: "2",
          dataIndex: "pvValue",
          sortOrder: orderIndex(2),
        },
        {
          title: "曝光量（次）",
          dataIndex: "imp",
          key: "imp",
          sorterId: "3",
          align: "center",
          sorter: true,
          sortOrder: orderIndex(3),
        },
        {
          title: "有效曝光量（次）",
          dataIndex: "effImp",
          key: "effImp",
          sorterId: "4",
          sorter: true,
          align: "center",
          sortOrder: orderIndex(4),
        },
        {
          title: "UV（次）",
          key: "uvValue",
          sorter: true,
          align: "center",
          sorterId: "5",
          dataIndex: "uvValue",
          sortOrder: orderIndex(5),
        },
        {
          title: "点击量（次）",
          key: "click",
          sorter: true,
          align: "center",
          sorterId: "6",
          dataIndex: "uvValue",
          sortOrder: orderIndex(6),
        },
        {
          title: "有效点击量（次）",
          key: "effClick",
          sorter: true,
          align: "center",
          sorterId: "7",
          dataIndex: "effClick",
          sortOrder: orderIndex(7),
        },
        {
          title: "线索量（个）",
          key: "leads",
          align: "center",
          sorter: true,
          sorterId: "8",
          dataIndex: "leads",
          sortOrder: orderIndex(8),
        },
        {
          title: "有效线索量（个）",
          key: "effLeads",
          sorter: true,
          align: "center",
          sorterId: "9",
          dataIndex: "effLeads",
          sortOrder: orderIndex(9),
        },
        {
          title: "试乘试驾量（个）",
          key: "driveNum",
          sorter: true,
          align: "center",
          sorterId: "10",
          dataIndex: "driveNum",
          sortOrder: orderIndex(10),
        },
        {
          title: "直接成交量（个）",
          key: "directDealNum",
          sorter: true,
          align: "center",
          sorterId: "11",
          dataIndex: "directDealNum",
          sortOrder: orderIndex(11),
        },
        {
          title: "（促进）成交量（个）",
          key: "dealNum",
          sorter: true,
          sorterId: "12",
          align: "center",
          dataIndex: "dealNum",
          sortOrder: orderIndex(12),
        },
      ];
      const columnsLis = filtrateColumns(subIndexIdLis, lis);
      const columns = [
        {
          title: "量级维度",
          align: "center",
          children: columnsLis,
        },
      ];
      if (columnsLis.length) {
        return columns;
      }
      return [];
    },
    // 成本维度表头
    costDimension() {
      const { subIndexIdLis, filtrateColumns, orderIndex } = this;
      const lis = [
        {
          title: "PV成本（元）",
          key: "pvCost",
          sorter: true,
          sorterId: "13",
          align: "center",
          dataIndex: "pvCost",
          sortOrder: orderIndex(13),
        },
        {
          title: "曝光成本（元）",
          key: "impCost",
          sorter: true,
          sorterId: "14",
          align: "center",
          dataIndex: "impCost",
          sortOrder: orderIndex(14),
        },
        {
          title: "有效曝光成本（元）",
          key: "effImpCost",
          sorter: true,
          sorterId: "15",
          align: "center",
          dataIndex: "effImpCost",
          sortOrder: orderIndex(15),
        },
        {
          title: "UV成本（元）",
          key: "uvCost",
          sorter: true,
          sorterId: "16",
          align: "center",
          dataIndex: "uvCost",
          sortOrder: orderIndex(16),
        },
        {
          title: "点击成本（元）",
          key: "clickCost",
          sorter: true,
          sorterId: "17",
          align: "center",
          dataIndex: "clickCost",
          sortOrder: orderIndex(17),
        },
        {
          title: "有效点击成本（元）",
          key: "effClickCost",
          sorter: true,
          sorterId: "18",
          align: "center",
          dataIndex: "effClickCost",
          sortOrder: orderIndex(18),
        },
        {
          title: "线索成本（元）",
          key: "leadsCost",
          sorter: true,
          sorterId: "19",
          align: "center",
          dataIndex: "leadsCost",
          sortOrder: orderIndex(19),
        },
        {
          title: "有效线索成本（元）",
          key: "effLeadsCost",
          sorter: true,
          sorterId: "20",
          align: "center",
          dataIndex: "effLeadsCost",
          sortOrder: orderIndex(20),
        },
        {
          title: "试乘试驾成本（元）",
          key: "driveCost",
          sorter: true,
          sorterId: "21",
          align: "center",
          dataIndex: "driveCost",
          sortOrder: orderIndex(21),
        },
        {
          title: "直接成交成本（元）",
          key: "directDealCost",
          sorter: true,
          sorterId: "22",
          align: "center",
          dataIndex: "directDealCost",
          sortOrder: orderIndex(22),
        },
        {
          title: "(促进)成交成本（元）",
          key: "dealCost",
          sorter: true,
          sorterId: "23",
          align: "center",
          dataIndex: "dealCost",
          sortOrder: orderIndex(23),
        },
      ];
      const columnsLis = filtrateColumns(subIndexIdLis, lis);
      const columns = [
        {
          title: "成本维度",
          align: "center",
          children: columnsLis,
        },
      ];
      if (columnsLis.length) {
        return columns;
      }
      return [];
    },
    // 转化率维度
    CVRDimension() {
      const { subIndexIdLis, filtrateColumns, orderIndex, CVRDimensionRender } =
        this;
      const lis = [
        {
          title: "有效曝光率",
          key: "effImpRate",
          sorter: true,
          sorterId: "24",
          align: "center",
          dataIndex: "effImpRate",
          sortOrder: orderIndex(24),
          customRender: CVRDimensionRender,
        },
        {
          title: "点击率",
          key: "clickRate",
          sorter: true,
          sorterId: "25",
          align: "center",
          dataIndex: "clickRate",
          sortOrder: orderIndex(25),
          customRender: CVRDimensionRender,
        },
        {
          title: "有效点击率",
          key: "effClickRate",
          sorter: true,
          sorterId: "26",
          align: "center",
          dataIndex: "effClickRate",
          sortOrder: orderIndex(26),
          customRender: CVRDimensionRender,
        },
        {
          title: "留资率",
          key: "retainedRate",
          sorter: true,
          sorterId: "27",
          align: "center",
          dataIndex: "retainedRate",
          sortOrder: orderIndex(27),
          customRender: CVRDimensionRender,
        },
        {
          title: "线索有效率",
          key: "effLeadsRate",
          sorter: true,
          sorterId: "28",
          align: "center",
          dataIndex: "effLeadsRate",
          sortOrder: orderIndex(28),
          customRender: CVRDimensionRender,
        },
        {
          title: "试乘试驾率",
          key: "driveRate",
          sorter: true,
          sorterId: "29",
          align: "center",
          dataIndex: "driveRate",
          sortOrder: orderIndex(29),
          customRender: CVRDimensionRender,
        },
        {
          title: "直接成交率",
          key: "directDealRate",
          sorter: true,
          sorterId: "30",
          align: "center",
          dataIndex: "directDealRate",
          sortOrder: orderIndex(30),
          customRender: CVRDimensionRender,
        },
        {
          title: "(促进)成交率",
          key: "dealRate",
          sorter: true,
          sorterId: "31",
          align: "center",
          dataIndex: "dealRate",
          sortOrder: orderIndex(31),
          customRender: CVRDimensionRender,
        },
      ];
      const columnsLis = filtrateColumns(subIndexIdLis, lis);
      const columns = [
        {
          title: "转化率",
          align: "center",
          children: columnsLis,
        },
      ];
      if (columnsLis.length) {
        return columns;
      }
      return [];
    },
    // 二级部门列表
    secondDeptList() {
      const { parentDeptId, deptData } = this;
      let lis = [];
      if (parentDeptId.length) {
        for (let i = 0, len = parentDeptId.length; i < len; i++) {
          for (let index = 0, len = deptData.length; index < len; index++) {
            if (
              Number(parentDeptId[i]) === Number(deptData[index].parentDeptId)
            ) {
              lis = [...lis, deptData[index]];
            }
          }
        }
      } else {
        lis = [...deptData];
      }
      return lis;
    },
    // 监测指标选项
    indexDataCpmputed() {
      let lis = [];
      this.subIndexData.forEach((item) => {
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
    // 项目基本信息选择id提取 lis
    baseDataIdLis() {
      const { baseDataId } = this;
      const lis = [];
      baseDataId.forEach((item) => {
        lis.push(item.id);
      });
      return lis;
    },
    // 监测指标id提取 lis
    subIndexIdLis() {
      const { subIndexId } = this;
      const lis = [];
      subIndexId.forEach((item) => {
        lis.push(item.id);
      });
      return lis;
    },
    // 项目基本信息和广告基本信息选项
    campaignBaseDataFilter() {
      const { baseDataIdLis, campaignBaseData } = this;
      const lis = campaignBaseData.map((item) => {
        // //
        // if (item.id == 5) {
        //   item.disabled = true;
        // }
        // 23为广告位名称id
        if (
          (!baseDataIdLis.includes("23") &&
            campaignDisabledIdLis.includes(item.id)) ||
          item.id == 5
        ) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
        return item;
      });
      return lis;
    },
  },
  methods: {
    // 获取监测指标
    async getDoubleIndexSubIndexData() {
      try {
        const res = await getDoubleIndexSubIndexData();
        this.subIndexData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取时间组件数据
    async getCampaignDate() {
      try {
        const res = await getCampaignDate();
        this.timeData = res.data[0];
        this.startTime = moment(res.data[0].startTime);
        this.endTime = moment(res.data[0].endTime);
      } catch (error) {
        console.error(error);
      }
    },
    // 获取投放状态组件数据
    async getDeliveryStatus() {
      try {
        const res = await getDeliveryStatus();
        this.stateData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取事业部组件数据
    async getParentDeptList() {
      try {
        const res = await getParentDeptList();
        this.parentDeptData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取部门组件数据
    async getDeptList() {
      try {
        const res = await getDeptList();
        this.deptData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取媒体组件数据
    async getProjectMediaData() {
      try {
        const res = await getProjectMediaData();
        this.mediaData = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 获取项目基本信息组件数据
    async getCampaignBaseDataList() {
      try {
        const res = await getCampaignBaseDataList();
        this.campaignBaseData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 查询项目明细数据
    async getCampaignDetailDataList() {
      this.loading = true;
      try {
        const {
          startTime,
          endTime,
          state,
          deptId,
          parentDeptId,
          mediaId,
          pageOptions,
          orderIndexId,
          orderValue,
        } = this;
        if (startTime == null || endTime == null) {
          this.$message.info("请选择开始时间和结束时间。");
          return;
        }
        const obj = {
          state: state.join(","),
          deptId: deptId.join(","),
          parentDeptId: parentDeptId.join(","),
          mediaId: mediaId.map((item) => item.id).join(","),
          startTime: moment(startTime).format("YYYY-MM-DD"),
          endTime: moment(endTime).format("YYYY-MM-DD"),
          currentPage: pageOptions.current,
          pageSize: 10,
          orderValue,
          orderIndex: orderIndexId,
        };
        if (deptId.length) {
          delete obj.parentDeptId;
        } else {
          delete parentDeptId.deptId;
        }
        const res = await getCampaignDetailDataList(obj);
        this.dataSource = res.data.list;
        this.pageOptions.total = res.data.total;
      } catch (error) {
        this.$message.error("服务器错误。");
        this.dataSource = [];
      }
      this.loading = false;
    },
    // 一级部门选择回调
    parentDeptIdChange() {
      const { deptId } = this;
      const deptIdLis = [];
      this.secondDeptList.forEach((item, i) => {
        if (deptId.indexOf(item.deptId) > -1) {
          deptIdLis.push(item.deptId);
        }
      });
      this.deptId = deptIdLis;
    },
    // 选择开始时间禁用
    startTimeDisable(current) {
      if (this.endTime == null) {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      } else {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.endTime)
        );
      }
    },
    // 选择结束时间禁用
    endTimeDisable(current) {
      if (this.startTime == null) {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      } else {
        return (
          moment(this.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      }
    },
    // 重置选项
    reset() {
      this.startTime = moment(this.timeData.startTime);
      this.endTime = moment(this.timeData.endTime);
      this.state = [];
      this.deptId = [];
      this.parentDeptId = [];
      this.baseDataId = [
        { name: "事业部", id: "1" },
        { name: "部门", id: "2" },
        // { name: "子车系", id: "3" },
        // { name: "活动阶段", id: "4" },
        { name: "推广活动名称", id: "5" },
        // { name: "开始日期", id: "8" },
        // { name: "结束日期", id: "9" },
        // { name: "投放区域", id: "19" },
      ]; // 项目基本信息选择id
      this.subIndexId = [
        { name: "PV", id: "2" },
        { name: "UV", id: "5" },
        { name: "线索量", id: "8" },
        { name: "有效线索量", id: "9" },
        { name: "成交量", id: "12" },
        { name: "PV成本", id: "13" },
        { name: "UV成本", id: "16" },
        { name: "有效线索成本", id: "20" },
        { name: "线索成本", id: "19" },
        { name: "成交成本", id: "23" },
      ]; // 监测指标id
    },
    /**
     * 筛选表头
     * lis sorterId数组
     * columnsLis 表头数组
     */
    filtrateColumns(lis, columnsLis) {
      const newLis = [];
      columnsLis.forEach((item) => {
        if (lis.includes(item.sorterId)) {
          newLis.push(item);
        }
      });
      return newLis;
    },
    // 列表page/sorter改变
    tableChange(page, filters, sorter) {
      if (page.current != this.pageOptions.current) {
        this.pageOptions.current = page.current;
        this.getCampaignDetailDataList();
        return;
      }
      let orderValue = "";
      let orderIndexId = "";
      if (JSON.stringify(sorter) != "{}") {
        if (sorter.order) {
          orderValue = sorter.order == "ascend" ? "1" : "0";
        } else {
          orderValue = "1";
          sorter.order = "ascend";
        }
        if (sorter.column) {
          orderIndexId = sorter.column.sorterId;
        } else {
          orderIndexId = this.sorterInfo.column.sorterId;
        }
      }
      this.orderIndexId = orderIndexId;
      this.orderValue = orderValue;
      if (JSON.stringify(this.sorterInfo) != JSON.stringify(sorter)) {
        this.pageOptions.current = 1;
        this.getCampaignDetailDataList();
        this.sorterInfo = sorter;
        return;
      }
    },
    // 排序
    orderIndex(id) {
      const { orderIndexId, orderValue } = this;
      if (orderIndexId == id) {
        if (orderValue == 1) {
          return "ascend";
        } else {
          return "descend";
        }
      } else {
        return "";
      }
    },
    // 搜索
    search() {
      const { magnitudeDimension, costDimension, CVRDimension } = this;
      if (magnitudeDimension.length) {
        this.orderValue = 1;
        this.orderIndexId = magnitudeDimension[0].children[0].sorterId;
      } else if (costDimension.length) {
        this.orderValue = 1;
        this.orderIndexId = costDimension[0].children[0].sorterId;
      } else if (CVRDimension.length) {
        this.orderValue = 0;
        this.orderIndexId = CVRDimension[0].children[0].sorterId;
      }
      this.getCampaignDetailDataList();
    },
    // 提取子表头
    getChildrenHeader(lis) {
      let newlis = [];
      lis.forEach((item) => {
        if (item.children) {
          newlis = [...newlis, ...this.getChildrenHeader(item.children)];
        } else {
          newlis.push(item);
        }
      });
      return newlis;
    },
    // 下载数据
    async detailedDownload() {
      try {
        const {
          startTime,
          endTime,
          state,
          deptId,
          parentDeptId,
          mediaId,
          pageOptions,
          orderIndexId,
          orderValue,
          columns,
          getChildrenHeader,
        } = this;

        if (startTime == null || endTime == null) {
          this.$message.info("请选择开始时间和结束时间。");
          return;
        }
        const titleLis = getChildrenHeader(columns);
        if (titleLis.length < 1) {
          this.$message.info("请选择表头后再下载。");
          return;
        }
        const newTitleLis = titleLis.map((item) => ({
          name: item.title,
          key: item.key,
        }));
        const obj = {
          state: state.join(","),
          deptId: deptId.join(","),
          parentDeptId: parentDeptId.join(","),
          mediaId: mediaId.map((item) => item.id).join(","),
          startTime: moment(startTime).format("YYYY-MM-DD"),
          endTime: moment(endTime).format("YYYY-MM-DD"),
          currentPage: pageOptions.current,
          pageSize: 10,
          orderValue,
          orderIndex: orderIndexId,
          title: JSON.stringify(newTitleLis),
        };
        if (deptId.length) {
          delete obj.parentDeptId;
        } else {
          delete parentDeptId.deptId;
        }
        this.$message.info("正在下载，请稍候。");
        const res = await downloadDetailData(obj);
        if (res.flag) {
          _download(res.message);
        } else {
          this.$message.info(res.message);
        }
      } catch (error) {
        this.$message.error("服务器错误。");
      }
    },
    // 项目基础信息选择改变
    campaignBaseIdChange(value) {
      // const lis = [];
      // value.forEach((item) => {
      //   if (item.id == 5 || item.disabled != true) {
      //     lis.push(item);
      //   }
      // });
      // value = lis;
      const idList = value.map((item) => item.id);
      if (!idList.includes("5")) {
        value.push({ disabled: true, id: "5", name: "推广活动名称" });
      }
      // 不选择广告位名称时 广告信息项不可选择 且去除广告类型选择
      if (!idList.includes("23")) {
        const newlis = [];
        value.forEach((item) => {
          if (!campaignDisabledIdLis.includes(item.id)) {
            newlis.push(item);
          }
        });
        this.baseDataId = newlis;
        return;
      }
      this.baseDataId = value;
    },
    CVRDimensionRender(text) {
      return <span>{text == "-" ? text : `${text}%`}</span>;
    },
  },
  async mounted() {
    this.getDoubleIndexSubIndexData();
    this.getDeliveryStatus();
    this.getParentDeptList();
    this.getDeptList();
    this.getProjectMediaData();
    this.getCampaignBaseDataList();
    await this.getCampaignDate();
    this.search();
  },
};
</script>
<style lang="less" scoped>
.filtrate {
  background: #ffffff;
  padding: 14px 20px;
  display: flex;
  margin-top: 20px;
  > * {
    margin-right: 20px;
  }
}
</style>
