import { get, post } from "@/api/api.js";

export default class {
  // 时间
  static getCampaignDate(data) {
    return post("/web-api/web/getStatisticsCampaignDate", data);
  }
  // 投放状态
  static getDeliveryStatus(data) {
    return post("/web-api/web/getDeliveryStatus", data);
  }
  // 事业部
  static getParentDeptList(data) {
    return post("/schedule-api/schedule/getParentDeptList", data);
  }
  // 部门
  static getDeptList(data) {
    return post("/schedule-api/schedule/getDeptList", data);
  }
  // 媒体组件
  static getProjectMediaData(data) {
    return post("/web-api/web/getProjectMediaData", data);
  }
  // 项目基本信息组件
  static getCampaignBaseDataList(data) {
    return post("/web-api/web/getCampaignBaseDataList", data);
  }
  // 监测指标
  static getDoubleIndexSubIndexData(data) {
    return post("/effect-api/effect/getDoubleIndexSubIndexData", data);
  }
  // 品牌类组件
  static getProjectCampaignData(data) {
    return post("/web-api/web/getProjectCampaignData", data);
  }
  //  数据统计
  static getCampaignStatisticsDataList(data) {
    return post("/web-api/web/getCampaignStatisticsDataList", data);
  }
  // 下载
  static downloadStatisticsData(data) {
    return post("/web-api/web/downloadStatisticsData", data);
  }
}
