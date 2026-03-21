# Uniapp 点餐下单小程序架构与模块设计文档

## 文档说明

本文档基于 Uniapp 框架设计点餐下单小程序的整体架构、核心模块及实现规范，兼顾微信小程序适配性、代码可维护性和业务扩展性，可直接作为项目开发的核心参考文档。

## 一、整体架构设计

### 1.1 架构分层（核心原则：分层解耦、职责单一）

| 层级            | 核心职责                                              | 技术选型 / 工具                       | 核心文件目录                 |
| --------------- | ----------------------------------------------------- | ------------------------------------- | ---------------------------- |
| 视图层（UI）    | 页面渲染、用户交互、样式适配、组件复用                | Uniapp 页面 / 组件、uView Plus 组件库 | pages/、components/          |
| 逻辑层（VM）    | 页面逻辑处理、状态管理、事件分发、数据校验            | Vue3、Pinia（状态管理）、Uniapp API   | stores/、pages/_/_.vue       |
| 服务层（API）   | 接口封装、请求 / 响应拦截、数据转换、接口异常处理     | uni.request、拦截器、Promise          | common/request/              |
| 数据层（Model） | 数据模型定义、本地缓存管理、数据持久化、Mock 数据模拟 | uni.storage、SQLite（可选）、Mock.js  | common/model/、common/cache/ |
| 基础层（Core）  | 全局配置、工具函数、权限控制、异常捕获                | 全局 mixin、Uniapp 全局 API           | common/                      |

### 1.2 技术栈选型

| 类别      | 选型方案                                 | 选型理由                                    |
| --------- | ---------------------------------------- | ------------------------------------------- |
| 基础框架  | Uniapp（Vue3 版本）                      | 一套代码多端适配，微信小程序原生支持        |
| 状态管理  | Pinia                                    | 轻量、支持 Vue3、无嵌套命名空间，适配小程序 |
| UI 组件库 | uView Plus                               | 专为 Uniapp 设计，组件丰富、适配性好        |
| 网络请求  | 封装 uni.request                         | 贴合 Uniapp 原生能力，减少第三方依赖        |
| 本地存储  | uni.storage（同步 / 异步）+ 封装缓存工具 | 小程序原生存储能力，适配多端                |
| 构建工具  | HBuilderX / Vite                         | HBuilderX 对 Uniapp 原生支持，Vite 构建更快 |

### 1.3 项目目录结构（规范版）

```plaintext
┌─ pages/                  // 页面目录（按业务模块拆分）
│  ├─ index/               // 首页模块
│  ├─ menu/                // 菜品点餐模块
│  ├─ cart/                // 购物车模块
│  ├─ order/               // 订单模块
│  ├─ user/                // 个人中心模块
│  └─ pay/                 // 支付模块
├─ components/             // 全局通用组件
│  ├─ menu-card/           // 菜品卡片组件
│  ├─ cart-item/           // 购物车项组件
│  ├─ order-item/          // 订单项组件
│  └─ pay-modal/           // 支付弹窗组件
├─ stores/                 // Pinia 状态管理
│  ├─ cartStore.js         // 购物车状态
│  ├─ userStore.js         // 用户状态
│  └─ orderStore.js        // 订单状态
├─ common/                 // 全局通用资源
│  ├─ config/              // 配置文件
│  │  ├─ base.js           // 基础配置（接口地址、缓存时长）
│  │  └─ api.js            // 接口地址枚举
│  ├─ request/             // 网络请求封装
│  │  ├─ index.js          // 请求核心封装
│  │  └─ interceptors.js   // 请求/响应拦截
│  ├─ utils/               // 工具函数
│  │  ├─ auth.js           // 权限工具
│  │  ├─ format.js         // 格式化工具（时间、价格）
│  │  └─ validate.js       // 数据校验工具
│  ├─ cache/               // 缓存工具封装
│  │  └─ index.js          // 缓存增删改查、有效期控制
│  └─ model/               // 数据模型
│     ├─ menuModel.js      // 菜品数据模型
│     └─ orderModel.js     // 订单数据模型
├─ static/                 // 静态资源（图片、图标）
├─ App.vue                 // 全局入口
├─ main.js                 // 全局配置
└─ pages.json              // 页面路由配置
```

## 二、核心业务模块设计

### 2.1 模块总览

点餐小程序核心业务模块分为：首页模块、菜品点餐模块、购物车模块、订单模块、支付模块、个人中心模块，各模块职责单一，通过状态管理和接口通信实现数据交互。

### 2.2 首页模块（pages/index）

#### 2.2.1 核心功能

店铺信息展示（店名、评分、配送信息）
菜品分类入口（热销、套餐、主食等）
广告轮播、优惠活动展示
快速点餐入口（搜索、历史点餐）

#### 2.2.2 核心代码示例（页面逻辑）

```javascript
<template>
  <view class="index-container">
    <!-- 店铺信息 -->
    <shop-info :info="shopInfo"></shop-info>
    <!-- 轮播广告 -->
    <uni-swiper-dot :info="bannerList" @click="handleBannerClick"></uni-swiper-dot>
    <!-- 菜品分类 -->
    <category-list :list="categoryList" @select="handleCategorySelect"></category-list>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getShopInfo, getBannerList, getCategoryList } from '@/common/request/api'

// 响应式数据
const shopInfo = ref({})
const bannerList = ref([])
const categoryList = ref([])

// 生命周期：获取首页数据
onMounted(async () => {
  try {
    // 并行请求提升性能
    const [shopRes, bannerRes, categoryRes] = await Promise.all([
      getShopInfo(),
      getBannerList(),
      getCategoryList()
    ])
    shopInfo.value = shopRes.data
    bannerList.value = bannerRes.data
    categoryList.value = categoryRes.data
  } catch (err) {
    uni.showToast({ title: '数据加载失败', icon: 'none' })
  }
})

// 分类选择事件
const handleCategorySelect = (categoryId) => {
  // 跳转到对应分类的点餐页面
  uni.navigateTo({ url: `/pages/menu/index?categoryId=${categoryId}` })
}

// 轮播点击事件
const handleBannerClick = (item) => {
  if (item.link) uni.navigateTo({ url: item.link })
}
</script>
```

### 2.3 菜品点餐模块（pages/menu）

#### 2.3.1 核心功能

- 菜品分类筛选、搜索
- 菜品详情展示（图片、价格、规格、库存）
- 菜品规格选择（口味、分量）
- 加入购物车 / 立即购买

#### 2.3.2 核心状态管理（stores/cartStore.js）

```javascript
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    // 购物车列表：[{ id, name, price, spec, count, image }]
    cartList: [],
    // 选中的菜品ID
    selectedIds: [],
  }),
  getters: {
    // 计算购物车总金额
    totalPrice: (state) => {
      return state.cartList
        .reduce((sum, item) => sum + item.price * item.count, 0)
        .toFixed(2);
    },
    // 计算购物车总数量
    totalCount: (state) => {
      return state.cartList.reduce((sum, item) => sum + item.count, 0);
    },
  },
  actions: {
    // 添加菜品到购物车
    addToCart(food) {
      const existItem = this.cartList.find(
        (item) => item.id === food.id && item.spec === food.spec,
      );
      if (existItem) {
        existItem.count += food.count;
      } else {
        this.cartList.push(food);
      }
      // 同步到本地缓存
      uni.setStorageSync("cartList", this.cartList);
    },
    // 从购物车移除菜品
    removeFromCart(foodId, spec) {
      this.cartList = this.cartList.filter(
        (item) => !(item.id === foodId && item.spec === spec),
      );
      uni.setStorageSync("cartList", this.cartList);
    },
    // 清空购物车
    clearCart() {
      this.cartList = [];
      this.selectedIds = [];
      uni.removeStorageSync("cartList");
    },
    // 从缓存加载购物车
    loadCartFromCache() {
      const cacheCart = uni.getStorageSync("cartList");
      if (cacheCart) this.cartList = cacheCart;
    },
  },
});
```

### 2.4 购物车模块（pages/cart）

#### 2.4.1 核心功能

- 购物车列表展示、数量修改
- 菜品选中 / 取消选中、全选 / 反选
- 结算金额计算、提交订单跳转
- 清空购物车、删除单个菜品

#### 2.4.2 核心逻辑（提交订单前置处理）

```javascript
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";

const cartStore = useCartStore();
const userStore = useUserStore();

// 提交订单校验
const handleSubmitOrder = () => {
  // 1. 校验用户是否登录
  if (!userStore.token) {
    uni.showModal({
      title: "提示",
      content: "请先登录",
      confirmText: "去登录",
      success: (res) => {
        if (res.confirm) uni.navigateTo({ url: "/pages/user/login" });
      },
    });
    return;
  }

  // 2. 校验是否选中菜品
  const selectedItems = cartStore.cartList.filter((item) =>
    cartStore.selectedIds.includes(item.id),
  );
  if (selectedItems.length === 0) {
    uni.showToast({ title: "请选择要下单的菜品", icon: "none" });
    return;
  }

  // 3. 跳转到订单确认页
  uni.navigateTo({
    url: `/pages/order/confirm?orderData=${JSON.stringify(selectedItems)}`,
  });
};
```

### 2.5 订单模块（pages/order）

#### 2.5.1 核心子模块

- 订单确认页（confirm）：确认菜品、收货地址、支付方式
- 订单列表页（list）：全部 / 待付款 / 待收货 / 已完成订单筛选
- 订单详情页（detail）：订单信息、菜品明细、取消 / 退款操作

#### 2.5.2 核心接口封装（common/request/api/order.js）

```javascript
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
    params,
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
```

### 2.6 支付模块（pages/pay）

#### 2.6.1 核心功能

- 支付方式选择（微信支付、余额支付）
- 订单支付（调用微信小程序支付接口）
- 支付结果回调、订单状态更新

#### 2.6.2 微信支付核心代码

```javascript
// 发起微信支付
const wxPay = async (orderId) => {
  try {
    // 1. 获取支付参数（后端返回）
    const payRes = await getPayParams(orderId);
    const payParams = payRes.data;

    // 2. 调用微信支付接口
    uni.requestPayment({
      provider: "wxpay",
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType,
      paySign: payParams.paySign,
      success: () => {
        // 支付成功：更新订单状态、跳转支付成功页
        uni.showToast({ title: "支付成功" });
        uni.navigateTo({ url: `/pages/order/detail?orderId=${orderId}` });
      },
      fail: (err) => {
        // 支付失败：提示用户、更新订单状态
        uni.showToast({ title: "支付失败，请重试", icon: "none" });
        console.error("支付失败：", err);
      },
    });
  } catch (err) {
    uni.showToast({ title: "获取支付参数失败", icon: "none" });
  }
};
```

### 2.7 个人中心模块（pages/user）

#### 2.7.1 核心功能

- 用户登录（微信授权登录）
- 个人信息展示 / 修改
- 收货地址管理
- 订单入口、优惠券、意见反馈

#### 2.7.2 微信授权登录核心代码

```javascript
// 微信授权登录
const wxLogin = async () => {
  try {
    // 1. 获取微信用户信息
    const { userInfo } = await uni.getUserProfile({
      desc: "用于完善用户信息",
    });

    // 2. 获取微信code
    const { code } = await uni.login({ provider: "weixin" });

    // 3. 后端登录接口（code + userInfo 换 token）
    const loginRes = await userLogin({ code, userInfo });
    const { token, user } = loginRes.data;

    // 4. 存储token和用户信息
    uni.setStorageSync("token", token);
    uni.setStorageSync("userInfo", user);

    // 5. 更新状态管理
    const userStore = useUserStore();
    userStore.setUserInfo(user);
    userStore.setToken(token);

    uni.showToast({ title: "登录成功" });
  } catch (err) {
    uni.showToast({ title: "登录失败，请重试", icon: "none" });
    console.error("登录失败：", err);
  }
};
```

## 三、通用能力封装

### 3.1 网络请求封装（common/request/index.js）

```javascript
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
  options.timeout = options.timeout || 10000;
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
    uni.navigateTo({ url: "/pages/user/login" });
    showToast("登录已过期，请重新登录");
    return Promise.reject(msg);
  } else {
    showToast(msg || "请求失败");
    return Promise.reject(msg);
  }
};

// 核心请求函数
const request = (options) => {
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
    });
  });
};

// 封装GET/POST方法
export const get = (url, params) => request({ url, method: "GET", params });
export const post = (url, data) => request({ url, method: "POST", data });

export default request;
```

### 3.2 缓存工具封装（common/cache/index.js）

```javascript
// 缓存工具：支持有效期、自动序列化/反序列化
class Cache {
  // 设置缓存（key, value, expire：有效期，单位秒）
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : 0,
    };
    uni.setStorageSync(key, JSON.stringify(data));
  }

  // 获取缓存
  get(key) {
    const str = uni.getStorageSync(key);
    if (!str) return null;
    const data = JSON.parse(str);
    // 校验有效期
    if (data.expire && data.expire < Date.now()) {
      this.remove(key);
      return null;
    }
    return data.value;
  }

  // 删除缓存
  remove(key) {
    uni.removeStorageSync(key);
  }

  // 清空所有缓存
  clear() {
    uni.clearStorageSync();
  }
}

export default new Cache();
```

## 四、关键优化点

### 4.1 性能优化

页面懒加载：在 pages.json 中配置 lazyLoad: true，减少首屏加载时间。
图片优化：使用 uni.loadImage 预加载菜品图片，适配小程序图片懒加载。
数据缓存：高频访问数据（菜品分类、用户信息）本地缓存，减少接口请求。
组件复用：提取通用组件（菜品卡片、订单项），减少代码冗余。

### 4.2 体验优化

加载状态：所有接口请求添加 loading 状态，避免用户无感知。
错误处理：统一错误提示样式，关键操作（支付、下单）增加二次确认。
适配性：适配不同屏幕尺寸，菜品列表使用弹性布局（flex）。
离线能力：购物车数据本地缓存，断网时可继续操作，联网后同步。

### 4.3 安全优化

接口签名：敏感接口（支付、下单）添加签名校验，防止参数篡改。
Token 管理：Token 过期自动刷新，敏感操作校验登录状态。
数据校验：前端对用户输入（收货地址、数量）进行校验，防止非法数据提交。
