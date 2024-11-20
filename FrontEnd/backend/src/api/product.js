import request from "./request";

export function searchProducts(keyword) {
  return request({
    url: "/search/get_list",
    method: "get",
    params: { keyword },
  });
}

export function getProductDetail(id) {
  return request({
    url: "/products/get_obj",
    method: "get",
    params: { id },
  });
}
