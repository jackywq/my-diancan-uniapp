import { get, post } from '../index';

// --- 首页相关接口 ---
export const getShopInfo = () => get('/shop/info');
export const getBannerList = () => get('/banner/list');
export const getCategoryList = () => get('/category/list');

// --- 支付相关接口 ---
export const getPayParams = (orderId) => get(`/pay/params/${orderId}`);

// --- 用户相关接口 ---
export const userLogin = (data) => post('/user/login', data);