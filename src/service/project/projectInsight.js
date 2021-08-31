import { get, post } from "@/api/api.js";

// 项目列表
export const getCampaignKeyIndexProjectList = (obj = {}) => {
  return post("web-api/web/getCampaignKeyIndexProjectList", obj);
}

// 时间
export const getCampaignKeyIndexTimeData = (obj = {}) => {
  return post("web-api/web/getCampaignKeyIndexTimeData", obj);
}

// 时间类型
export const getCampaignKeyIndexTimePeriod = (obj = {}) => {
  return post("web-api/web/getCampaignKeyIndexTimePeriod", obj);
}

// 指标
export const getCampaignKeyIndexSubIndexData = (obj = {}) => {
  return post("web-api/web/getCampaignKeyIndexSubIndexData", obj);
}


// 关键指标数据列表
export const getCampaignKeyIndexDataList = (obj = {}) => {
  return post("web-api/web/getCampaignKeyIndexDataList", obj);
}

