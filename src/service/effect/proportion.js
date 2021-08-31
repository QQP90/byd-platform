import { get, post } from "@/api/api.js";

// 时间
export const getIndexAnalysisDates = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisDates", obj);
};
// 1级部门
export const getIndexAnalysisParentDept = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisParentDept", obj);
};
// 2级部门
export const getIndexAnalysisDept = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisDept", obj);
};
// 项目类型
export const getIndexAnalysisProjectType = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisProjectType", obj);
};
// 媒体
export const getIndexAnalysisMedia = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisMedia", obj);
};
// 指标
export const getIndexAnalysisIndexData = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisIndexData", obj);
};
// 图表数据
export const getIndexAnalysisDataList = (obj = {}) => {
  return post("effect-api/effect/getIndexAnalysisDataList", obj);
};
