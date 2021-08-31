import { get, post } from "@/api/api.js";

// 获取关键指标看板数据
export const getKeyIndexBoardData = (obj = {}) => {
  return post("effect-api/effect/getKeyIndexBoardData", obj);
};

// 获取关键指标看板时间组件数据
export const getKeyIndexDayDataList = () => {
  return post("effect-api/effect/getKeyIndexDayDataList");
};

// 查询媒体组件数据
export const getKeyIndexMedia = () => {
  return post("effect-api/effect/getKeyIndexMedia");
};

// 查询项目类型组件数据
export const getKeyIndexProjectType = () => {
  return post("effect-api/effect/getKeyIndexProjectType");
};

// 获取一级部门
export const getParentDeptList = () => {
  return post("effect-api/effect/getParentDeptList");
};

// 获取二级部门
export const getDeptList = () => {
  return post("effect-api/effect/getDeptList");
};
