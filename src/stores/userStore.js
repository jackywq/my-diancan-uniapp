import { defineStore } from "pinia";
import cache from "@/common/cache/index";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: cache.get("token") || "",
    userInfo: cache.get("userInfo") || {},
  }),
  actions: {
    setToken(token) {
      this.token = token;
      cache.set("token", token, 7 * 24 * 60 * 60); // 缓存7天
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      cache.set("userInfo", userInfo);
    },
    logout() {
      this.token = "";
      this.userInfo = {};
      cache.remove("token");
      cache.remove("userInfo");
    },
  },
});