import { get, post } from "@/api/api.js";


// 获取媒体榜单 分析主体列表
export const getMediaChangeRankType = (obj = {}) => {
  return post("web-api/web/getMediaChangeRankType", obj);
};
// 获取媒体榜单 (当前变化)列表
export const getMediaChangeCurrentRankType = (obj = {}) => {
  return post("web-api/web/getMediaChangeCurrentRankType", obj);
};
// 获取媒体榜单 时间维度
export const getMediaChangeMQYRankType = (obj = {}) => {
  return post("web-api/web/getMediaChangeMQYRankType", obj);
};
// 获取媒体榜单 月 列表
export const getMedaiChangeMonthDate = (obj = {}) => {
  return post("web-api/web/getMedaiChangeMonthDate", obj);
};
// 获取媒体榜单 季度 列表
export const getMedaiChangeQuarterDate = (obj = {}) => {
  return post("web-api/web/getMedaiChangeQuarterDate", obj);
};
// 获取媒体榜单 年 列表
export const getMedaiChangeYearDate = (obj = {}) => {
  return post("web-api/web/getMedaiChangeYearDate", obj);
};
// 获取媒体榜单 类型列表
export const getMediaChangeCampaignData = (obj = {}) => {
  return post("web-api/web/getMediaChangeCampaignData", obj);
};
// 获取媒体榜单 指标列表
export const getMediaChangeIndexData = (obj = {}) => {
  return post("web-api/web/getMediaChangeIndexData", obj);
};
// 获取媒体榜单 媒体列表
export const getMediaMessage = (obj = {}) => {
  return post("web-api/web/getMediaMessage", obj);
};
// 获取媒体榜单 变化数据
export const getMediaChangeRankDataList = (obj = {}) => {
  return post("web-api/web/getMediaChangeRankDataList", obj);
};

// 获取媒体榜单 单双指标数据
export const getMediaCurrentChangeDataList = (obj = {}) => {
  return post("web-api/web/getMediaCurrentChangeDataList", obj);
};

// 获取媒体榜单 明细数据
export const getMediaInfoDetailList = (obj = {}) => {
  return post("web-api/web/getMediaInfoDetailList", obj);
  // return post("web-api/web/getMediaDataDetailList", obj);
};


// 获取媒体榜单 获取5大指标
export const getMediaIndexData = (obj = {}) => {
  return post("web-api/web/getMediaIndexData", obj);
};

// 获取媒体榜单 榜单
export const getMediaTopList = (obj = {}) => {
  return post("web-api/web/getMediaTopList", obj);
};




