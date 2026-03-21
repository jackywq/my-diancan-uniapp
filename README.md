# my-diancan-uniapp (点餐下单小程序)

基于 **Uniapp (Vue3)** 构建的多端点餐下单小程序，兼顾微信小程序适配性、代码可维护性和业务扩展性。本项目采用最新的前端技术栈，实现了首页展示、分类点餐、购物车管理等核心业务功能。

## 🛠 技术选型

- **核心框架**：Uniapp (Vue3)
- **状态管理**：Pinia
- **UI 组件库**：uView Plus
- **网络请求**：基于 `uni.request` 深度封装 (支持拦截器)
- **构建工具**：Vite

## 📂 目录结构

```text
├── src/                  # 源码目录
│   ├── common/           # 全局通用模块 (请求封装、缓存管理、工具函数等)
│   ├── components/       # 公共业务组件 (菜品卡片、分类列表、店铺信息等)
│   ├── pages/            # 业务页面 (首页、购物车等)
│   ├── static/           # 静态资源 (图片、Logo等)
│   ├── stores/           # Pinia 状态管理中心
│   ├── App.vue           # 全局应用入口
│   ├── main.js           # 项目初始化配置
│   ├── manifest.json     # Uniapp 配置文件
│   ├── pages.json        # 页面与路由配置
│   └── uni.scss          # 全局样式变量
├── DESIGN.md             # 架构与模块设计文档
├── package.json          # 项目依赖配置
└── vite.config.js        # Vite 构建配置
```

## ✨ 核心功能

- **首页模块**：店铺信息展示、轮播广告、菜品分类快捷入口。
- **点餐与购物车**：商品列表展示、数量增减、总价计算与本地缓存同步。
- **通用基础能力**：基于 Promise 的网络请求核心封装、全局缓存控制、公共工具函数支持。

## 🚀 运行与构建

本项目使用 `npm` 进行依赖管理，支持运行到多端（主要针对微信小程序和 H5）。

### 1. 安装依赖

```bash
npm install
```

### 2. 运行项目 (开发环境)

```bash
# 运行为微信小程序 (使用微信开发者工具导入 dist/dev/mp-weixin 运行)
npm run dev:mp-weixin

# 运行为 H5
npm run dev:h5
```

### 3. 构建项目 (生产环境)

```bash
# 构建微信小程序
npm run build:mp-weixin

# 构建 H5
npm run build:h5
```

## 📝 开发规范

- **组件规范**：页面级组件放置于 `src/pages`，全局复用组件放置于 `src/components`。
- **状态规范**：跨页面数据共享通过 `Pinia` 统一管理，持久化数据结合 `uni.storage` 实现。
- **接口规范**：所有后端请求集中于 `src/common/request/api` 目录下进行声明和管理。
