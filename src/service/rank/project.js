import { get, post } from "@/api/api.js";

// 获取项目品牌组件数据
export const getProjectCampaignData = (obj = {}) => {
  return post("web-api/web/getProjectCampaignData", obj);
};
// 获取项目日完结榜时间
export const getProjectDayDate = (obj = {}) => {
  return post("web-api/web/getProjectDayDate", obj);
};
// 获取项目监测指标组件数据
export const getProjectIndexData = (obj = {}) => {
  return post("web-api/web/getProjectIndexData", obj);
};

// 获取项目月完结榜时间
export const getProjectMonthDate = (obj = {}) => {
  return post("web-api/web/getProjectMonthDate", obj);
};
// 获取日，月完结榜
export const getDayMonthEndRank = (obj = {}) => {
  return post("web-api/web/getDayMonthEndRank", obj);
};
// 获取项目日，月完结榜
export const getProjectDayMonthEndRank = (obj) => {
  return post("web-api/web/getProjectDayMonthEndRank", obj);
};
// 获取项目数据列表
export const getProjectDataList = (obj = {}) => {
  return post("web-api/web/getProjectDataList", obj);
};
// 获取项目明细详情列表
export const getProjectDataDetailList = (obj = {}) => {
  return post("web-api/web/getProjectDataDetailList", obj);
};
// 二级部门
export const getDeptDataByBuId = (obj = {}) => {
  return post("web-api/web/getDeptDataByBuId", obj);
};
// 一级部门
export const getParentDeptData = (obj = {}) => {
  return post("web-api/web/getParentDeptData", obj);
};
export const getSubIndexData = (obj = {}) => {
  return post("web-api/web/getSubIndexData", obj);
};
export const getProjectIndexList = (obj = {}) => {
  return get("web-api/web/getProjectIndexList", obj);
};
// 导出下载
export const getProjectIndexs = (obj = {}) => {
  return get("web-api/web/getProjectIndexs", obj);
};
// // 榜单事业部
// export const getParentDeptLeaderData = (obj = {}) => {
//   return post("web-api/web/getParentDeptLeaderData", obj);
// };
// // 榜单部门
// export const getDeptLeaderDataByBuId = (obj = {}) => {
//   return post("web-api/web/getDeptLeaderDataByBuId", obj);
// };
