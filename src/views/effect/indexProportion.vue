<template>
  <div>
    <div class="search-box effect">
      <div class="top">
        <a-checkbox-group
          :options="checkboxOption"
          @change="checkboxChange"
          :value="analysisTypeIds"
        ></a-checkbox-group>
      </div>
      <div class="bottom">
        <div>
          <!-- 日期选择 -->
          <a-range-picker
            style="width: 230px"
            v-model="rangeDate"
            :disabledDate="disabledDate"
          />

          <!-- 事业部 -->
          <a-select
            v-model="businessIds"
            :disabled="analysisTypeIds.join('') === '3'"
            placeholder="事业部名称"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
            @change="businessChange"
          >
            <a-select-option
              v-for="item in firstDeptList"
              :key="`first${item.parentDeptId}`"
              :value="item.parentDeptId"
            >
              {{ item.parentDeptName }}
            </a-select-option>
          </a-select>

          <!-- 部门 -->
          <a-select
            v-model="departmentIds"
            :disabled="
              analysisTypeIds.join('') === '1' ||
                analysisTypeIds.join('') === '3'
            "
            placeholder="部门名称"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
          >
            <a-select-option
              v-for="item in departmentOptions"
              :key="`second${item.id}`"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>

          <!-- 项目类型 -->
          <a-select
            v-model="projectTypeIds"
            placeholder="项目类型"
            mode="multiple"
            style="width: 160px"
            :maxTagCount="1"
          >
            <a-select-option
              v-for="item in projectTypeList"
              :key="item.campaignTypeId"
              :value="item.campaignTypeId"
            >
              {{ item.campaignTypeName }}
            </a-select-option>
          </a-select>

          <!-- 媒体 -->
          <MediaComponent
            placeholder="请选择媒体"
            :options="mediaList"
            v-model="mediaValues"
            mode="multiple"
          ></MediaComponent>

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
          <a-button @click="resetSearch">重置</a-button>
          <a-button type="primary" @click="search">查询</a-button>
        </div>
      </div>
    </div>
    <div class="charts-ctn">
      <a-spin :spinning="chartData.length === 0">
        <div class="charts-wrap">
          <div v-for="item in chartDatas" :key="`ring-${item.subIndexId}`">
            <RingCharts
              v-if="item && item.list"
              :title="item.title"
              :datasource="item.list"
              :id="`ring-${item.subIndexId}`"
            ></RingCharts>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import RingCharts from "@/components/RingCharts/index.vue";
import MediaComponent from "@/components/MediaComponent";
import QuotaComponent from "@/components/QuotaComponent";
import moment from "moment";

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
};

export default {
  name: "IndexProportion",
  computed: {
    ...mapState("indexProportion", {
      dateList: "dateList",
      firstDeptList: "firstDeptList",
      secondDeptList: "secondDeptList",
      projectTypeList: "projectTypeList",
      mediaList: "mediaList",
      quotaList: "quotaList",
      chartData: "chartData",
    }),
    chartDatas() {
      const { chartData } = this;

      const newData = chartData.map((item) => {
        return {
          ...item,
          title: `${item.subIndexName}（${unitMap[item.subIndexId]}）`,
        };
      });

      if (chartData.length % 2 === 0) {
        return newData;
      } else {
        return [...newData, {}];
      }
    },
    checkboxOption() {
      return [
        { label: "事业部", value: 1 },
        { label: "部门", value: 2 },
        { label: "媒体", value: 3 },
      ];
    },
    departmentOptions() {
      const { businessIds, secondDeptList } = this;
      const list = secondDeptList
        .map((first) => {
          return first.list.map((second) => {
            return {
              name: second.deptName,
              id: second.deptId,
              parentId: first.parentDeptId,
            };
          });
        })
        .flat();

      let newList = [];

      if (businessIds.length === 0) {
        newList = [...list];
      } else {
        list.forEach((item) => {
          businessIds.forEach((value) => {
            if (item.parentId === value) {
              newList.push(item);
            }
          });
        });
      }

      return newList;
    },
  },
  data() {
    return {
      analysisTypeIds: [1],
      rangeDate: [],
      businessIds: [],
      departmentIds: [],
      projectTypeIds: [],
      mediaValues: [],
      quotaValues: [],
    };
  },
  mounted() {
    const { analysisTypeIds } = this;

    this.getIndexAnalysisDates();
    this.getIndexAnalysisParentDept({
      analysisTypeId: analysisTypeIds.toString(),
    });
    this.getIndexAnalysisDept({
      analysisTypeId: analysisTypeIds.toString(),
    });
    this.getIndexAnalysisProjectType();
    this.getIndexAnalysisMedia();
    this.getIndexAnalysisIndexData();
  },
  beforeDestroy() {
    this.$store.commit("indexProportion/SET_CHART_DATA_LIST", []);
  },
  methods: {
    ...mapActions("indexProportion", [
      "getIndexAnalysisDates",
      "getIndexAnalysisParentDept",
      "getIndexAnalysisDept",
      "getIndexAnalysisProjectType",
      "getIndexAnalysisMedia",
      "getIndexAnalysisIndexData",
      "getIndexAnalysisDataList",
    ]),
    checkboxChange(values) {
      this.resetSearch();

      if (values.length === 1) {
        this.analysisTypeIds = values;
      }
      if (values.length === 2) {
        const { analysisTypeIds } = this;
        const currentValue = analysisTypeIds[0];

        values.some((value) => {
          if (value != currentValue) {
            if (value === 1) {
              this.businessIds = [];
            }
            if (value === 2) {
              this.businessIds = [];
            }
            if (value === 3) {
              this.mediaValues = [
                { id: "3", name: "效果通" },
                { id: "6", name: "百度" },
                { id: "7", name: "汽车之家" },
              ];
            }
            this.analysisTypeIds = [value];
          }
        });
      }

      this.getIndexAnalysisParentDept({
        analysisTypeId: this.analysisTypeIds.toString(),
      });
      this.getIndexAnalysisDept({
        analysisTypeId: this.analysisTypeIds.toString(),
      });

      this.search();
    },
    businessChange() {
      const { departmentOptions, departmentIds } = this;

      const newDepValue = [];

      departmentOptions.forEach((item) => {
        const { id } = item;

        departmentIds.some((value) => {
          if (id === value) {
            newDepValue.push(value);
            return;
          }
        });
      });

      this.departmentIds = newDepValue;
    },
    resetSearch() {
      const { dateList } = this;
      const { endTime } = dateList;

      this.rangeDate = [moment(endTime), moment(endTime)];
      this.businessIds = [];
      this.departmentIds = [];
      this.projectTypeIds = [];
      this.mediaValues = [];
      this.quotaValues = [];
    },
    search() {
      const {
        analysisTypeIds,
        rangeDate,
        businessIds,
        departmentIds,
        projectTypeIds,
        mediaValues,
        quotaValues,
      } = this;

      const subIndexIdList = quotaValues.map((item) => item.id);
      const mediaIdList = mediaValues.map((item) => item.id);

      this.$store.commit("indexProportion/SET_CHART_DATA_LIST", []);

      const searchObj = {
        flowTypeId: this.$store.state.effectDataType,
        analysisTypeId: analysisTypeIds.toString(),
        time: `${moment(rangeDate[0]).format("YYYY-MM-DD")},${moment(
          rangeDate[1]
        ).format("YYYY-MM-DD")}`,
        parentDeptId: businessIds.toString(),
        deptId: departmentIds.toString(),
        campaignTypeId: projectTypeIds.toString(),
        mediaId: mediaIdList.toString(),
        subIndexId: subIndexIdList.toString(),
      };

      this.getIndexAnalysisDataList(searchObj);
    },
    disabledDate(current) {
      const { dateList } = this;
      const { endTime, startTime } = dateList;
      return (
        (current && current < moment(startTime)) || current > moment(endTime)
      );
    },
    quotaConfirm(values) {
      this.quotaValues = values;
    },
  },
  components: {
    RingCharts,
    MediaComponent,
    QuotaComponent,
  },
  watch: {
    dateList(newVal) {
      const { endTime = null } = newVal;

      if (endTime) {
        this.rangeDate = [moment(endTime), moment(endTime)];
        this.search();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.charts-ctn {
  width: 100%;
  overflow-x: auto;
  .charts-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    min-width: 1435px;
    min-height: 340px;

    & > div {
      width: 660px;
      flex-shrink: 0;
      flex-grow: 1;
      margin: 0 5px 10px;
    }
  }
}
</style>
