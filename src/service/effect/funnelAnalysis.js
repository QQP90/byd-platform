import { get, post } from "@/api/api.js";
//总体
export const getFunnelAnalysisDataList = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisDataList", obj);
};
// 时间
export const getFunnelAnalysisDates = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisDates", obj);
};
// 二级部门
export const getFunnelAnalysisDeptById = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisDeptById", obj);
};
// 媒体组件数据
export const getFunnelAnalysisMedia = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisMedia", obj);
};
export const getFunnelAnalysisProjectType = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisProjectType", obj);
};
// 一级部门
export const getFunnelAnalysisParentDept = (obj = {}) => {
  return post("effect-api/effect/getFunnelAnalysisParentDept", obj);
};


