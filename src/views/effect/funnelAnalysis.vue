<template>
  <div>
    <div class="search-box">
      <div>
        <div style="width:100%" class="trendType">
          <a-checkbox-group :value="sentData.analysisTypeId" @change="onChange">
            <a-checkbox :value="1">
              总体
            </a-checkbox>

            <a-checkbox :value="2">
              事业部
            </a-checkbox>

            <a-checkbox :value="3">
              部门
            </a-checkbox>

            <a-checkbox :value="4">
              媒体
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!-- 时间 -->

        <a-range-picker
          style="width:230px;"
          v-model="sentData.time"
          :disabledDate="disabledDate"
          @change="changeTime"
        />
        <a-select
          style="width: 160px"
          :mode="mode"
          v-model="sentData.parentDeptId"
          :disabled="disabledNum == 2 || disab"
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
        <!-- 二级部门 -->
        <a-select
          style="width: 160px;"
          mode="tags"
          :disabled="disabledNum == 3"
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
          style="width: 160px;margin-right:20px"
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
            {{ item.campaignTypeName }}
          </a-select-option>
        </a-select>
        <MediaComponent
          placeholder="请选择媒体"
          :options="keyIndexMedia"
          v-model="sentData.mediaId"
          mode="multiple"
        >
        </MediaComponent>
      </div>
      <div>
        <a-button @click="reset()"> 重置 </a-button>
        <a-button type="primary" @click.stop="search()"> 查询 </a-button>
      </div>
    </div>

    <div class="ov-x">
      <a-spin :spinning="funnelData.length == 0">
        <div class="funnel">
          <div
            class="funnel_box"
            v-for="item in funnelData"
            :key="item.resourceId"
          >
            <div class="title">{{ item.name }}</div>
            <div class="itemName">
              <span>曝光</span>
              <span>点击</span>
              <span>线索</span>
              <span>有效线索</span>
              <span>试乘试驾</span>
              <span>成交</span>
            </div>
            <div class="funnel-bg">
              <div class="exposure item">
                <span>曝光</span><span>{{ item.imp.totalValue }}</span>
              </div>
              <div class="click item">
                <span>点击</span><span>{{ item.click.totalValue }}</span>
                <div>
                  <span>
                    点击率：{{
                      item.clickRate.totalValue == "-"
                        ? item.clickRate.totalValue
                        : item.clickRate.totalValue + "%"
                    }} </span
                  ><span
                    >点击率均值：{{
                      item.totalClickRate.totalValue == "-"
                        ? item.totalClickRate.totalValue
                        : item.totalClickRate.totalValue + "%"
                    }}</span
                  >
                </div>
              </div>

              <div class="reservedCapital item">
                <span>线索</span><span>{{ item.leads.totalValue }}</span>
                <div>
                  <span
                    >留资率：{{
                      item.retainedRate.totalValue == "-"
                        ? item.retainedRate.totalValue
                        : item.retainedRate.totalValue + "%"
                    }} </span
                  ><span
                    >留资率均值：{{
                      item.totalRetainedRate.totalValue == "-"
                        ? item.totalRetainedRate.totalValue
                        : item.totalRetainedRate.totalValue + "%"
                    }}</span
                  >
                </div>
              </div>
              <div class="thread item">
                <span>有效线索</span><span>{{ item.effLeads.totalValue }}</span>
                <div>
                  <span>
                    有效线索率：{{
                      item.effLeadsRate.totalValue == "-"
                        ? item.effLeadsRate.totalValue
                        : item.effLeadsRate.totalValue + "%"
                    }}</span
                  ><span
                    >有效线索率均值：{{
                      item.totalEffLeadsRate.totalValue == "-"
                        ? item.totalEffLeadsRate.totalValue
                        : item.totalEffLeadsRate.totalValue + "%"
                    }}</span
                  >
                </div>
              </div>
              <div class="turnover item">
                <span>试乘试驾</span><span>{{ item.driveNum.totalValue }}</span>
                <div>
                  <span
                    >试乘试驾率：{{
                      item.driveRate.totalValue == "-" ||
                      item.driveRate.totalValue == "/"
                        ? item.driveRate.totalValue
                        : item.driveRate.totalValue + "%"
                    }}</span
                  >
                  <span
                    >试乘试驾率均值：{{
                      item.totalDriveRate.totalValue == "-" ||
                      item.totalDriveRate.totalValue == "/"
                        ? item.totalDriveRate.totalValue
                        : item.totalDriveRate.totalValue + "%"
                    }}</span
                  >
                </div>
              </div>
              <div class="drive item">
                <span>成交</span><span>{{ item.dealNum.totalValue }}</span>
                <div>
                  <span
                    >成交率：{{
                      item.dealRate.totalValue == "-"
                        ? item.dealRate.totalValue
                        : item.dealRate.totalValue + "%"
                    }}</span
                  >
                  <span
                    >成交率均值：{{
                      item.totalDealRate.totalValue == "-"
                        ? item.totalDealRate.totalValue
                        : item.totalDealRate.totalValue + "%"
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MediaComponent from "@/components/MediaComponent/index";
import {
  getFunnelAnalysisDataList,
  getFunnelAnalysisDates,
  getFunnelAnalysisDeptById,
  getFunnelAnalysisMedia,
  getFunnelAnalysisProjectType,
  getFunnelAnalysisParentDept,
} from "@/service/effect/funnelAnalysis";
import moment from "moment";
export default {
  name: "FunnelAnalysis",
  data() {
    return {
      endTime: "",
      mode: "tags",
      dataTitle: [],
      // 31个指标数据--折线统计图
      lineData: [],
      funnelData: [],
      //组件禁用
      disabledNum: -1,
      keyIndexMedia: [], // 媒体组件数据
      disab: false,
      dateFormat: "YYYY-MM-DD",
      startTime: "",
      viewsType: [
        { name: "日视图", value: 1 },
        { name: "周视图", value: 2 },
        { name: "月视图", value: 3 },
      ],
      dimensionality: "1",
      trendDate: null, //时间
      defaultTime: [],
      indicator: [],
      deptSec: [],
      deptSecArr: [],
      projectDeptDate: [],
      campaignTypes: [],
      medias: [],
      keyIndexDayDataList: [],
      sentData: {
        flowTypeId: 1,
        analysisTypeId: [1], //头部切换
        time: null, //时间
        mediaId: [], //媒体
        campaignTypeId: [], //项目类型
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
      },
    };
  },
  components: {
    MediaComponent,
  },
  async mounted() {
    await this.getFunnelAnalysisDates();
    await this.getFunnelAnalysisParentDept();
    await this.getFunnelAnalysisDeptById();
    await this.getFunnelAnalysisProjectType();
    await this.getFunnelAnalysisMedia();
  },
  methods: {
    moment,
    // 时间
    getFunnelAnalysisDates() {
      getFunnelAnalysisDates().then((res) => {
        this.startTime = moment(res.data.startTime).format("YYYY-MM-DD");
        this.endTime = moment(res.data.endTime).format("YYYY-MM-DD");
        this.sentData.time = [moment(this.endTime), moment(this.endTime)];
        this.keyIndexDayDataList = res.data;
        this.defaultTime = [
          moment(this.endTime)
            .subtract(30, "days")
            .format("YYYY-MM-DD"),
          this.endTime,
        ];
        this.getFunnelAnalysisDataList();
      });
    },
    returnData() {
      let selecTtime = [
        moment(this.sentData.time[0]).format("YYYY-MM-DD"),
        moment(this.sentData.time[1]).format("YYYY-MM-DD"),
      ];
      let sentData = {
        analysisTypeId: this.sentData.analysisTypeId.toString(),
        time: selecTtime.join(","), //关键切换
        mediaId: this.fliterMedia(this.sentData.mediaId).join(","),
        campaignTypeId: this.sentData.campaignTypeId.join(","),
        deptId: this.sentData.deptId.join(","),
        parentDeptId: this.sentData.parentDeptId.toString(),
        flowTypeId: this.sentData.flowTypeId,
      };

      return sentData;
    },
    // 过滤媒体值
    fliterMedia(obj) {
      let arr = [];
      obj.forEach((v) => {
        arr.push(v.id);
      });
      return arr;
    },
    // 总体
    getFunnelAnalysisDataList() {
      let sentData = this.returnData();
      getFunnelAnalysisDataList(sentData).then((res) => {
        this.funnelData = res.data;
      });
    },
    // 一级联动
    deptIdChange(item) {
      this.sentData.deptId = [];
      this.getFunnelAnalysisDeptById();
    },

    // 一级部门
    getFunnelAnalysisParentDept() {
      let obj = {
        analysisTypeId: this.sentData.analysisTypeId.join(","),
      };
      getFunnelAnalysisParentDept(obj).then((res) => {
        this.projectDeptDate = res.data;
      });
    },
    // 二级部门
    getFunnelAnalysisDeptById() {
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
          parentDeptId: this.sentData.parentDeptId,
        };
      }

      getFunnelAnalysisDeptById(obj).then((res) => {
        res.data.forEach((v) => {
          if (v.list.length) {
            v.list.forEach((l) => {
              this.deptSec.push(l);
            });
          }
        });
        // this.deptSecArr = [...this.deptSec];
      });
    },
    // reset
    reset() {
      this.sentData = {
        flowTypeId: 1,
        analysisTypeId: [1], //头部切换
        time: [moment(this.endTime), moment(this.endTime)],
        mediaId: [], //媒体
        campaignTypeId: [], //项目类型
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
      };
      this.search();
    },
    search() {
      this.getFunnelAnalysisDataList();
    },
    // 项目类型
    getFunnelAnalysisProjectType() {
      getFunnelAnalysisProjectType().then((res) => {
        this.campaignTypes = res.data;
      });
    },
    changeTime(val) {
      let startTime = moment(val[0]).format("YYYY-MM-DD");
      let endTime = moment(val[1]).format("YYYY-MM-DD");
      this.sentData.time = [moment(startTime), moment(endTime)];
    },
    onChange(val) {
      let item = val;
      item.forEach((e) => {
        if (this.sentData.analysisTypeId.includes(e)) {
          this.sentData.analysisTypeId = [];
        } else {
          this.sentData.analysisTypeId.push(e);
        }
      });
    },
    // 禁选时间
    disabledDate(current) {
      return (
        moment(this.keyIndexDayDataList.startTime, "YYYY-MM-DD") > current ||
        current > moment(this.keyIndexDayDataList.endTime, "YYYY-MM-DD")
      );
    },
    // 媒体组件数据
    getFunnelAnalysisMedia() {
      getFunnelAnalysisMedia().then((res) => {
        this.keyIndexMedia = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
      });
    },
  },
  watch: {
    effectDataType(val) {
      // 正常流量，非正常切换
      this.sentData.flowTypeId = val;
    },

    "sentData.analysisTypeId"(val) {
      this.getFunnelAnalysisParentDept();
      val = val[0];
      this.disabledNum = -1;
      this.disab = false;
      this.mode = "tags";
      switch (val) {
        case 1:
          break;
        case 2:
          this.disabledNum = 3;
          this.sentData.deptId = [];
          this.sentData.parentDeptId = ["10", "11", "12"];
          break;
        case 3:
          this.mode = "";
          this.sentData.parentDeptId = "13";
          this.getFunnelAnalysisDeptById();
          break;
        case 4:
          this.disabledNum = 3;
          this.disab = true;
          this.sentData.deptId = [];
          this.sentData.parentDeptId = [];
          this.sentData.mediaId = [
            { id: "3", name: "效果通" },
            { id: "6", name: "百度" },
            { id: "7", name: "汽车之家" },
          ];
          break;
        default:
          break;
      }
    },
  },
  computed: {
    ...mapState(["effectDataType"]),
  },
};
</script>

<style lang="less" scoped>
.search-box {
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0;
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
#tendAnalysis {
  background: #fff;
  margin-top: 18px;
  width: 100%;
  height: 300px;
  padding-bottom: 30px;
}
.ov-x {
  overflow-x: auto;
  height: 100%;
  width: 100%;
}
.funnel {
  display: flex;
  min-width: 1340px;
  overflow-x: auto;
  margin-top: 20px;
  flex-wrap: wrap;
  .funnel_box {
    margin-bottom: 20px;
    width: 660px;
    font-size: 14px;
    color: #000;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    &:nth-child(2n + 1) {
      margin-right: 20px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: #212121;
      padding-bottom: 20px;
    }
    .itemName {
      text-align: center;
      padding-bottom: 20px;
      span {
        margin-right: 10px;

        &::before {
          content: "";
          margin-right: 5px;
          display: inline-block;
          width: 20px;
          height: 10px;
          border-radius: 3px;
          background: #94c6ff;
        }
        &:nth-child(2)::before {
          background-color: #469af8;
        }
        &:nth-child(3)::before {
          background-color: #006de8;
        }
        &:nth-child(4)::before {
          background-color: #035cc1;
        }
        &:nth-child(5)::before {
          background-color: #064c9b;
        }
        &:nth-child(6)::before {
          background-color: #003067;
        }
      }
    }
  }
  .funnel-bg {
    width: 423px;
    height: 300px;
    margin: 0 auto;
    background: url("../../assets/img/funnel.png") no-repeat center/100%;
    .item {
      font-size: 14px;
      position: relative;
      > span {
        display: inline-block;
        text-align: left;
        &:nth-child(2) {
          color: #fff;
          text-align: center;
        }
      }
      > div {
        span {
          display: block;
        }
      }
    }
    .exposure {
      > span {
        position: absolute;
        top: 20px;
        left: -30px;
        color: #94c6ff;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: -132px;
        top: 10px;
        color: #94c6ff;
      }
    }
    .click {
      > span {
        position: absolute;
        top: 67px;
        left: 0px;
        color: #469af8;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: -95px;
        top: 63px;
        color: #469af8;
      }
    }
    .reservedCapital {
      > span {
        position: absolute;
        top: 115px;
        left: 30px;
        color: #006de8;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: -34px;
        top: 108px;
        color: #006de8;
      }
    }

    .thread {
      > span {
        position: absolute;
        top: 165px;
        left: 40px;
        color: #035cc1;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: -45px;
        top: 158px;
        color: #035cc1;
      }
    }
    .turnover {
      > span {
        position: absolute;
        top: 210px;
        left: 70px;
        color: #064c9b;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: -20px;
        top: 204px;
        color: #064c9b;
      }
    }
    .drive {
      > span {
        position: absolute;
        top: 252px;
        left: 130px;
        color: #003067;
        &:nth-child(2) {
          left: 50%;
          transform: translateX(-50%);
        }
      }
      > div {
        position: absolute;
        right: 40px;
        top: 248px;
        color: #003067;
      }
    }
  }
}
</style>
