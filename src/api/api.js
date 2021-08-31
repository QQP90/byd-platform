import axios from "axios";
import { message } from "ant-design-vue";
import Vue from "vue";
const qs = require("qs");
const vm = new Vue();
const baseApiUrl = process.env.VUE_APP_BASE_URL;

const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 60000,
  headers: {
    authorization: "",
  },
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tokenTime = localStorage.getItem("tokenTime");
    const now = new Date().getTime();

    if (token && now - tokenTime < 60 * 60 * 24 * 1000) {
      config.headers.authorization = token;
      return config;
    }

    if (token && now - tokenTime > 60 * 60 * 24 * 1000) {
      localStorage.clear()
      message.error("登录信息已过期，请重新登陆");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return false;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use((response) => {
  const { data } = response;
  const { code } = data;

  if (code === 20000) {
    return response
  }
  else {
    message.error(data.message)

    if (code === 20001) {
      localStorage.clear()
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return false;
    }

    return Promise.reject(response)
  }


}, (error) => {
  if (error.response && error.response.data.message.indexOf('authorization') > -1) {
    if (error.response.data.message.indexOf('authorization') > -1) {
      localStorage.clear()
      message.error('登录信息已过期，请重新登陆')
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return false;
    }
    else {
      message.error(error.response.data.message || '请求错误')
    }
  }

  return Promise.reject(error)
})

export function get(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      params: qs.stringify(data),
      method: "get",
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
        throw err;
      });
  });
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      data,
      method: "post",
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
        throw err;
      });
  });
}
