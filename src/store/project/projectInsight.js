import {
  getCampaignKeyIndexProjectList,
  getCampaignKeyIndexTimeData,
  getCampaignKeyIndexTimePeriod,
  getCampaignKeyIndexSubIndexData,
  getCampaignKeyIndexDataList
} from "@/service/project/projectInsight.js";

const projectInsight = {
  namespaced: true,
  state: {
    dateList: {},
    projectList: {},
    dateTypeList: [],
    quotaList: [],
    keyQuotaDataList: {},
    keyQuotaTableLoading: true,
    keyQuotaChartLoading: true,
  },
  mutations: {
    SET_DATE_LIST(state, payload) {
      state.dateList = payload;
    },
    SET_PROJECT_LIST(state, payload) {
      state.projectList = payload;
    },
    SET_DATE_TYPE_LIST(state, payload) {
      state.dateTypeList = payload;
    },
    SET_QUOTA_LIST(state, payload) {
      state.quotaList = payload;
    },
    SET_KEY_QUOTA_DATA_LIST(state, payload) {
      state.keyQuotaDataList = payload
    },
    SET_KEY_QUOTA_TABLE_LOADING(state, payload) {
      state.keyQuotaTableLoading = payload
    },
    SET_KEY_QUOTA_CHART_LOADING(state, payload) {
      state.keyQuotaChartLoading = payload
    },
  },
  actions: {
    // 获取时间
    async getCampaignKeyIndexTimeData(context) {
      try {
        const res = await getCampaignKeyIndexTimeData();
        context.commit("SET_DATE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 项目列表
    async getCampaignKeyIndexProjectList(context, obj) {
      try {
        const res = await getCampaignKeyIndexProjectList(obj);
        context.commit("SET_PROJECT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 时间类型
    async getCampaignKeyIndexTimePeriod(context) {
      try {
        const res = await getCampaignKeyIndexTimePeriod();
        context.commit("SET_DATE_TYPE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取指标
    async getCampaignKeyIndexSubIndexData(context, obj) {
      try {
        const res = await getCampaignKeyIndexSubIndexData(obj);
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
    // 关键指标数据列表
    async getCampaignKeyIndexDataList(context, obj) {
      try {
        const res = await getCampaignKeyIndexDataList(obj);
        context.commit("SET_KEY_QUOTA_DATA_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
  },
};

export default projectInsight;
