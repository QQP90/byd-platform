import { get, post } from "@/api/api.js";

// 获取部门榜单 分析纬度 （当期表现）
export const getDeptCurrentRankType = (obj = {}) => {
  return post("web-api/web/getDeptCurrentRankType", obj);
};
// 获取部门榜单 时间纬度 （月季年）
export const getDeptDayMonthEndRankType = (obj = {}) => {
  return post("web-api/web/getDeptDayMonthEndRankType", obj);
};
// 获取部门榜单 部门列表
export const getDeptForDeptData = (obj = {}) => {
  return post("web-api/web/getDeptForDeptData", obj);
};
// 获取部门榜单 类型列表
export const getDeptCampaignData = (obj = {}) => {
  return post("web-api/web/getDeptCampaignData", obj);
};
// 获取部门榜单 指标列表
export const getDeptIndexData = (obj = {}) => {
  return post("web-api/web/getDeptIndexData", obj);
};
// 获取部门榜单 年数据
export const getDeptYearDate = (obj = {}) => {
  return post("web-api/web/getDeptYearDate", obj);
};
// 获取部门榜单 月数据
export const getDeptMonthDate = (obj = {}) => {
  return post("web-api/web/getDeptMonthDate", obj);
};
// 获取部门榜单 季度数据
export const getDeptQuarterDate = (obj = {}) => {
  return post("web-api/web/getDeptQuarterDate", obj);
};
// 获取部门榜单 明细数据
export const getDeptRankDataDetailList = (obj = {}) => {
  return post("web-api/web/getDeptRankDataDetailList", obj);
};
// 获取部门榜单 榜单数据
export const getDeptRankDataList = (obj = {}) => {
  return post("web-api/web/getDeptRankDataList", obj);
};
// 获取部门榜单 变化数据
export const getDeptRankDataChangeList = (obj = {}) => {
  return post("web-api/web/getDeptRankDataChangeList", obj);
};

// 获取部门榜单总体数据列表
export const getDeptRankOverallDataList = (obj = {}) => {
  return post("web-api/web/getDeptRankOverallDataList", obj);
};
// 获取部门榜单项目数据列表
export const getDeptRankProjectDataList = (obj = {}) => {
  return post("web-api/web/getDeptRankProjectDataList", obj);
};

// 获取指标
export const getIndexSubIndexData = (obj = {}) => {
  return post("web-api/web/getIndexSubIndexData", obj);
};

// 获取部门榜事业部组件数据(榜单)
export const getDeptForLeaderDeptData = () => {
  return post("web-api/web/getDeptForLeaderDeptData");
};
