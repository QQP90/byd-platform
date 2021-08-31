import { get, post } from "@/api/api.js";

// 31指标
export const effectGetSubIndexData = (obj = {}) => {
  return post("effect-api/effect/getSubIndexData", obj);
};
//总体
export const getTrendAnalysisOverallDataList = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisOverallDataList", obj);
};
// 时间
export const getTrendAnalysisDates = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisDates", obj);
};
// 二级部门
export const getTrendAnalysisDeptById = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisDeptById", obj);
};
// 媒体组件数据
export const getTrendAnalysisMedia = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisMedia", obj);
};
export const getTrendAnalysisProjectType = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisProjectType", obj);
};
export const getTrendAnalysisParentDept = (obj = {}) => {
  return post("effect-api/effect/getTrendAnalysisParentDept", obj);
};


