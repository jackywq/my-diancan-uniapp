import { defineStore } from "pinia";
import cache from "@/common/cache/index";

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
      const selectedItems = state.cartList.filter(item => state.selectedIds.includes(item.id));
      return selectedItems
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
        // 默认选中新加入的菜品
        if (!this.selectedIds.includes(food.id)) {
            this.selectedIds.push(food.id);
        }
      }
      // 同步到本地缓存，体现 4.2 离线能力
      cache.set("cartList", this.cartList);
      cache.set("selectedIds", this.selectedIds);
    },
    // 从购物车移除菜品
    removeFromCart(foodId, spec) {
      this.cartList = this.cartList.filter(
        (item) => !(item.id === foodId && item.spec === spec),
      );
      // 如果该菜品所有规格都被移除，取消选中状态
      if (!this.cartList.some(item => item.id === foodId)) {
        this.selectedIds = this.selectedIds.filter(id => id !== foodId);
      }
      cache.set("cartList", this.cartList);
      cache.set("selectedIds", this.selectedIds);
    },
    // 切换菜品选中状态
    toggleSelect(foodId) {
      const index = this.selectedIds.indexOf(foodId);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(foodId);
      }
      cache.set("selectedIds", this.selectedIds);
    },
    // 全选/反选
    toggleAll(selectAll) {
        if (selectAll) {
            this.selectedIds = [...new Set(this.cartList.map(item => item.id))];
        } else {
            this.selectedIds = [];
        }
        cache.set("selectedIds", this.selectedIds);
    },
    // 清空购物车
    clearCart() {
      this.cartList = [];
      this.selectedIds = [];
      cache.remove("cartList");
      cache.remove("selectedIds");
    },
    // 从缓存加载购物车
    loadCartFromCache() {
      const cacheCart = cache.get("cartList");
      const cacheSelected = cache.get("selectedIds");
      if (cacheCart) this.cartList = cacheCart;
      if (cacheSelected) this.selectedIds = cacheSelected;
    },
  },
});