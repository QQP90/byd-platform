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
          style="width:230px"
          v-model="sentData.time"
          :disabledDate="disabledDate"
          @change="changeTime"
        />
        <!-- 一级部门 -->
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
          style="width: 160px"
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
        <a-button @click="reset"> 重置 </a-button>
        <a-button type="primary" @click.stop="search"> 查询 </a-button>
      </div>
    </div>
    <!-- 指标 -->
    <div id="dimensionality">
      <a-tabs v-model="dimensionality" @change="changeDimensionality">
        <template v-for="item in indicator">
          <a-tab-pane :key="item.subIndexId" :tab="item.subIndexName">
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>
    <!-- 天周月 -->
    <div class="viewsTypeValue">
      <a-tabs type="card" v-model="sentData.dateTypeId">
        <template v-for="item in viewsType">
          <a-tab-pane :key="item.value" :tab="item.name"> </a-tab-pane>
        </template>
      </a-tabs>
    </div>
    <a-spin :spinning="dataTitle.length == 0">
      <div id="tendAnalysis"></div>
    </a-spin>
  </div>
</template>

<script>
import {
  effectGetSubIndexData,
  getTrendAnalysisOverallDataList,
  getTrendAnalysisDates,
  getTrendAnalysisDeptById,
  getTrendAnalysisMedia,
  getTrendAnalysisProjectType,
  getTrendAnalysisParentDept,
} from "@/service/effect/trendAnalysis";
import moment from "moment";

import trandAnalysis from "@/assets/js/trandAnalysis";
import MediaComponent from "@/components/MediaComponent/index";
import { mapState, mapMutations } from "vuex";
export default {
  name: "TrendAnalysis",
  data() {
    return {
      endTime: "",
      mode: "tags",
      dimensionalityStr: "", //指标切换当前项
      dimensionalityNum: "1", //指标单位
      dataTitle: [],
      // 31个指标数据--折线统计图
      lineData: [],
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
      // defaultTime: [],
      indicator: [],
      deptSec: [],
      deptSecArr: [],
      defaultSatus: true, //默认状态
      projectDeptDate: [],
      campaignTypes: [],
      medias: [],
      keyIndexDayDataList: [],
      sentData: {
        flowTypeId: 1,
        analysisTypeId: [1], //头部切换
        dateTypeId: 1,
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

  created() {},
  mounted() {
    // 31指标
    this.effectGetSubIndexData();
    this.queryData();
  },
  methods: {
    moment,
    async queryData() {
      if (Object.keys(this.$route.query).length) {
        if (this.$route.query.parentDeptId) {
          this.sentData.parentDeptId = this.$route.query.parentDeptId.split(
            ","
          );
        }
        if (this.$route.query.time) {
          let time = this.$route.query.time.split(",");
          this.startTime = moment(time[0]).format("YYYY-MM-DD");
          this.endTime = moment(time[1]).format("YYYY-MM-DD");
          this.sentData.time = [moment(this.startTime), moment(this.endTime)];
        } else {
          // 时间
          this.getTrendAnalysisDates();
        }
        if (this.$route.query.mediaId) {
          let arr = JSON.parse(this.$route.query.mediaId);
          this.sentData.mediaId = arr;
        }
        if (this.$route.query.deptId) {
          this.sentData.deptId = this.$route.query.deptId.split(",");
        }

        if (this.$route.query.campaignTypeId) {
          this.sentData.campaignTypeId = this.$route.query.campaignTypeId.split(
            ","
          );
        }

        // 一级部门
        await this.getTrendAnalysisParentDept();
        // 媒体数据
        await this.getTrendAnalysisMedia();
        // 二级部
        await this.getTrendAnalysisDeptById();
        // 项目类型
        await this.getTrendAnalysisProjectType();
        await this.getTrendAnalysisOverallDataList();
        if (this.$route.query.dateTypeId) {
          this.dimensionality = this.$route.query.dateTypeId;
          this.changeDimensionality(this.dimensionality);
        }
      } else {
        await this.getTrendAnalysisProjectType();
        // 一级部门
        await this.getTrendAnalysisParentDept();
        // 二级部
        await this.getTrendAnalysisDeptById();
        // 媒体数据
        await this.getTrendAnalysisMedia();
        await this.getTrendAnalysisDates();
      }
    },
    // 禁选时间
    disabledDate(current) {
      return (
        moment(this.keyIndexDayDataList.startTime, "YYYY-MM-DD") > current ||
        current > moment(this.keyIndexDayDataList.endTime, "YYYY-MM-DD")
      );
    },
    // reset
    reset() {
      this.sentData = {
        flowTypeId: 1,
        analysisTypeId: [1], //头部切换
        dateTypeId: 1,
        time: [moment(this.endTime), moment(this.endTime)],
        mediaId: [], //媒体
        campaignTypeId: [], //项目类型
        deptId: [], // 二级部门
        parentDeptId: [], // 一级部门
      };
      this.search();
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
    // 搜索
    search() {
      this.getTrendAnalysisOverallDataList();
    },
    // 时间
    getTrendAnalysisDates() {
      getTrendAnalysisDates().then((res) => {
        this.startTime = moment(res.data.startTime).format("YYYY-MM-DD");
        this.endTime = moment(res.data.endTime).format("YYYY-MM-DD");
        this.keyIndexDayDataList = res.data;
        this.sentData.time = [
          moment(this.endTime).subtract(30, "days"),
          moment(this.endTime),
        ];
        this.getTrendAnalysisOverallDataList();
      });
    },
    // 更改时间
    changeTime(val) {
      let startTime = moment(val[0]).format("YYYY-MM-DD");
      let endTime = moment(val[1]).format("YYYY-MM-DD");
      this.sentData.time = [moment(startTime), moment(endTime)];
    },
    // 请求参数
    returnData() {
      let selecTtime = [
        moment(this.sentData.time[0]).format("YYYY-MM-DD"),
        moment(this.sentData.time[1]).format("YYYY-MM-DD"),
      ];
      let sentData = {
        analysisTypeId: this.sentData.analysisTypeId.toString(),
        dateTypeId: this.sentData.dateTypeId.toString(),
        time: selecTtime.join(","), //关键切换
        mediaId: this.fliterMedia(this.sentData.mediaId).join(","),
        campaignTypeId: this.sentData.campaignTypeId.join(","),
        deptId: this.sentData.deptId.join(","),
        parentDeptId: this.sentData.parentDeptId.toString(),
        flowTypeId: this.sentData.flowTypeId,
      };
      return sentData;
    },
    // 一级部门
    getTrendAnalysisParentDept() {
      let obj = {
        analysisTypeId: this.sentData.analysisTypeId.join(","),
      };
      getTrendAnalysisParentDept(obj).then((res) => {
        this.projectDeptDate = res.data;
      });
    },
    // 总体
    getTrendAnalysisOverallDataList() {
      this.dataTitle = [];

      let sentData = this.returnData();
      getTrendAnalysisOverallDataList(sentData)
        .then((res) => {
          this.lineData = res.data;
          this.dataTitle = res.data[0].dateList;
          if (this.sentData.dateTypeId == 3) {
            this.dataTitle = this.dataTitle.map((v) => {
              return "第" + v + "月";
            });
          }
          if (this.sentData.dateTypeId == 2) {
            this.dataTitle = this.dataTitle.map((v) => {
              return "第" + v + "周";
            });
          }
          this.getData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    changeDimensionality(value) {
      this.dimensionalityNum = value;
      for (let index = 0; index < trandAnalysis.indicatorType.length; index++) {
        if (trandAnalysis.indicatorType[index].index == value) {
          this.dimensionalityStr = trandAnalysis.indicatorType[index].name;
        }
      }
    },
    // 项目类型
    getTrendAnalysisProjectType() {
      getTrendAnalysisProjectType().then((res) => {
        this.campaignTypes = res.data;
      });
    },
    // 二级部门
    getTrendAnalysisDeptById() {
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

      getTrendAnalysisDeptById(obj).then((res) => {
        res.data.forEach((v) => {
          if (v.list.length) {
            v.list.forEach((l) => {
              this.deptSec.push(l);
            });
          }
        });
      });
    },
    // 媒体组件数据
    getTrendAnalysisMedia() {
      getTrendAnalysisMedia().then((res) => {
        this.keyIndexMedia = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
      });
    },
    effectGetSubIndexData() {
      effectGetSubIndexData()
        .then((res) => {
          // 指标
          this.indicator = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
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
      this.getTrendAnalysisDeptById();
      this.sentData.deptId = [];
    },
    getData() {
      let option = {};
      let arrLine = [];
      let arrName = [];
      let textTitle = "";

      this.dimensionalityStr = this.dimensionalityStr || "totalCost";

      this.lineData.forEach((v) => {
        Object.keys(v).forEach((key) => {
          if (key == this.dimensionalityStr) {
            let newArr = [];
            for (let i = 0; i < v[key].length; i++) {
              let objt = {
                tag: v[key][i] == "0-" ? true : false,
                value: v[key][i] == "0-" ? 0 : v[key][i],
                name: `name${i}`,
                symbol: "circle",
              };
              newArr.push(objt);
            }

            let obj = {
              name: v.name,
              type: "line",
              symbol: "none",
              data: newArr,
            };

            arrName.push(v.name);
            arrLine.push(obj);
          }
        });
      });
      this.indicator.forEach((v) => {
        if (v.subIndexId == this.dimensionalityNum) {
          Object.keys(trandAnalysis.unitMap).forEach((key) => {
            if (key == this.dimensionalityNum) {
              textTitle = v.subIndexName + `(${trandAnalysis.unitMap[key]})`;
            }
          });
        }
      });
      let tendAnalysis = this.$echarts.init(
        document.getElementById("tendAnalysis")
      );

      option = {
        title: {
          text: textTitle,
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            color: "#7E8294",
            fontSize: 14,
            marginRight: "30px",
          },
          formatter: (params) => {
            let arr = [];
            params.forEach((v) => {
              if (v.data.tag) {
                v.value = "-";
              }
              arr.push(`<div style="padding:10px 0 0;font-size:14px">
              <div>${v.marker} <span style="margin-right:15px">${v.seriesName}</span><span>${v.value}</span><div>
            </div>`);
            });
            arr.unshift(
              `<div style="padding:10px 0 0 10px;font-size:14px">${params[0].axisValue}</div>`
            );
            arr = arr.join("");
            return arr;
          },

          // formatter: this.getTooltip(),
        },
        legend: {
          data: arrName,
          bottom: 0,
          type: "scroll",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dataTitle,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              type: "solid",
            },
          },
          // 背景图虚线
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: arrLine,
      };
      tendAnalysis.setOption(option, true);
    },
  },
  watch: {
    effectDataType(val) {
      // 正常流量，非正常切换
      this.sentData.flowTypeId = val;
    },
    dimensionalityStr() {
      setTimeout(() => {
        this.getData();
      }, 1000);
    },
    "sentData.dateTypeId"(val) {
      this.search();
    },
    "sentData.analysisTypeId"(val) {
      this.getTrendAnalysisParentDept();
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
          this.deptIdChange();
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
  position: relative;
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
  width: 100%;
  height: 425px;
  padding-bottom: 30px;
}

#app .viewsTypeValue {
  text-align: right;
  background: #fff;
  padding-top: 20px;
  /deep/.ant-tabs-tab {
    font-size: 14px;
    color: #000;
    width: 77px;
    line-height: 30px;
    height: 30px;
    margin: 0;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 5px 5px 0 0;
  }
  /deep/.ant-tabs-tab-active {
    background: #007acc;
    color: #fff;
  }
  .ant-tabs-ink-bar.ant-tabs-ink-bar-no-animated {
    height: 3px;
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
</style>
<style lang="less">
#app #dimensionality {
  .ant-tabs-bar {
    .ant-tabs-tab {
      font-size: 14px;
      color: #000;
      margin: 0;
    }
    .ant-tabs-tab-active {
      background: #ffffff;
      border: 0;
    }
    .ant-tabs-ink-bar.ant-tabs-ink-bar-no-animated {
      height: 3px;
    }
  }
}
</style>
