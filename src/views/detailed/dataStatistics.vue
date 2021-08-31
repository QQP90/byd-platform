<template>
  <div>
    <div class="search-box">
      <div>
        <div style="width:100%" class="trendType">
          <a-checkbox-group
            @change="changeTheme"
            v-model="sentData.analysisTypeId"
          >
            <a-checkbox :value="1">
              事业部
            </a-checkbox>
            <a-checkbox :value="2">
              部门
            </a-checkbox>

            <a-checkbox :value="3">
              推广活动
            </a-checkbox>

            <a-checkbox :value="4">
              媒体
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!-- 时间 -->

        <a-range-picker
          style="width:230px"
          v-model="sentData.time"
          :disabledDate="disabledDate"
          @change="changeTime"
        />
        <!-- 事业部门 -->
        <a-select
          style="width: 160px"
          v-model="sentData.parentDeptId"
          @change="deptIdChange"
          placeholder="事业部名称"
          mode="tags"
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
        <!-- 部门 -->
        <a-select
          style="width: 160px"
          mode="tags"
          v-model="sentData.deptId"
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
        <!-- 项目类型 -->
        <a-select
          style="width: 160px"
          placeholder="项目类型"
          v-model="sentData.campaignTypeId"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in campaignTypes"
            :key="item.campaignTypeId"
            :value="item.campaignTypeId"
          >
            {{ item.campaignName }}
          </a-select-option>
        </a-select>
        <!-- 状态 -->
        <a-select
          v-model="sentData.state"
          placeholder="投放状态"
          style="width:160px"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="(item, index) in putData"
            :value="item.id"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <MediaComponent
          placeholder="请选择媒体"
          :options="keyIndexMedia"
          v-model="sentData.mediaId"
          mode="multiple"
        >
        </MediaComponent>
        <!-- 检测指标 -->
        <QuotaComponent
          placeholder="监测指标"
          :options="quotaList"
          :values="quotaValues"
          @onConfirm="quotaConfirm"
          :selectAll="true"
        ></QuotaComponent>
      </div>
      <div>
        <a-button @click="reset()"> 重置 </a-button>
        <a-button type="primary" @click.stop="search()"> 查询 </a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      @change="tableChange"
      rowKey="campaignId"
      :scroll="{ x: 'max-content' }"
      :pagination="{
        pageSize: 10,
        current: sentData.currentPage,
        hideOnSinglePage: true,
        total: sentData.total,
      }"
    >
    </a-table>
  </div>
</template>

<script>
import { _download } from "@/assets/js/utils";
import dataStatisticsApi from "@/service/detailed/dataStatistics";
import moment from "moment";
import QuotaComponent from "@/components/QuotaComponent";
import trandAnalysis from "@/assets/js/trandAnalysis";
import MediaComponent from "@/components/MediaComponent/index";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "dataStatistics",
  data() {
    return {
      loading: false,
      quotaValues: [
        { name: "PV", id: "2" },
        { name: "UV", id: "5" },
        { name: "线索量", id: "8" },
        { name: "有效线索量", id: "9" },
        { name: "（促进）成交量", id: "12" },
      ],
      sorterInfo: {},
      columns: [],
      quotaList: [], //监测指标
      dataSource: [], //数据表

      putData: [], //投放数据
      keyIndexMedia: [], // 媒体组件数据
      startTime: "",
      endTime: "",
      deptSec: [],
      projectDeptDate: [],
      campaignTypes: [],
      defaultColumnsId: ["parentDeptId"],
      sentData: {
        flowTypeId: 1,
        analysisTypeId: [1], //头部切换
        time: null, //时间
        mediaId: [], //媒体
        orderIndex: "2",
        orderValue: 1,
        state: [],
        dTime: null,
        campaignTypeId: [], //项目类型
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  components: {
    MediaComponent,
    QuotaComponent,
  },

  created() {
    this.getColumnsTitle();
  },
  mounted() {
    // 31指标
    this.getDoubleIndexSubIndexData();
    this.queryData();
  },
  methods: {
    moment,
    async queryData() {
      await this.getProjectCampaignData();

      // 一级部门
      await this.getParentDeptList();
      // 二级部
      await this.getDeptList();
      // 投放状态
      await this.getDeliveryStatus();
      // 媒体数据
      await this.getProjectMediaData();
      await this.getCampaignDate();
    },
    getDeliveryStatus() {
      dataStatisticsApi.getDeliveryStatus().then((res) => {
        this.putData = res.data;
      });
    },
    // 禁选时间
    disabledDate(current) {
      return (
        moment(this.startTime, "YYYY-MM-DD") > current ||
        current > moment(this.endTime, "YYYY-MM-DD")
      );
    },
    // 修改列表
    tableChange(page, filters, sorter) {
      this.sentData.currentPage = page.current;
      this.sentData.pageSize = page.pageSize;
      if (JSON.stringify(sorter) != "{}") {
        if (sorter.order) {
          this.sentData.orderValue = sorter.order == "ascend" ? "1" : "0";
        } else {
          this.sentData.orderValue = "1";
          sorter.order = "ascend";
        }
        if (sorter.column) {
          this.sentData.orderIndex = sorter.column.sorterId;
        } else {
          this.sentData.orderIndex = this.sorterInfo.column.sorterId;
        }
      }
      if (JSON.stringify(this.sorterInfo) != JSON.stringify(sorter)) {
        this.sentData.currentPage = 1;
      }

      this.sorterInfo = sorter;
      this.search();
    },
    getColumnsTitle() {
      this.columns = [];
      const { sorterInfo } = this;
      const defaultColumns = [
        {
          title: "事业部",
          align: "center",
          key: "parentDeptName",
          dataIndex: "parentDeptName",
          sorterId: "parentDeptId",
          width: 200,
        },
        {
          title: "部门",
          sorterId: "deptId",
          align: "center",
          key: "deptName",
          dataIndex: "deptName",
        },
        {
          title: "媒体",
          align: "center",
          key: "mediaName",
          sorterId: "mediaId",
          dataIndex: "mediaName",
        },
        {
          title: "推广活动id",
          sorterId: "campaignId",
          key: "campaignId",
          align: "center",
          dataIndex: "campaignId",
        },
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
      defaultColumns.forEach((v) => {
        this.defaultColumnsId.forEach((item) => {
          if (item == v.sorterId) {
            this.columns.push(v);
          }
        });
      });
      defaultColumns.forEach((v) => {
        this.quotaValues.forEach((item) => {
          if (item.id == v.sorterId) {
            this.columns.push(v);
          }
        });
      });
      // 前四项加上左固定
      for (let index = 0; index < this.columns.length; index++) {
        if (index < 4) {
          this.columns[index].fixed = "left";
          this.columns[index + 1].width = 150;
        }
      }
    },
    changeTheme(val) {
      if (val.length == 0) {
        return;
      }
      this.defaultColumnsId = [];

      val.forEach((v) => {
        if (v == 1) {
          this.defaultColumnsId.push("parentDeptId");
        } else if (v == 2) {
          this.defaultColumnsId.push("deptId");
        } else if (v == 3) {
          this.defaultColumnsId.push("mediaId");
        } else {
          this.defaultColumnsId.push("campaignId");
        }
      });
    },

    // reset
    reset() {
      this.sentData = {
        flowTypeId: 1,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        analysisTypeId: [1], //头部切换
        time: [moment(this.endTime), moment(this.endTime)],
        mediaId: [], //媒体
        state: [],
        campaignTypeId: [], //项目类型
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
      };
      this.search();
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
          time,
          state,
          deptId,
          parentDeptId,
          mediaId,
          orderIndex,
          orderValue,
          analysisTypeId,
        } = this.sentData;
        const { columns } = this;
        if (time == null) {
          this.$message.info("请选择开始时间和结束时间。");
          return;
        }
        const titleLis = this.getChildrenHeader(columns);
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
          dTime: [
            moment(time[0]).format("YYYY-MM-DD"),
            moment(time[1]).format("YYYY-MM-DD"),
          ].join(","),
          currentPage: this.sentData.currentPage,
          pageSize: 10,
          orderValue,
          orderIndex,
          analysisTypeId: analysisTypeId.join(","),
          title: JSON.stringify(newTitleLis),
        };
        if (deptId.length) {
          delete obj.parentDeptId;
        } else {
          delete parentDeptId.deptId;
        }
        this.$message.info("正在下载，请稍候。");
        const res = await dataStatisticsApi.downloadStatisticsData(obj);
        if (res.flag) {
          _download(res.message);
        }
      } catch (error) {
        this.$message.error("服务器错误。");
      }
    },
    // 搜索
    search() {
      this.loading = true;
      this.getColumnsTitle();
      let obj = {
        flowTypeId: this.sentData.flowTypeId,
        analysisTypeId: this.sentData.analysisTypeId.toString(), //头部切换
        dTime: [
          moment(this.sentData.time[0]).format("YYYY-MM-DD"),
          moment(this.sentData.time[1]).format("YYYY-MM-DD"),
        ].join(","), //时间
        mediaId: this.fliterMedia(this.sentData.mediaId).toString(), //媒体
        orderIndex: this.sentData.orderIndex,
        orderValue: this.sentData.orderValue,

        state: this.sentData.state.toString(),
        campaignTypeId: this.sentData.campaignTypeId.toString(), //项目类型
        deptId: this.sentData.deptId.toString(), // 二级部门
        parentDeptId: this.sentData.parentDeptId.toString(), // 一级部门
        currentPage: this.sentData.currentPage,
        pageSize: this.sentData.pageSize,
      };
      dataStatisticsApi
        .getCampaignStatisticsDataList(obj)
        .then((res) => {
          this.dataSource = res.data.list;
          this.loading = false;
          this.sentData.total = res.data.total;
        })
        .catch((e) => {
          this.dataSource = [];
          this.loading = false;
        });
    },
    quotaConfirm(values) {
      this.quotaValues = values;
    },
    // 时间
    getCampaignDate() {
      dataStatisticsApi.getCampaignDate().then((res) => {
        this.startTime = moment(res.data[0].startTime).format("YYYY-MM-DD");
        this.endTime = moment(res.data[0].endTime).format("YYYY-MM-DD");
        this.sentData.time = [moment(this.endTime), moment(this.endTime)];
        setTimeout(() => {
          this.search();
        }, 500);
      });
    },
    // 更改时间
    changeTime(val) {
      let startTime = moment(val[0]).format("YYYY-MM-DD");
      let endTime = moment(val[1]).format("YYYY-MM-DD");
      this.sentData.time = [moment(startTime), moment(endTime)];
    },

    // 监测指标
    getDoubleIndexSubIndexData() {
      dataStatisticsApi.getDoubleIndexSubIndexData().then((res) => {
        res.data.forEach((item) => {
          const { list } = item;
          const children = [];
          list.forEach((child) => {
            children.push({
              name: child.subIndexName,
              id: child.subIndexId,
            });
          });
          this.quotaList.push({
            name: item.indexName,
            id: item.indexId,
            children,
          });
        });
      });
    },
    // 一级部门
    getParentDeptList() {
      let obj = {
        analysisTypeId: this.sentData.analysisTypeId.join(","),
      };
      dataStatisticsApi.getParentDeptList(obj).then((res) => {
        this.projectDeptDate = res.data;
      });
    },

    // 项目类型
    getProjectCampaignData() {
      dataStatisticsApi.getProjectCampaignData().then((res) => {
        this.campaignTypes = res.data;
      });
    },
    // 二级部门
    getDeptList() {
      this.deptSec = [];
      let obj = {};
      if (this.mode == "tags") {
        obj = {
          analysisTypeId: this.sentData.analysisTypeId.join(","),
          parentDeptId: this.sentData.parentDeptId.join(","),
        };
      } else {
        obj = {
          analysisTypeId: this.sentData.analysisTypeId.join(","),
          parentDeptId: this.sentData.parentDeptId.join(","),
        };
      }

      dataStatisticsApi.getDeptList(obj).then((res) => {
        this.deptSec = res.data;
      });
    },
    // 媒体组件数据
    getProjectMediaData() {
      dataStatisticsApi.getProjectMediaData().then((res) => {
        this.keyIndexMedia = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
      });
    },

    // 过滤媒体值
    fliterMedia(obj) {
      let arr = [];
      obj.forEach((v) => {
        arr.push(v.id);
      });
      return arr;
    },
    // 一级联动
    deptIdChange(item) {
      this.getDeptList();
    },
  },
  watch: {
    effectDataType(val) {
      // 正常流量，非正常切换
      this.sentData.flowTypeId = val;
    },
    "sentData.analysisTypeId"(newVal, oldVal) {
      if (newVal.length == 0) {
        this.$message.warning("事业部，部门，推广活动，媒体，至少选一项");
        this.sentData.analysisTypeId = oldVal;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-box {
  position: relative;
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0;
  margin-bottom: 20px;

  > div {
    display: flex;
    flex-wrap: wrap;
    > * {
      margin-right: 20px;
      margin-bottom: 10px;
    }
    > *:last-child {
      margin-right: 0;
    }
  }
  > div:last-child {
    width: 168px;
    flex-shrink: 0;
    margin-top: 30px;
  }
}

#app #dimensionality /deep/.ant-tabs-ink-bar {
  display: none !important;
}

#app #dimensionality {
  margin-top: 18px;
  background: #c1d7ec;
  color: #000;
  font-size: 14px;
  /deep/.ant-tabs-tab-next {
    right: 0;
  }
  /deep/.ant-tabs-tab-prev.ant-tabs-tab-arrow-show,
  /deep/.ant-tabs-tab-next.ant-tabs-tab-arrow-show {
    background: #fff;
  }
}
/deep/.ant-table-column-title {
  font-weight: 600;
}
</style>
