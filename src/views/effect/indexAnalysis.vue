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
        </div>
        <div>
          <a-button @click="resetSearch">重置</a-button>
          <a-button type="primary" @click="search">查询</a-button>
        </div>
      </div>
    </div>

    <div class="charts-ctn">
      <a-spin :spinning="chartData.length != 4">
        <div class="charts-wrapper" v-if="chartData.length === 4">
          <ScatterChartsDouble
            v-for="(item, index) in chartData"
            :key="`scatter${index}`"
            :id="`scatter${index}`"
            :datasource="item"
            :quotaOptions="quotaList"
            :quotaValues="quotaValues[index]"
            @change="chartChange(...arguments, index)"
          ></ScatterChartsDouble>
        </div>
        <div v-else style="width: 100%; height: 300px"></div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MediaComponent from "@/components/MediaComponent";
import ScatterChartsDouble from "@/components/ScatterChartsDouble/index.vue";
import moment from "moment";

const defaultQuotaValues = [
  [
    { name: "曝光量", id: "3", parentId: "2" },
    { name: "曝光成本", id: "14", parentId: "2" },
  ],
  [
    { name: "点击量", id: "6", parentId: "3" },
    { name: "点击率", id: "25", parentId: "3" },
  ],
  [
    { name: "线索量", id: "8", parentId: "4" },
    { name: "留资率", id: "27", parentId: "4" },
  ],
  [
    { name: "成交量", id: "12", parentId: "6" },
    { name: "成交率", id: "31", parentId: "5" },
  ],
];

export default {
  name: "IndexAnalysis",
  computed: {
    ...mapState("doubleAnalysis", {
      dateList: "dateList",
      firstDeptList: "firstDeptList",
      secondDeptList: "secondDeptList",
      projectTypeList: "projectTypeList",
      mediaList: "mediaList",
      quotaList: "quotaList",
      chartData: "chartData",
    }),
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
      quotaValues: defaultQuotaValues,
    };
  },
  mounted() {
    const { analysisTypeIds } = this;

    this.getDoubleIndexDates();
    this.getDoubleIndexParentDept({
      analysisTypeId: analysisTypeIds.toString(),
    });
    this.getDoubleIndexDept({
      analysisTypeId: analysisTypeIds.toString(),
    });
    this.getDoubleIndexProjectType();
    this.getDoubleIndexMedia();
    this.getDoubleIndexSubIndexData();
  },
  methods: {
    ...mapActions("doubleAnalysis", [
      "getDoubleIndexDates",
      "getDoubleIndexParentDept",
      "getDoubleIndexDept",
      "getDoubleIndexProjectType",
      "getDoubleIndexMedia",
      "getDoubleIndexSubIndexData",
      "getDoubleIndexDataList",
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

      this.getDoubleIndexParentDept({
        analysisTypeId: this.analysisTypeIds.toString(),
      });
      this.getDoubleIndexDept({
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
      this.quotaValues = defaultQuotaValues;
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

      this.$store.commit("doubleAnalysis/SET_DEFAULT_CHART_DATA_LIST");

      const mediaIdList = mediaValues.map((item) => item.id);

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
      };

      quotaValues.forEach((item, index) => {
        this.getDoubleIndexDataList({
          params: {
            ...searchObj,
            xSubIndexId: item[0].id,
            ySubIndexId: item[1].id,
          },
          index,
        });
      });
    },
    disabledDate(current) {
      const { dateList } = this;
      const { endTime, startTime } = dateList;
      return (
        (current && current < moment(startTime)) || current > moment(endTime)
      );
    },
    chartChange(values, index) {
      const quotaValues = JSON.parse(JSON.stringify(this.quotaValues));
      const { xAxis, yAxis } = values;

      const {
        analysisTypeIds,
        rangeDate,
        businessIds,
        departmentIds,
        projectTypeIds,
        mediaValues,
      } = this;

      const mediaIdList = mediaValues.map((item) => item.id);

      if (xAxis) {
        quotaValues[index][0] = xAxis[0];
      }

      if (yAxis) {
        quotaValues[index][1] = yAxis[0];
      }

      this.quotaValues = quotaValues;

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
        xSubIndexId: quotaValues[index][0].id,
        ySubIndexId: quotaValues[index][1].id,
      };

      this.getDoubleIndexDataList({
        params: searchObj,
        index,
      });
    },
  },
  components: {
    MediaComponent,
    ScatterChartsDouble,
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
  margin-top: 20px;
  width: 100%;
  overflow-x: auto;

  .charts-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-width: 1435px;

    .scatter-ctn {
      flex-shrink: 0;
      flex-grow: 1;
      margin: 0 5px 10px;
    }
  }
}
</style>