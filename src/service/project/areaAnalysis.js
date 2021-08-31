import { get, post } from "@/api/api.js";

export default class {
  // 省份
  static getProvinceAndCityData(data) {
    return post("/web-api/web/getProvinceAndCityData", data);
  }
  // 区域维度
  static getRegionalAnalysisAreaData(data) {
    return post("/web-api/web/getRegionalAnalysisAreaData", data);
  }
  // 获取项目组件数据
  static getRegionalAnalysisProjectList(data) {
    return post("/web-api/web/getRegionalAnalysisProjectList", data);
  }
  // 监测指标
  static getRegionalAnalysisSubIndexData(data) {
    return post("/web-api/web/getRegionalAnalysisSubIndexData", data);
  }
  // 媒体组件
  static getRegionalAnalysisTimeData(data) {
    return post("/web-api/web/getRegionalAnalysisTimeData", data);
  }
  // 时间周期组件
  static getRegionalAnalysisTimePeriod(data) {
    return post("/web-api/web/getRegionalAnalysisTimePeriod", data);
  }
  static getRegionalAnalysisDataList(data) {
    return post("/web-api/web/getRegionalAnalysisDataList", data);
  }
}
