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
    try {
      const data = JSON.parse(str);
      // 校验有效期
      if (data.expire && data.expire < Date.now()) {
        this.remove(key);
        return null;
      }
      return data.value;
    } catch (e) {
      return str; // 如果不是 JSON 格式，直接返回原始值
    }
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