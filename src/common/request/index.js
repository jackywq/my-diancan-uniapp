import config from "@/common/config/base";
import { showToast } from "@/common/utils/uniHelper";

// 请求拦截器
const requestInterceptor = (options) => {
  // 1. 添加基础URL
  options.url = config.baseUrl + options.url;
  // 2. 添加token
  const token = uni.getStorageSync("token");
  if (token) {
    options.header = {
      ...options.header,
      Authorization: `Bearer ${token}`,
    };
  }
  // 3. 设置超时时间
  options.timeout = options.timeout || config.timeout || 10000;
  return options;
};

// 响应拦截器
const responseInterceptor = (res) => {
  const { code, msg } = res.data;
  // 业务码校验
  if (code === 200) {
    return res.data;
  } else if (code === 401) {
    // token过期：清除缓存、跳转登录页
    uni.removeStorageSync("token");
    uni.navigateTo({ url: "/pages/user/user" }); // 这里简化跳转到user页
    showToast("登录已过期，请重新登录");
    return Promise.reject(msg);
  } else {
    showToast(msg || "请求失败");
    return Promise.reject(msg);
  }
};

// 核心请求函数
const request = (options) => {
  // 开启 loading 状态
  uni.showLoading({ title: '加载中...' });
  
  // 请求拦截
  const reqOptions = requestInterceptor(options);
  return new Promise((resolve, reject) => {
    uni.request({
      ...reqOptions,
      success: (res) => {
        // 响应拦截
        resolve(responseInterceptor(res));
      },
      fail: (err) => {
        showToast("网络异常，请检查网络");
        reject(err);
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  });
};

// 封装GET/POST方法
export const get = (url, params) => request({ url, method: "GET", data: params });
export const post = (url, data) => request({ url, method: "POST", data });

export default request;