import {
  getIndexAnalysisDates,
  getIndexAnalysisParentDept,
  getIndexAnalysisDept,
  getIndexAnalysisProjectType,
  getIndexAnalysisMedia,
  getIndexAnalysisIndexData,
  getIndexAnalysisDataList,
} from "@/service/effect/proportion.js";

const indexProportion = {
  namespaced: true,
  state: {
    dateList: {},
    firstDeptList: [],
    secondDeptList: [],
    projectTypeList: [],
    mediaList: [],
    quotaList:[],
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
      state.chartData = payload;
    },
  },
  actions: {
    // 获取时间
    async getIndexAnalysisDates(context) {
      try {
        const res = await getIndexAnalysisDates();
        context.commit("SET_DATE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取1级部门
    async getIndexAnalysisParentDept(context, obj) {
      try {
        const res = await getIndexAnalysisParentDept(obj);
        context.commit("SET_FIRST_DEPT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取2级部门
    async getIndexAnalysisDept(context, obj) {
      try {
        const res = await getIndexAnalysisDept(obj);
        context.commit("SET_SECOND_DEPT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取项目类型
    async getIndexAnalysisProjectType(context, obj) {
      try {
        const res = await getIndexAnalysisProjectType(obj);
        context.commit("SET_PROJECT_TYPE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取媒体列表
    async getIndexAnalysisMedia(context, obj) {
      try {
        const res = await getIndexAnalysisMedia(obj);
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
    async getIndexAnalysisIndexData(context, obj) {
      try {
        const res = await getIndexAnalysisIndexData(obj);
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
    async getIndexAnalysisDataList(context, obj) {
      try {
        const res = await getIndexAnalysisDataList(obj);
        context.commit("SET_CHART_DATA_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
  },
};

export default indexProportion;
