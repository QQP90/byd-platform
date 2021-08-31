import { get, post } from "@/api/api.js";

// 登录
export const login = (obj = {}) => {
  return post("oauth-api/user/login", obj);
};

// 获取用户信息
export const getUserInfo = (obj = {}) => {
  return get("user-api/user/selectUserDetail", obj);
};

// 获取项目权限
export const getProjectRight = (obj = {}) => {
  return get("user-api/user/selectProjectRoot", obj);
};

// 获取模块权限
export const getModulesRight = (obj = {}) => {
  return get("user-api/user/selectModelRoot", obj);
};

// 修改密码
export const updatePassword = (obj = {}) => {
  return post("user-api/user/updatePassword", obj);
};

// 修改密码
export const updateUserPhone = (obj = {}) => {
  return post("user-api/user/updateUserPhone", obj);
};

// 获取用户权限
export const getUserRootList = () => {
  return post("web-api/web/getUserRootList");
};
