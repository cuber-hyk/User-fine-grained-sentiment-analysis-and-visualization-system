import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.status === "success") {
      return res.data;
    } else {
      Message.error(res.error.message || "请求失败");
      return Promise.reject(res.error);
    }
  },
  (error) => {
    Message.error(error.message || "网络错误");
    return Promise.reject(error);
  }
);

export default service;
