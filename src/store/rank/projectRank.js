import {
  getProjectDayDate,
  getProjectIndexData,
  getProjectMonthDate,
  getDayMonthEndRank,
  getProjectDayMonthEndRank,
  getProjectDataList,
  getProjectDataDetailList,
} from "@/service/rank/project";
const filter = (list) => {
  let lis = [];
  list.forEach((item) => {
    let subIndexVos = [];
    if (item.list.length) {
      item.list.forEach((item) => {
        subIndexVos.push({
          indexId: item.indexId,
          id: item.subIndexId,
          name: item.subIndexName,
        });
      });
    }
    lis.push({
      name: item.indexName,
      id: item.indexId,
      children: subIndexVos,
    });
  });
  return lis;
};
const projectStore = {
  namespaced: true,
  state: {
    userId: 0,
    startTime: "",
    endTime: "",
    rankTypeId: "",
    time: "",
    month: "",
    total: 0,
    totalList: 0,
    projectCampaignData: [],
    projectDayDate: [],
    projectIndexData: [],
    projectMonthDate: [],
    dayMonthEndRank: [],
    projectDayMonthEndRank: [],
    projectData: [],
    projectDataDetailList: [],
  },
  mutations: {
    SET_USER_ID(state, payload) {
      state.userId = payload;
    },

    SET_PROJECT_DAY_DATE(state, list) {
      state.projectDayDate = list;
      state.startTime = list[0].startTime;
      state.endTime = list[0].endTime;
      state.time = list;
    },

    SET_PROJECT_INDEX_DATA(state, list) {
      state.projectIndexData = list;
    },
    SET_PROJECT_MONTH_DATE(state, list) {
      state.projectMonthDate = list;
      state.startMonth = list[0].toString();
      state.month = list[list.length - 1].toString();
    },
    SET_DAY_MONTH_END_RANK(state, list) {
      state.dayMonthEndRank = list;
    },
    SET_PROJECT_DAY_MONTH_END_RANK(state, list) {
      state.projectDayMonthEndRank = list;
      state.rankTypeId = list[0].rankTypeId;
    },
    SET_PROJECT_DATA_LIST(state, payload) {
      state.projectData = payload.list;
      state.total = payload.total;
    },
    SET_PROJECT_DATA_DETAIL_LIST(state, payload) {
      state.projectDataDetailList = payload.list;
      state.totalList = payload.total;
    },
  },
  actions: {
    // 获取项目日完结榜时间
    async getProjectDayDate(context) {
      if (context.state.projectDayDate.length) return;
      try {
        const res = await getProjectDayDate();
        context.commit("SET_PROJECT_DAY_DATE", res.data);
      } catch (err) {
        console.error(err);
      }
    },

    // 获取项目监测指标组件数据
    async getProjectIndexData(context, obj) {
      //if (context.state.projectIndexData.length) return;
      try {
        const res = await getProjectIndexData(obj);
        context.commit("SET_PROJECT_INDEX_DATA", filter(res.data));
      } catch (err) {
        console.error(err);
      }
    },
    // 获取项目月完结榜时间
    async getProjectMonthDate(context) {
      if (context.state.projectMonthDate.length) return;
      try {
        const res = await getProjectMonthDate();
        context.commit("SET_PROJECT_MONTH_DATE", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取日，月完结榜
    async getDayMonthEndRank(context) {
      if (context.state.dayMonthEndRank.length) return;
      try {
        const res = await getDayMonthEndRank();
        context.commit("SET_DAY_MONTH_END_RANK", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取项目日，月完结榜
    async getProjectDayMonthEndRank(context) {
      if (context.state.projectDayMonthEndRank.length) return;
      try {
        const res = await getProjectDayMonthEndRank();
        context.commit("SET_PROJECT_DAY_MONTH_END_RANK", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取项目数据列表
    async getProjectDataList(context, obj) {
      try {
        const res = await getProjectDataList(obj);
        
        context.commit("SET_PROJECT_DATA_LIST", res.data);
      } catch (err) {
        context.commit("SET_PROJECT_DATA_LIST", []);
      }
    },
    // 获取项目明细详情列表
    async getProjectDataDetailList(context, obj) {
      try {
        const res = await getProjectDataDetailList(obj);
        // res.data.list.forEach((item, index) => {
        //   const time = new Date().getTime() + Math.random(0, 1) * 10000;
        //   item._time = time;
        // });
        context.commit("SET_PROJECT_DATA_DETAIL_LIST", res.data);
      } catch (err) {
        context.commit("SET_PROJECT_DATA_DETAIL_LIST", []);
      }
    },
  },
};
export default projectStore;
