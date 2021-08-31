import { get, post } from "@/api/api.js";

// 获取分析主体的数据内容
export const getAnalysisMainData = (obj = {}) => {
  return get("effect-api/effect/getAnalysisMainData", obj);
};

// 区域分析数据查询
export const getRegionalAnalysisData = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisData", obj);
};

// 查询时间组件数据
export const getRegionalAnalysisDates = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisDates", obj);
};

// 根据一级部门过滤二级部门组件数据
export const getRegionalAnalysisDeptById = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisDeptById", obj);
};

// 查询媒体组件数据
export const getRegionalAnalysisMedia = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisMedia", obj);
};

// 查询一级部门组件数据
export const getRegionalAnalysisParentDept = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisParentDept", obj);
};

// 查询项目类型组件数据
export const getRegionalAnalysisProjectType = (obj = {}) => {
  return post("effect-api/effect/getRegionalAnalysisProjectType", obj);
};

// 获取双指标分析监测指标组件数据
export const getDoubleIndexSubIndexData = () => {
  return post("effect-api/effect/getDoubleIndexSubIndexData");
};
