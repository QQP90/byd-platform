import {
  getDeptCurrentRankType,
  getDeptDayMonthEndRankType,
  getDeptForDeptData,
  getDeptCampaignData,
  getDeptIndexData,
  getDeptYearDate,
  getDeptMonthDate,
  getDeptQuarterDate,
  getDeptRankDataDetailList,
  getDeptRankDataChangeList,
  getDeptRankOverallDataList,
  getDeptRankProjectDataList,
  getIndexSubIndexData,
  getDeptForLeaderDeptData,
} from "@/service/rank/department.js";

const departmentRank = {
  namespaced: true,
  state: {
    analysisTypeList: [], // 分析维度列表
    rankTypeList: [], // 排行类型
    departmentList: [], // 部门列表
    campaignList: [], // 品牌类型
    quotaList: [], // 指标数组
    yearList: [], // 年份数组
    monthList: [], // 月份数组
    quarterList: [], // 季度数组
    rankData: [], // 榜单数据
    detailData: [], // 明细数据
    rankChangeData: { list: [] }, // 排名变化数据
    subIndex: [], // 指标id
    loading: true, // 请求数据加载状态
    rankDepartmentList: [], // 榜单部门数据
  },
  mutations: {
    SET_ANALYSIS_TYPE_LIST(state, list) {
      state.analysisTypeList = list;
    },
    SET_RANK_TYPE_LIST(state, list) {
      state.rankTypeList = list;
    },
    SET_DEPARTMENT_LIST(state, list) {
      state.departmentList = list;
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
    SET_RANK_DATA(state, list) {
      state.rankData = list;
    },
    SET_DETAIL_DATA(state, list) {
      state.detailData = list;
    },
    SET_RANK_CHANGE_DATA(state, list) {
      state.rankChangeData = list;
    },
    SET_SUBINDEX_DATA(state, list) {
      state.subIndex = list;
    },
    SET_LOADING(state, bool) {
      state.loading = bool;
    },
    SET_RANK_DEPARTMENT_LIST(state, list) {
      state.rankDepartmentList = list;
    },
  },
  actions: {
    // 获取部门榜单 分析纬度 （当期表现）
    async getDeptCurrentRankType(context) {
      try {
        const res = await getDeptCurrentRankType();
        context.commit("SET_ANALYSIS_TYPE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 时间纬度 （月季年）
    async getDeptDayMonthEndRankType(context) {
      try {
        const res = await getDeptDayMonthEndRankType();
        context.commit("SET_RANK_TYPE_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门 明细数据 部门列表
    async getDeptForDeptData(context) {
      try {
        const res = await getDeptForDeptData();
        context.commit("SET_DEPARTMENT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 类别列表
    async getDeptCampaignData(context) {
      try {
        const res = await getDeptCampaignData();
        context.commit("SET_CAMPAIGN_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 指标列表
    async getDeptIndexData(context, obj) {
      try {
        const res = await getDeptIndexData(obj);
        context.commit("SET_QUOTA_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 年数据
    async getDeptYearDate(context, obj) {
      try {
        const res = await getDeptYearDate();
        context.commit("SET_YEAR_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 月数据
    async getDeptMonthDate(context, obj) {
      try {
        const res = await getDeptMonthDate();
        const data = res.data;
        const monthList = [data[0], data[data.length - 1]];
        const startMonth = `${monthList[0]
          .toString()
          .slice(0, 4)}-${monthList[0].toString().slice(4, 7)}`;
        const endMonth = `${monthList[1]
          .toString()
          .slice(0, 4)}-${monthList[1].toString().slice(4, 7)}`;

        context.commit("SET_MONTH_LIST", [startMonth, endMonth]);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 季度数据
    async getDeptQuarterDate(context, obj) {
      try {
        const res = await getDeptQuarterDate();
        const data = res.data;
        const quarterList = [data[0], data[data.length - 1]];
        context.commit("SET_QUARTER_LIST", quarterList);
      } catch (err) {
        console.error(err);
      }
    },
    // 获取部门榜单 明细数据
    async getDeptRankDataDetailList(context, obj) {
      context.commit("SET_LOADING", true);
      try {
        const res = await getDeptRankDataDetailList(obj);
        const newList = res.data.list.map((item, index) => {
          return {
            id: index,
            ...item,
          };
        });
        context.commit("SET_DETAIL_DATA", { ...res.data, list: newList });
      } catch (err) {
        context.commit("SET_DETAIL_DATA", {});
      }
      context.commit("SET_LOADING", false);
    },
    // 获取部门榜单 变化数据
    async getDeptRankDataChangeList(context, obj) {
      context.commit("SET_LOADING", true);
      try {
        const res = await getDeptRankDataChangeList(obj);
        let newList = [];
        if (res.data.list) {
          newList = res.data.list.map((item, index) => {
            return { key: index, ...item };
          });
        }
        context.commit("SET_RANK_CHANGE_DATA", { ...res.data, list: newList });
      } catch (err) {
        context.commit("SET_RANK_CHANGE_DATA", {});
      }
      context.commit("SET_LOADING", false);
    },
    // 获取部门榜单总体数据列表
    async getDeptRankOverallDataList(context, obj) {
      context.commit("SET_LOADING", true);
      try {
        const res = await getDeptRankOverallDataList(obj);
        context.commit("SET_RANK_DATA", res.data);
      } catch (err) {
        context.commit("SET_RANK_DATA", {});
      }
      context.commit("SET_LOADING", false);
    },
    // 获取部门榜单项目数据列表
    async getDeptRankProjectDataList(context, obj) {
      context.commit("SET_LOADING", true);
      try {
        const res = await getDeptRankProjectDataList(obj);
        context.commit("SET_RANK_DATA", res.data);
      } catch (error) {
        context.commit("SET_RANK_DATA", {});
      }
      context.commit("SET_LOADING", false);
    },
    // 获取指标
    async getIndexSubIndexData(context, obj) {
      const res = await getIndexSubIndexData(obj);
      context.commit("SET_SUBINDEX_DATA", res.data);
    },
    // 获取部门 明细数据 部门列表
    async getDeptForLeaderDeptData(context) {
      try {
        const res = await getDeptForLeaderDeptData();
        context.commit("SET_RANK_DEPARTMENT_LIST", res.data);
      } catch (err) {
        console.error(err);
      }
    },
  },
};

export default departmentRank;
