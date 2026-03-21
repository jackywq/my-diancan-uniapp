import request from "../index";

// 创建订单
export const createOrder = (orderData) => {
  return request({
    url: "/order/create",
    method: "POST",
    data: orderData,
  });
};

// 获取订单列表
export const getOrderList = (params) => {
  return request({
    url: "/order/list",
    method: "GET",
    data: params, // 注意：uni.request 中 GET 参数也放在 data 中
  });
};

// 获取订单详情
export const getOrderDetail = (orderId) => {
  return request({
    url: `/order/detail/${orderId}`,
    method: "GET",
  });
};

// 取消订单
export const cancelOrder = (orderId) => {
  return request({
    url: `/order/cancel/${orderId}`,
    method: "POST",
  });
};