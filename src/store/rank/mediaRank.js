import {
  getMediaChangeRankType,
  getMediaChangeCurrentRankType,
  getMediaChangeMQYRankType,
  getMedaiChangeMonthDate,
  getMedaiChangeQuarterDate,
  getMedaiChangeYearDate,
  getMediaChangeCampaignData,
  getMediaChangeIndexData,
  getMediaMessage,
  getMediaChangeRankDataList,
  getMediaCurrentChangeDataList,
  getMediaInfoDetailList,
  getMediaIndexData,
  getMediaTopList,
} from "@/service/rank/media.js";

const mediaRank = {
  namespaced: true,
  state: {
    analysisSubjectList: [],
    analysisTypeList: [],
    rankTypeList: [],
    campaignList: [],
    quotaList: [],
    yearList: [],
    monthList: [],
    quarterList: [],
    detailData: [],
    detailTableLoading: true,
    mediaList: [],
    rankChangeData: { list: [] },
    singleQuotaList: [],
    doubleQuotaList: [],
    rankData: [],
    rankTableLoading: true,
    dimensionList: [],
  },
  mutations: {
    SET_ANALYSIS_SUBJECT_LIST(state, list) {
      state.analysisSubjectList = list;
    },
    SET_ANALYSIS_TYPE_LIST(state, list) {
      state.analysisTypeList = list;
    },
    SET_RANK_TYPE_LIST(state, list) {
      state.rankTypeList = list;
    },
    SET_CAMPAIGN_LIST(state, list) {
      state.campaignList = list;
    },
    SET_QUOTA_LIST(state, list) {
      state.quotaList = list;
    },
    SET_YEAR_LIST(state, list) {
      state.yearList = list;
    },
    SET_MONTH_LIST(state, list) {
      state.monthList = list;
    },
    SET_QUARTER_LIST(state, list) {
      state.quarterList = list;
    },
    SET_DETAIL_DATA(state, list) {
      state.detailData = list;
    },
    SET_DETAIL_LOADING(state, payload) {
      state.detailTableLoading = payload;
    },
    SET_RANK_CHANGE_DATA(state, list) {
      state.rankChangeData = list;
    },
    SET_RANK_DATA(state, list) {
      state.rankData = list;
    },
    SET_RANK_LOADING(state, payload) {
      state.rankTableLoading = payload;
    },
    SET_MEDIA_LIST(state, list) {
      state.mediaList = list;
    },
    SET_SINGLE_QUOTA_LIST(state, obj) {
      const singleQuotaList = JSON.parse(JSON.stringify(state.singleQuotaList));

      singleQuotaList[obj.index] = obj.data;

      state.singleQuotaList = singleQuotaList;
    },
    SET_DEFAULT_SINGLE_QUOTA_LIST(state) {
      state.singleQuotaList = [];
    },
    SET_DOUBLE_QUOTA_LIST(state, obj) {
      const doubleQuotaList = JSON.parse(JSON.stringify(state.doubleQuotaList));
      doubleQuotaList[obj.index] = obj.data;
      state.doubleQuotaList = doubleQuotaList;
    },
    SET_DEFAULT_DOUBLE_QUOTA_LIST(state) {
      state.doubleQuotaList = [];
    },
    SET_DIMENSION_LIST(state, payload) {
      state.dimensionList = payload;
    },
  },
  actions: {
    // 获取媒体榜单 分析主体
    async getMediaChangeRankType(context) {
      try {
        const res = await getMediaChangeRankType();
        context.commit("SET_ANALYSIS_SUBJECT_LIST", res.data);
      } catch (err) {
        context.commit("SET_ANALYSIS_SUBJECT_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 分析纬度 （当期表现）
    async getMediaChangeCurrentRankType(context) {
      try {
        const res = await getMediaChangeCurrentRankType();
        context.commit("SET_ANALYSIS_TYPE_LIST", res.data);
      } catch (err) {
        context.commit("SET_ANALYSIS_TYPE_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 时间纬度 （月季年）
    async getMediaChangeMQYRankType(context) {
      try {
        const res = await getMediaChangeMQYRankType();
        context.commit("SET_RANK_TYPE_LIST", res.data);
      } catch (err) {
        context.commit("SET_RANK_TYPE_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 类别列表
    async getMediaChangeCampaignData(context) {
      try {
        const res = await getMediaChangeCampaignData();
        context.commit("SET_CAMPAIGN_LIST", res.data);
      } catch (err) {
        context.commit("SET_CAMPAIGN_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 指标列表
    async getMediaChangeIndexData(context) {
      try {
        const res = await getMediaChangeIndexData();
        const quotaList = [];

        res.data.forEach((item) => {
          const { list } = item;
          const children = [];
          list.forEach((child) => {
            children.push({
              name: child.subIndexName,
              id: child.subIndexId,
            });
          });
          quotaList.push({
            name: item.indexName,
            id: item.indexId,
            children,
          });
        });

        context.commit("SET_QUOTA_LIST", quotaList);
      } catch (err) {
        context.commit("SET_QUOTA_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 年数据
    async getMedaiChangeYearDate(context, obj) {
      try {
        const res = await getMedaiChangeYearDate();
        context.commit("SET_YEAR_LIST", res.data);
      } catch (err) {
        context.commit("SET_YEAR_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 月数据
    async getMedaiChangeMonthDate(context) {
      try {
        const res = await getMedaiChangeMonthDate();
        const data = res.data;
        const monthList = [data[0], data[data.length - 1]];
        const startMonth = `${monthList[0]
          .toString()
          .slice(0, 4)}-${monthList[0].toString().slice(4, 7)}`;
        const endMonth = `${monthList[1]
          .toString()
          .slice(0, 4)}-${monthList[1].toString().slice(4, 7)}`;

        context.commit("SET_MONTH_LIST", [startMonth, endMonth]);

        const rankDataObj = {
          analysisSubjectTypeId: "3",
          // rankTypeId: '1',
          rankTypeId: "4",
          // time: monthList[1],
          time: String(monthList[1]),
          campaignTypeId: "",
          mediaId: "3",
          indexId: "",
          currentPage: 1,
          pageSize: 10,
          orderIndexId: "",
          ordervalue: "",
          analyseId: 1,
        };

        context.dispatch("getMediaTopList", rankDataObj);
        
      } catch (err) {
        context.commit("SET_MONTH_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 季度数据
    async getMedaiChangeQuarterDate(context, obj) {
      try {
        const res = await getMedaiChangeQuarterDate();
        const data = res.data;
        const quarterList = [String(data[0]), String(data[data.length - 1])];
        context.commit("SET_QUARTER_LIST", quarterList);
      } catch (err) {
        context.commit("SET_QUARTER_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 媒体列表
    async getMediaMessage(context, obj) {
      try {
        const res = await getMediaMessage(obj);
        const newList = res.data.map((item) => {
          return {
            name: item.mediaName,
            id: item.mediaId,
          };
        });
        context.commit("SET_MEDIA_LIST", newList);
      } catch (err) {
        context.commit("SET_MEDIA_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 变化数据
    async getMediaChangeRankDataList(context, obj) {
      try {
        const res = await getMediaChangeRankDataList(obj);
        const newList = res.data.list.map((item, index) => {
          return { key: index, ...item };
        });

        context.commit("SET_RANK_CHANGE_DATA", { ...res.data, list: newList });
      } catch (err) {
        context.commit("SET_RANK_CHANGE_DATA", { list: [] });
        console.error(err);
      }
    },
    // 获取媒体榜单 明细数据(媒体)
    async getMediaInfoDetailList(context, obj) {
      try {
        const res = await getMediaInfoDetailList(obj);

        const list = res.data.list.map((item, index) => {
          return {
            ...item,
            key: index,
          };
        });
        context.commit("SET_DETAIL_DATA", { ...res.data, list });
        context.commit("SET_DETAIL_LOADING", false);
      } catch (err) {
        context.commit("SET_DETAIL_DATA", { list: [] });
        context.commit("SET_DETAIL_LOADING", false);
        console.error(err);
      }
    },
    // 获取媒体榜单 单指标数据
    async getMediaSingleQuotaCharts(context, obj) {
      try {
        const res = await getMediaCurrentChangeDataList(obj.params);
        context.commit(`SET_SINGLE_QUOTA_LIST`, {
          index: obj.index,
          data: {
            id: res.data.leftId,
            title: res.data.leftName,
            data: {
              data: res.data.leftValue.reverse(),
              category: res.data.name,
              topN: obj.params.topN,
            },
          },
        });
      } catch (err) {
        context.commit(`SET_DEFAULT_SINGLE_QUOTA_LIST`);
        console.error(err);
      }
    },
    // 获取媒体榜单 双指标数据
    async getMediaDoubleQuotaCharts(context, obj) {
      try {
        const res = await getMediaCurrentChangeDataList(obj.params);

        context.commit(`SET_DOUBLE_QUOTA_LIST`, {
          index: obj.index,
          data: {
            data: {
              a: res.data.leftValue.reverse(),
              b: res.data.rightValue && res.data.rightValue.reverse(),
            },
            category: res.data.name.reverse(),
            topN: obj.params.topN,
          },
        });
      } catch (err) {
        context.commit(`SET_DOUBLE_QUOTA_LIST`, {
          index: obj.index,
          data: undefined,
        });
        console.error(err);
      }
    },
    // 获取媒体榜单 5大指标
    async getMediaIndexData(context) {
      try {
        const res = await getMediaIndexData();

        context.commit("SET_DIMENSION_LIST", res.data);
      } catch (err) {
        context.commit("SET_DIMENSION_LIST", []);
        console.error(err);
      }
    },
    // 获取媒体榜单 榜单
    async getMediaTopList(context, obj) {
      try {
        const res = await getMediaTopList(obj);

        const newList = res.data.list.map((item, index) => {
          return { ...item, index };
        });

        context.commit("SET_RANK_DATA", { ...res.data, list: newList });
        context.commit("SET_RANK_LOADING", false);
      } catch (err) {
        context.commit("SET_RANK_DATA", { list: [] });
        context.commit("SET_RANK_LOADING", false);
        console.error(err);
      }
    },
  },
};

export default mediaRank;
