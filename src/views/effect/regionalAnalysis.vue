<template>
  <div>
    <div class="search-box ranking">
      <div>
        <a-range-picker
          v-model="dTime"
          :disabledDate="disabledDate"
          format="YYYY-MM-DD"
          :showToday="false"
          style="width: 230px"
        >
        </a-range-picker>
        <a-select
          v-model="parentDeptId"
          :maxTagCount="1"
          placeholder="事业部名称"
          mode="tags"
          style="width: 160px"
          :disabled="
            (analysisTypeId == 10 || analysisTypeId == 11) && typeId != 1
          "
          @change="parentDeptIdChange"
        >
          <a-select-option
            v-for="item in regionalAnalysisParentDept"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
            >{{ item.parentDeptName }}</a-select-option
          >
        </a-select>
        <a-select
          v-model="deptId"
          :maxTagCount="1"
          placeholder="部门名称"
          :disabled="
            (analysisTypeId == 10 || analysisTypeId == 11) && typeId != 1
          "
          mode="tags"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in secondDeptList"
            :key="item.deptId"
            :value="item.deptId"
            >{{ item.deptName }}</a-select-option
          >
        </a-select>
        <a-select
          v-model="campaignTypeId"
          :maxTagCount="1"
          placeholder="请选择项目类型"
          mode="tags"
          style="width: 160px"
        >
          <a-select-option
            v-for="item in regionalAnalysisProjectType"
            :key="item.campaignTypeId"
            :value="item.campaignTypeId"
            >{{ item.campaignTypeName }}</a-select-option
          >
        </a-select>
        <MediaComponent
          placeholder="请选择媒体"
          :options="regionalAnalysisMedia"
          v-model="mediaId"
          mode="multiple"
          style="width: 160px"
        >
        </MediaComponent>
      </div>
      <div>
        <a-button @click="reset"> 重置 </a-button>
        <a-button type="primary" @click="getRegionalAnalysisData">
          查询
        </a-button>
      </div>
    </div>
    <div class="content">
      <p>
        <a-radio-group
          button-style="solid"
          style="margin-right: 10px"
          v-model="typeId"
          @change="typeIdChange"
          ><a-radio-button :value="1"> 地图模式 </a-radio-button
          ><a-radio-button :value="2"> 图表模式 </a-radio-button></a-radio-group
        >
        <quota
          placeholder="监测指标"
          :options="indexDataCpmputed"
          :values="indexId"
          @onConfirm="onConfirm"
          :max="1"
          style="margin-right: 10px"
        ></quota>
        <a-radio-group
          default-value="a"
          button-style="solid"
          style="margin-right: 10px"
          v-if="typeId == 2"
          v-model="analysisTypeId"
          @change="analysisTypeIdChange"
        >
          <a-radio-button
            v-for="item in analysisMainData"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </a-radio-button>
        </a-radio-group>
      </p>
      <a-spin :spinning="loading">
        <div>
          <div class="viewsTypeValue">
            <a-tabs
              type="card"
              v-if="analysisTypeId == '1' || analysisTypeId == '2'"
              v-model="orderValue"
              @change="getRegionalAnalysisData"
            >
              <template v-for="(item, i) in topList">
                <a-tab-pane
                  :key="item.replace('-', ',')"
                  :tab="tabsName(item, i)"
                >
                </a-tab-pane>
              </template>
            </a-tabs>
          </div>
          <!-- <div class="chart-box"> -->
          <BarChartsArea
            v-if="typeId == 2"
            :value="barValue"
            :unit="unitMap[indexId[0].id]"
          ></BarChartsArea>
          <MapChartsArea
            v-if="typeId == 1"
            :value="mapValue"
            :unit="unitMap[indexId[0].id]"
            :unitName="indexId[0].name"
          ></MapChartsArea>
          <!-- </div> -->
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BarChartsArea from "@/components/BarChartsArea/BarChartsArea.vue";
import MapChartsArea from "@/components/MapChartsArea/MapChartsArea.vue";
import MediaComponent from "@/components/MediaComponent/index";
import {
  getAnalysisMainData,
  getRegionalAnalysisData,
  getRegionalAnalysisDates,
  getRegionalAnalysisDeptById,
  getRegionalAnalysisMedia,
  getRegionalAnalysisParentDept,
  getRegionalAnalysisProjectType,
  getDoubleIndexSubIndexData,
} from "@/service/effect/regionalAnalysis";
import moment from "moment";
import quota from "@/components/QuotaComponent";
const unitMap = {
  1: "元",
  2: "次",
  3: "次",
  4: "次",
  5: "次",
  6: "次",
  7: "次",
  8: "个",
  9: "个",
  10: "个",
  11: "个",
  12: "个",
  13: "元",
  14: "元",
  15: "元",
  16: "元",
  17: "元",
  18: "元",
  19: "元",
  20: "元",
  21: "元",
  22: "元",
  23: "元",
  24: "%",
  25: "%",
  26: "%",
  27: "%",
  28: "%",
  29: "%",
  30: "%",
  31: "%",
};
export default {
  name: "RegionalAnalysis",
  components: {
    BarChartsArea,
    MapChartsArea,
    MediaComponent,
    quota,
  },
  data() {
    return {
      typeId: 1, // 选择图表模式 1:地图，2:图表
      barValue: [], // 柱状图数据
      mapValue: [], // 地图数据
      dTime: null, // 时间选择
      analysisMainData: [], // 分析主体数据
      analysisTypeId: null, // 分析主体选择
      regionalAnalysisDates: [], // 时间组件数据
      regionalAnalysisDeptById: [], //  二级部门列表
      mediaId: [], // 媒体选择列表
      regionalAnalysisMedia: [], // 媒体数据列表
      regionalAnalysisProjectType: [], // 项目类型数据
      regionalAnalysisParentDept: [], // 一级部门数据
      parentDeptId: [], // 一级部门选项
      deptId: [], // 二级部门id
      campaignTypeId: [], // 项目类型
      indexId: [{ id: "3", parentId: "3", name: "曝光量" }], // 查询指标id
      orderValue: null, // TopN选择
      subIndexData: [], // 监测指标数据
      topList: [], // TOP数组
      unitMap, // 图表单位
      loading: true, // 加载状态
    };
  },
  methods: {
    // 获取分析主体的数据内容
    async getAnalysisMainData() {
      try {
        const res = await getAnalysisMainData();
        this.analysisMainData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 区域分析数据查询
    async getRegionalAnalysisData() {
      this.loading = true;
      try {
        const {
          dTime,
          parentDeptId,
          deptId,
          campaignTypeId,
          mediaId,
          typeId,
          analysisTypeId,
          orderValue,
          indexId,
          flowTypeId,
        } = this;
        const obj = {
          flowTypeId,
          dTime: [
            moment(dTime[0]).format("YYYY-MM-DD"),
            moment(dTime[1]).format("YYYY-MM-DD"),
          ].join(","),
          campaignTypeId: campaignTypeId.join(","),
          mediaId: mediaId.length
            ? mediaId.map((item) => item.id).join(",")
            : "",
          typeId,
          analysisTypeId,
          orderValue,
          indexId: indexId.length
            ? indexId.map((item) => item.id).join(",")
            : "",
        };
        if (deptId.length) {
          obj.deptId = deptId.join(",");
        } else {
          obj.parentDeptId = parentDeptId.join(",");
        }
        if (typeId == 1) {
          obj.analysisTypeId = "";
          obj.orderValue = "";
        }
        const res = await getRegionalAnalysisData(obj);
        if (typeId == 1) {
          this.mapValue = res.data;
        } else {
          this.barValue = res.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    // 查询时间组件数据
    async getRegionalAnalysisDates() {
      try {
        const res = await getRegionalAnalysisDates();
        this.regionalAnalysisDates = res.data;
        this.dTime = [
          moment(this.regionalAnalysisDates.endTime),
          moment(this.regionalAnalysisDates.endTime),
        ];
      } catch (error) {
        console.error(error);
      }
    },
    // 获取二级部门数据
    async getRegionalAnalysisDeptById() {
      try {
        const res = await getRegionalAnalysisDeptById();
        this.regionalAnalysisDeptById = res.data;
        // res.data.forEach((item) => {
        //   this.regionalAnalysisDeptById = [
        //     ...this.regionalAnalysisDeptById,
        //     ...item.list,
        //   ];
        // });
      } catch (error) {
        console.error(error);
      }
    },
    // 查询媒体组件数据
    async getRegionalAnalysisMedia() {
      try {
        const res = await getRegionalAnalysisMedia();
        this.regionalAnalysisMedia = res.data.map((item) => {
          return {
            id: item.mediaId,
            name: item.mediaName,
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 查询一级部门组件数据
    async getRegionalAnalysisParentDept() {
      try {
        const res = await getRegionalAnalysisParentDept();
        this.regionalAnalysisParentDept = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 查询项目类型组件数据
    async getRegionalAnalysisProjectType() {
      try {
        const res = await getRegionalAnalysisProjectType();
        this.regionalAnalysisProjectType = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 禁用时间
    disabledDate(current) {
      return (
        moment(this.regionalAnalysisDates.startTime, "YYYY-MM-DD") > current ||
        current > moment(this.regionalAnalysisDates.endTime, "YYYY-MM-DD")
      );
    },
    // 一级部门选择变更
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
    // 获取指标数据
    async getDoubleIndexSubIndexData() {
      try {
        const res = await getDoubleIndexSubIndexData();
        this.subIndexData = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    // 分析主体选项改变
    analysisTypeIdChange() {
      let val = undefined;
      if (this.analysisTypeId == 10 || this.analysisTypeId == 11) {
        this.setDeptNull();
      }
      for (let i = 0, len = this.analysisMainData.length; i < len; i++) {
        if (
          this.analysisMainData[i].id == this.analysisTypeId &&
          this.analysisMainData[i].value
        ) {
          val = this.analysisMainData[i].value;
        }
      }
      this.topValCompute(val);
      this.getRegionalAnalysisData();
    },
    // 检测指标改变
    onConfirm(val) {
      this.indexId = val;
    },
    // 计算TOP数组
    topValCompute(num) {
      let lis = [];
      let val = null;
      if (num != undefined) {
        for (let i = 1; i < num; i = i + 10) {
          if (i + 9 < num) {
            lis.push(`${i}-${i + 9}`);
          } else {
            lis.push(`${i}-${num}`);
          }
        }
        val = lis[0].replace("-", ",");
      }
      this.orderValue = val;
      this.topList = lis;
    },
    // 重置选项
    reset() {
      this.dTime = [
        moment(this.regionalAnalysisDates.endTime),
        moment(this.regionalAnalysisDates.endTime),
      ];
      this.setDeptNull();
      this.campaignTypeId = [];
      this.mediaId = [];
      this.indexId = [{ id: "3", parentId: "3", name: "曝光量" }];
      this.analysisTypeId = "10";
      this.orderValue = null;
    },
    // 设置部门默认
    setDeptNull() {
      this.parentDeptId = [];
      this.deptId = [];
    },
    // 图表类型改变
    typeIdChange() {
      if (this.typeId == 1) {
        this.analysisTypeId = null;
      } else {
        this.analysisTypeId = "10";
      }
      this.reset();
      this.getRegionalAnalysisData();
    },
  },
  computed: {
    ...mapState({
      flowTypeId: (state) => state.effectDataType,
    }),
    // 二级部门
    secondDeptList() {
      const { parentDeptId, regionalAnalysisDeptById } = this;
      let lis = [];
      if (parentDeptId.length) {
        for (let i = 0, len = parentDeptId.length; i < len; i++) {
          for (
            let index = 0, len = regionalAnalysisDeptById.length;
            index < len;
            index++
          ) {
            if (
              Number(parentDeptId[i]) ===
              Number(regionalAnalysisDeptById[index].parentDeptId)
            ) {
              lis = [...lis, regionalAnalysisDeptById[index]];
            }
          }
        }
      } else {
        lis = [...regionalAnalysisDeptById];
      }
      return lis;
    },
    // 检测指标
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
    tabsName(val, i) {
      return function (val, i) {
        if (i == 0) {
          return "TOP " + val;
        } else {
          return val;
        }
      };
    },
  },
  async mounted() {
    this.getRegionalAnalysisMedia();
    this.getRegionalAnalysisParentDept();
    this.getDoubleIndexSubIndexData();
    this.getRegionalAnalysisProjectType();
    this.getAnalysisMainData();
    this.getRegionalAnalysisDeptById();
    await this.getRegionalAnalysisDates();
    this.getRegionalAnalysisData();
  },
  watch: {
    parentDeptId(newVal, val) {
      console.log(newVal, val);
    },
  },
};
</script>
<style lang="less" scoped>
// .search-box {
//   width: 100%;
//   min-height: 60px;
//   background: #ffffff;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px 20px 0;
//   > div {
//     display: flex;
//     flex-wrap: wrap;
//     > * {
//       margin-right: 20px;
//       margin-bottom: 10px;
//     }
//     > *:last-child {
//       margin-right: 0;
//     }
//   }
//   > div:last-child {
//     width: 168px;
//     flex-shrink: 0;
//   }
// }
.content {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  > p:first-child {
    display: flex;
  }
  /deep/ .ant-radio-button-wrapper:first-child {
    border-radius: 2px 0px 0px 2px;
  }
  /deep/ .ant-radio-button-wrapper:last-child {
    border-radius: 0px 2px 2px 0px;
  }
  /deep/
    .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: #0073c6;
    border-color: #0073c6;
  }
}
#app .viewsTypeValue {
  background: #fff;
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
    padding: 0;
    text-align: center;
  }
  /deep/.ant-tabs-tab-active {
    background: #007acc;
    color: #fff;
  }
  .ant-tabs-ink-bar.ant-tabs-ink-bar-no-animated {
    height: 3px;
  }
  /deep/.ant-tabs-tab {
    border-radius: 0;
    margin-left: -1px;
  }
  /deep/.ant-tabs-tab:first-child {
    margin-left: 0px;
    border-radius: 2px 0px 0px 2px;
  }
  /deep/.ant-tabs-tab:last-child {
    border-radius: 0px 2px 2px 0px;
  }
}
.chart-box {
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
