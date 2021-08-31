import { get, post } from "@/api/api.js";
// 导出项目明细
export const exportBuDataDetailList = (obj = {}) => {
  return get("web-api/web/exportBuDataDetailList", obj);
};

// 获取事业部月，季，年组件数据
export const getBuDayMonthEndRankType = (obj = {}) => {
  return post("web-api/web/getBuDayMonthEndRankType", obj);
};



// 获取事业部月时间数据
export const getBuMonthDate = (obj = {}) => {
  return post("web-api/web/getBuMonthDate", obj);
};

// 获取事业部季度时间数据
export const getBuQuarterDate = (obj = {}) => {
  return post("web-api/web/getBuQuarterDate", obj);
};

// 获取事业部榜单明细数据
export const getBuRankDataDetailList = (obj = {}) => {
  return post("web-api/web/getBuRankDetailList", obj);
};

// 获取部门榜单数据列表
export const getBuRankDataList = (obj = {}) => {
  return post("web-api/web/selectBuRankList", obj);
};
// 获取事业部年度时间数据
export const getBuYearDate = (obj = {}) => {
  return post("web-api/web/getBuYearDate", obj);
};


// 获取月，季，年，完结榜组件数据
export const getBuRankDate = (obj = {}) => {
  return post("web-api/web/getBuRankDate", obj);
};

export const getDoneMonthDate = (obj = {}) => {
  return post("web-api/web/getDoneMonthDate", obj);
};
// 维度
export const selectIndexData = (obj = {}) => {
  return post("web-api/web/selectIndexData", obj);
};
