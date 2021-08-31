import { get, post } from "@/api/api.js";

// 获取监测指标
export const getDoubleIndexSubIndexData = () => {
  return post("effect-api/effect/getDoubleIndexSubIndexData");
};

// 获取时间组件数据
export const getCampaignDate = () => {
  return post("web-api/web/getCampaignDate");
};

// 获取投放状态组件数据
export const getDeliveryStatus = () => {
  return post("schedule-api/schedule/getDeliveryStatus");
};

// 获取事业部组件数据
export const getParentDeptList = () => {
  return post("schedule-api/schedule/getParentDeptList");
};

// 获取部门组件数据
export const getDeptList = () => {
  return post("schedule-api/schedule/getDeptList");
};

// 获取媒体组件数据
export const getProjectMediaData = () => {
  return post("web-api/web/getProjectMediaData");
};

// 获取项目基本信息组件数据
export const getCampaignBaseDataList = () => {
  return post("web-api/web/getCampaignBaseDataList");
};

// 查询项目明细数据
export const getCampaignDetailDataList = (obj = {}) => {
  return post("web-api/web/getCampaignDetailDataList", obj);
};

// 查询媒体组件数据
export const getMediaList = () => {
  return post("web-api/web/getMediaList");
};

// 下载数据
export const downloadDetailData = (obj = {}) => {
  return post("web-api/web/downloadDetailData", obj);
};
