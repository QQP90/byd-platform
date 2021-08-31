import { get, post } from "@/api/api.js";

export default class {
  // 时间
  static getAdCampaignTimeData(data) {
    return post("/web-api/web/getAdCampaignTimeData", data);
  }
  // 投放状态
  static getPutStatesData(data) {
    return post("/web-api/web/getPutStatesData", data);
  }
  // 事业部
  static getAdCampaignParentDeptData(data) {
    return post("/web-api/web/getAdCampaignParentDeptData", data);
  }
  // 部门
  static getAdCampaignDeptData(data) {
    return post("/web-api/web/getAdCampaignDeptData", data);
  }
  // 媒体组件 /web/getAdCampaignMediaData
  static getAdCampaignMediaData(data) {
    return post("/web-api/web/getAdCampaignMediaData", data);
  }
  // 项目基本信息组件
  static getCampaignBaseDataList(data) {
    return post("/web-api/web/getCampaignBaseDataList", data);
  }
  // 监测指标
  static getAdCampaignSubIndexData(data) {
    return post("/web-api/web/getAdCampaignSubIndexData", data);
  }
  //  列表
  static getAdCampaignDataList(data) {
    return post("/web-api/web/getAdCampaignDataList", data);
  }
  //   // 下载
  //   static downloadStatisticsData(data) {
  //     return post("/web-api/web/downloadStatisticsData", data);
  //   }
}
