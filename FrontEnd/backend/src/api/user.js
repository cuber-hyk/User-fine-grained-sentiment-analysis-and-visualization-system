import request from "./request";

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

export function register(data) {
  return request({
    url: "/user/register",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post",
  });
}

export function addCollect(data) {
  return request({
    url: "/user/collect/add",
    method: "post",
    data,
  });
}

export function removeCollect(params) {
  return request({
    url: "/user/collect/del",
    method: "get",
    params,
  });
}

export function getCollectList(params) {
  return request({
    url: "/collect/get_list",
    method: "get",
    params,
  });
}
