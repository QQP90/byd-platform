import {
  getDoubleIndexDates,
  getDoubleIndexParentDept,
  getDoubleIndexDept,
  getDoubleIndexProjectType,
  getDoubleIndexMedia,
  getDoubleIndexSubIndexData,
  getDoubleIndexDataList
} from "@/service/effect/doubleAnalysis.js";

const doubleAnalysis = {
  namespaced: true,
  state: {
    dateList: {},
    firstDeptList: [],
    secondDeptList: [],
    projectTypeList: [],
    mediaList: [],
    quotaList: [],
    chartData: [],
  },
  mutations: {
    SET_DATE_LIST(state, payload) {
      state.dateList = payload;
    },
    SET_FIRST_DEPT_LIST(state, payload) {
      state.firstDeptList = payload;
    },
    SET_SECOND_DEPT_LIST(state, payload) {
      state.secondDeptList = payload;
    },
    SET_PROJECT_TYPE_LIST(state, payload) {
      state.projectTypeList = payload;
    },
    SET_MEDIA_LIST(state, payload) {
      state.mediaList = payload;
    },
    SET_QUOTA_LIST(state, payload) {
      state.quotaList = payload;
    },
    SET_CHART_DATA_LIST(state, payload) {
      const chartData = JSON.parse(JSON.stringify(state.chartData));
      chartData[payload.index] = payload.data;
      state.chartData = chartData;
    },
    SET_DEFAULT_CHART_DATA_LIST(state) {
      state.chartData = [];
    },
  },
  actions: {
    // 获取时间
    async getDoubleIndexDates(context) {
      try {
        const res = await getDoubleIndexDates();
        context.commit("SET_DATE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取1级部门
    async getDoubleIndexParentDept(context, obj) {
      try {
        const res = await getDoubleIndexParentDept(obj);
        context.commit("SET_FIRST_DEPT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取2级部门
    async getDoubleIndexDept(context, obj) {
      try {
        const res = await getDoubleIndexDept(obj);
        context.commit("SET_SECOND_DEPT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取项目类型
    async getDoubleIndexProjectType(context, obj) {
      try {
        const res = await getDoubleIndexProjectType(obj);
        context.commit("SET_PROJECT_TYPE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取媒体列表
    async getDoubleIndexMedia(context, obj) {
      try {
        const res = await getDoubleIndexMedia(obj);
        const newList = res.data.map(item => {
          return {
            name: item.mediaName,
            id: item.mediaId
          }
        });
        context.commit("SET_MEDIA_LIST", newList);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取指标
    async getDoubleIndexSubIndexData(context, obj) {
      try {
        const res = await getDoubleIndexSubIndexData(obj);
        const quotaList = []

        res.data.forEach((item) => {
          const { list } = item;
          const children = []
          list.forEach(child => {
            children.push({
              name: child.subIndexName,
              id: child.subIndexId
            })

          })
          quotaList.push({
            name: item.indexName,
            id: item.indexId,
            children
          })
        })
        context.commit("SET_QUOTA_LIST", quotaList);
      } catch (err) {
        console.error(err);
      }
    },
    // 图表数据
    async getDoubleIndexDataList(context, obj) {
      try {
        const res = await getDoubleIndexDataList(obj.params);

        context.commit("SET_CHART_DATA_LIST", {
          data: res.data,
          index: obj.index
        });
      } catch (err) {
        context.commit("SET_DEFAULT_CHART_DATA_LIST")
        console.error(err);
      }
    },
  },
};

export default doubleAnalysis;
