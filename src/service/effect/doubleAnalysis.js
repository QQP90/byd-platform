import { get, post } from "@/api/api.js";

// 时间
export const getDoubleIndexDates = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexDates", obj);
};
// 1级部门
export const getDoubleIndexParentDept = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexParentDept", obj);
};
// 2级部门
export const getDoubleIndexDept = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexDept", obj);
};
// 项目类型
export const getDoubleIndexProjectType = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexProjectType", obj);
};
// 媒体
export const getDoubleIndexMedia = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexMedia", obj);
};
// 指标
export const getDoubleIndexSubIndexData = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexSubIndexData", obj);
};
// 图表数据
export const getDoubleIndexDataList = (obj = {}) => {
  return post("effect-api/effect/getDoubleIndexDataList", obj);
};
