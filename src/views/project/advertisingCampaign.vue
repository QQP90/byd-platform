<template>
  <div>
    <div class="search-box">
      <div>
        <!-- 开始日 -->
        <span style="margin-right:8px">项目开始日</span>
        <a-date-picker
          v-model="startTime"
          style="width: 140px"
          class="startTime"
          :disabled-date="disabledStarTime"
          format="YYYY-MM-DD"
        />
        <!-- 结束日 -->
        <span style="margin-right:8px">项目结束日</span>
        <a-date-picker
          v-model="endTime"
          :disabled-date="disabledEndTime"
          format="YYYY-MM-DD"
          style="width: 140px"
          class="endTime"
        />
        <!-- 事业部门 -->
        <a-select
          style="width: 160px"
          mode="tags"
          v-model="sentData.parentDeptId"
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
        <!-- 部门 -->
        <a-select
          style="width: 160px"
          v-model="sentData.deptId"
          placeholder="部门名称"
          mode="tags"
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

        <!-- 状态 -->
        <a-select
          v-model="sentData.putState"
          placeholder="投放状态"
          style="width:160px"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="(item, index) in putData"
            :value="item.putStateId"
            :key="index"
          >
            {{ item.putStateName }}
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
      rowKey="campaignId"
      :loading="loading"
      @change="tableChange"
      :scroll="{ x: 'max-content' }"
      :pagination="{
        pageSize: 10,
        current: sentData.currentPage,
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      }"
    >
    </a-table>
  </div>
</template>

<script>
import adverListApi from "@/service/project/advertisingList";
import moment from "moment";
import QuotaComponent from "@/components/QuotaComponent";
import trandAnalysis from "@/assets/js/trandAnalysis";
import MediaComponent from "@/components/MediaComponent/index";
import { mapState } from "vuex";

export default {
  name: "advertisingCampaign",
  data() {
    return {
      dataSource: [],
      keyIndexDayDataList: {},
      putData: [], //投放数据
      columns: [],
      keyIndexMedia: [], // 媒体组件数据
      startTime: null,
      endTime: null,
      deptSec: [],
      projectDeptDate: [],
      loading: false,
      quotaValues: [
        { name: "PV", id: "2" },
        { name: "UV", id: "5" },
        { name: "线索量", id: "8" },
        { name: "有效线索量", id: "9" },
        { name: "（促进）成交量", id: "12" },
      ],
      quotaList: [],
      total: 0,
      sorterInfo: {}, // 排序信息
      sentData: {
        flowTypeId: 1,
        mediaId: [], //媒体
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门

        putState: [],
        pageSize: 10,
        currentPage: 1,
        orderIndexId: "",
        orderValue: "",
      },
    };
  },
  components: {
    MediaComponent,
    QuotaComponent,
  },

  mounted() {
    this.queryData();
  },
  methods: {
    moment,
    async queryData() {
      // 一级部门
      await this.getAdCampaignParentDeptData();
      // 二级部
      await this.getAdCampaignDeptData();
      // // 媒体数据
      await this.getAdCampaignMediaData();
      // 监测
      await this.getAdCampaignSubIndexData();
      // 状态
      await this.getPutStatesData();
      await this.getAdCampaignTimeData();
    },
    // 比较时间
    disabledStarTime(startValue) {
      const endValue = this.startTime;
      return (
        startValue.valueOf() < moment(endValue, "YYYY-MM-DD") ||
        startValue.valueOf() > moment(this.endTime, "YYYY-MM-DD")
      );
    },
    //比较时间
    disabledEndTime(endValue) {
      const startValue = moment(this.startTime);

      return (
        endValue > moment(this.keyIndexDayDataList.endTime, "YYYY-MM-DD") ||
        startValue.valueOf() >= endValue.valueOf()
      );
    },
    getPutStatesData() {
      adverListApi.getPutStatesData().then((res) => {
        this.putData = res.data;
      });
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

    // reset
    reset() {
      this.sentData = {
        flowTypeId: 1,
        mediaId: [], //媒体
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
      };
      this.search();
    },
    // 搜索
    search() {
      this.loading = true;
      // this.getColumnsTitle();
      let obj = this.returnData();
      this.columns = this.getColumnsTitle();
      adverListApi
        .getAdCampaignDataList(obj)
        .then((res) => {
          this.dataSource = res.data.list;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.dataSource = [];
          this.total = 0;
        });
    },
    quotaConfirm(values) {
      this.quotaValues = values;
    },
    // 时间
    getAdCampaignTimeData() {
      adverListApi.getAdCampaignTimeData().then((res) => {
        this.keyIndexDayDataList = res.data[0];
        this.startTime = moment(
          moment(res.data[0].startTime).format("YYYY-MM-DD")
        );
        this.endTime = moment(moment(res.data[0].endTime).format("YYYY-MM-DD"));
        setTimeout(() => {
          this.search();
        }, 500);
      });
    },
    // 更改时间
    changeTime(val) {
      this.startTime = moment(val[0]).format("YYYY-MM-DD");
      this.endTime = moment(val[1]).format("YYYY-MM-DD");
    },
    // 请求参数
    returnData() {
      let newArr = [];
      this.quotaValues.forEach((v) => {
        newArr.push(v.id);
      });
      let sentData = {
        staterTime: moment(this.startTime).format("YYYY-MM-DD"),
        endTime: moment(this.endTime).format("YYYY-MM-DD"),
        mediaId: this.fliterMedia(this.sentData.mediaId).join(","),
        deptId: this.sentData.deptId.join(","),
        parentDeptId: this.sentData.parentDeptId.toString(),
        subIndexId: newArr.toString(),
        // flowTypeId: this.sentData.flowTypeId,
        putState: this.sentData.putState.toString(),
        currentPage: this.sentData.currentPage,
        pageSize: this.sentData.pageSize,
        orderIndex: this.sentData.orderIndex,
        orderValue: this.sentData.orderValue,
      };
      return sentData;
    },
    // 一级部门
    getAdCampaignParentDeptData() {
      adverListApi.getAdCampaignParentDeptData().then((res) => {
        this.projectDeptDate = res.data;
      });
    },
    // 二级部门
    getAdCampaignDeptData() {
      this.deptSec = [];
      let obj = {};
      if (this.sentData.parentDeptId.length) {
        obj = { parentDeptId: this.sentData.parentDeptId.toString() };
      }
      adverListApi.getAdCampaignDeptData(obj).then((res) => {
        res.data.forEach((v) => {
          v.list.forEach((item) => {
            this.deptSec.push(item);
          });
        });
      });
    },
    // 媒体组件数据
    getAdCampaignMediaData() {
      adverListApi.getAdCampaignMediaData().then((res) => {
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
      this.getAdCampaignDeptData();
    },
    getAdCampaignSubIndexData() {
      adverListApi.getAdCampaignSubIndexData().then((res) => {
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
      let columns = [
        {
          title: "广告活动名称",
          width: 500,
          align: "center",
          key: "campaignName",
          dataIndex: "campaignName",
          fixed: "left",
        },
        {
          title: "广告活动周期",

          align: "center",
          key: "timePeriod",
          dataIndex: "timePeriod",
        },
        {
          title: "活动状态",

          align: "center",
          key: "putState",
          dataIndex: "putState",
        },
      ];
      defaultColumns.forEach((v) => {
        this.quotaValues.forEach((item) => {
          if (item.id == v.sorterId) {
            columns.push(v);
          }
        });
      });

      console.log(columns);

      return columns;
    },
  },
  watch: {
    effectDataType(val) {
      // 正常流量，非正常切换
      this.sentData.flowTypeId = val;
    },
    // quotaValues() {
    //   this.search();
    // },
  },
  computed: {
    ...mapState(["effectDataType"]),
    // 获取表头
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
  line-height: 32px;
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
  }
}

/deep/.ant-table-column-title {
  font-weight: 600;
}
</style>
