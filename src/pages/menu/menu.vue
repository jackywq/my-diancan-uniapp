<template>
  <view class="menu-container">
    <!-- 主体内容：左侧分类，右侧菜品 -->
    <view class="main-content">
      <!-- 左侧侧边栏：分类 -->
      <scroll-view class="sidebar" scroll-y :scroll-top="leftScrollTop">
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="category-item"
          :class="{ active: currentCategoryIndex === index }"
          @click="selectCategory(index)"
        >
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧内容：菜品列表 -->
      <scroll-view
        class="product-list"
        scroll-y
        :scroll-into-view="rightScrollInto"
        scroll-with-animation
        @scroll="onRightScroll"
      >
        <view
          v-for="(category, index) in categoryList"
          :id="'category-' + index"
          :key="category.id"
          class="category-section"
        >
          <view class="section-title">
            <text>{{ category.name }}</text>
          </view>
          <view
            v-for="product in category.products"
            :key="product.id"
            class="product-item"
          >
            <image
              class="product-image"
              :src="product.image || '/static/logo.png'"
              mode="aspectFill"
            />
            <view class="product-info">
              <text class="product-name">
                {{ product.name }}
              </text>
              <text class="product-desc">
                {{ product.desc }}
              </text>
              <view class="product-bottom">
                <text class="product-price">
                  ¥{{ product.price }}
                </text>
                <!-- 加减按钮 -->
                <view class="action-btn">
                  <view
                    v-if="getCartCount(product) > 0"
                    class="btn minus"
                    @click="updateCart(product, -1)"
                  >
                    -
                  </view>
                  <text v-if="getCartCount(product) > 0" class="count">
                    {{ getCartCount(product) }}
                  </text>
                  <view class="btn add" @click="updateCart(product, 1)">
                    +
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部购物车栏 -->
    <view class="cart-bar">
      <view class="cart-icon-wrapper" @click="toggleCartList">
        <view class="cart-icon">
          <text v-if="totalCount > 0" class="badge">
            {{ totalCount }}
          </text>
          <text>🛒</text>
        </view>
      </view>
      <view class="cart-info" @click="toggleCartList">
        <text v-if="totalPrice > 0" class="total-price">
          ¥{{ totalPrice.toFixed(2) }}
        </text>
        <text v-else class="empty-cart-text">
          未选购商品
        </text>
        <text class="delivery-fee">
          另需配送费¥2
        </text>
      </view>
      <view
        class="checkout-btn"
        :class="{ active: totalPrice > 0 }"
        @click="goToCheckout"
      >
        <text>{{ totalPrice > 0 ? "去结算" : "¥15起送" }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 模拟数据
const categoryList = ref([
  {
    id: 1,
    name: '热销推荐',
    products: [
      { id: 101, name: '招牌牛肉面', desc: '大块牛肉，劲道面条，独家秘制汤底', price: 28, image: '' },
      { id: 102, name: '香辣烤鱼', desc: '外焦里嫩，麻辣鲜香', price: 68, image: '' },
      { id: 103, name: '手工水饺', desc: '皮薄馅大，汁多味美', price: 22, image: '' },
    ]
  },
  {
    id: 2,
    name: '经典主食',
    products: [
      { id: 201, name: '扬州炒饭', desc: '颗粒分明，配料丰富', price: 18, image: '' },
      { id: 202, name: '腊汁肉夹馍', desc: '肥而不腻，瘦而不柴', price: 12, image: '' },
      { id: 203, name: '油泼面', desc: '香辣可口，地道风味', price: 16, image: '' },
    ]
  },
  {
    id: 3,
    name: '风味小吃',
    products: [
      { id: 301, name: '炸鸡排', desc: '酥脆多汁，金黄诱人', price: 15, image: '' },
      { id: 302, name: '烤肠', desc: '肉感十足', price: 5, image: '' },
    ]
  },
  {
    id: 4,
    name: '清爽饮品',
    products: [
      { id: 401, name: '冰镇酸梅汤', desc: '解暑佳品', price: 8, image: '' },
      { id: 402, name: '鲜榨橙汁', desc: '富含维C，健康美味', price: 15, image: '' },
      { id: 403, name: '可口可乐', desc: '肥宅快乐水', price: 4, image: '' },
    ]
  }
])

const currentCategoryIndex = ref(0)
const leftScrollTop = ref(0)
const rightScrollInto = ref('')
const isScrollSync = ref(true)

// 在页面显示时，检查是否有从其他页面传来的分类 ID
onShow(() => {
  const selectedCategoryId = uni.getStorageSync('selectedCategoryId')
  if (selectedCategoryId) {
    // 找到对应分类的索引
    const index = categoryList.value.findIndex(c => c.id === selectedCategoryId)
    if (index !== -1) {
      selectCategory(index)
    }
    // 使用后清除，避免下次进入重复触发
    uni.removeStorageSync('selectedCategoryId')
  }
})

// 购物车状态（实际项目中建议放入 Pinia Store）
const cart = ref({})

// 选择左侧分类
const selectCategory = (index) => {
  currentCategoryIndex.value = index
  rightScrollInto.value = 'category-' + index
  isScrollSync.value = false // 点击左侧时不触发右侧滚动监听，防止抖动
  setTimeout(() => {
    isScrollSync.value = true
  }, 500)
}

// 监听右侧滚动，联动左侧（简化版，实际需要计算每个分类节点的高度区间）
const onRightScroll = (e) => {
  if (!isScrollSync.value) return
  // TODO: 通过 uni.createSelectorQuery 获取各 section 的 top 值来计算当前 index
  // 这里暂时省略详细的高度计算代码
}

// 购物车方法
const getCartCount = (product) => {
  return cart.value[product.id]?.count || 0
}

const updateCart = (product, change) => {
  if (!cart.value[product.id]) {
    cart.value[product.id] = { ...product, count: 0 }
  }
  cart.value[product.id].count += change
  if (cart.value[product.id].count <= 0) {
    delete cart.value[product.id]
  }
}

const toggleCartList = () => {
  if (totalCount.value > 0) {
    uni.showToast({ title: '展开购物车详情', icon: 'none' })
  }
}

// 计算属性
const totalCount = computed(() => {
  return Object.values(cart.value).reduce((sum, item) => sum + item.count, 0)
})

const totalPrice = computed(() => {
  return Object.values(cart.value).reduce((sum, item) => sum + item.price * item.count, 0)
})

const goToCheckout = () => {
  if (totalPrice.value <= 0) return
  uni.showToast({ title: '准备结算: ¥' + totalPrice.value, icon: 'none' })
  // uni.navigateTo({ url: '/pages/checkout/checkout' })
}
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
  box-sizing: border-box; /* 确保 padding 和 border 不会撑大容器 */
}

.header {
  padding: 20rpx 30rpx;
  background-color: #fff;
  z-index: 10;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0; /* 防止头部被压缩 */
  .store-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
  }
  .store-desc {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
    display: block;
  }
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  margin-bottom: calc(
    110rpx + env(safe-area-inset-bottom)
  ); /* 留出底部购物车高度和安全区 */
  padding-right: 10rpx; /* 为右侧可能出现的滚动条预留一点空间，防止紧贴边缘 */
}

/* 左侧分类 */
.sidebar {
  width: 180rpx;
  background-color: #f5f5f5;
  height: 100%;
  overflow-y: auto; /* 允许纵向滚动 */
  -webkit-overflow-scrolling: touch; /* 增强 iOS 滚动体验 */

  /* 隐藏左侧滚动条 */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }

  .category-item {
    padding: 30rpx 20rpx;
    font-size: 26rpx;
    color: #666;
    text-align: center;
    position: relative;

    &.active {
      background-color: #fff;
      color: #ff9900;
      font-weight: bold;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 20rpx;
        bottom: 20rpx;
        width: 8rpx;
        background-color: #ff9900;
        border-radius: 0 4rpx 4rpx 0;
      }
    }
  }
}

/* 右侧菜品 */
.product-list {
  flex: 1;
  background-color: #fff;
  height: 100%;
  overflow-y: auto; /* 允许纵向滚动 */
  -webkit-overflow-scrolling: touch; /* 增强 iOS 滚动体验 */

  /* 自定义右侧滚动条样式 */
  &::-webkit-scrollbar {
    width: 8rpx; /* 设置滚动条的宽度 */
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10rpx;
    background-color: #e0e0e0; /* 滚动条的颜色，浅灰色，不会太突兀 */
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .category-section {
    padding: 0 20rpx;
    padding-bottom: 20rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      padding: 20rpx 0;
      background-color: #fff;
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}

.product-item {
  display: flex;
  margin-bottom: 40rpx;

  .product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    background-color: #eee;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product-name {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .product-desc {
      font-size: 22rpx;
      color: #999;
      margin-top: 8rpx;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;

      .product-price {
        font-size: 34rpx;
        color: #ff3333;
        font-weight: bold;
      }

      .action-btn {
        display: flex;
        align-items: center;

        .btn {
          width: 44rpx;
          height: 44rpx;
          line-height: 40rpx;
          text-align: center;
          border-radius: 50%;
          font-size: 36rpx;
          font-weight: bold;

          &.minus {
            border: 2rpx solid #ddd;
            color: #666;
            background-color: #fff;
            line-height: 36rpx;
          }

          &.add {
            background-color: #ff9900;
            color: #fff;
          }
        }

        .count {
          margin: 0 24rpx;
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}

/* 底部购物车 */
.cart-bar {
  position: fixed;
  bottom: var(--window-bottom, 0px);
  left: 0;
  right: 0;
  height: 110rpx;
  background-color: #333;
  display: flex;
  align-items: center;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom); /* 适配全面屏底部安全区 */

  .cart-icon-wrapper {
    position: relative;
    width: 100rpx;
    height: 100rpx;
    margin-left: 30rpx;
    margin-top: -40rpx; /* 凸出效果 */
    border-radius: 50%;
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cart-icon {
    width: 80rpx;
    height: 80rpx;
    background-color: #ff9900;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 44rpx;
    border: 6rpx solid #444;

    .badge {
      position: absolute;
      top: -6rpx;
      right: -6rpx;
      background-color: #ff3333;
      color: #fff;
      font-size: 20rpx;
      padding: 2rpx 10rpx;
      border-radius: 20rpx;
      border: 2rpx solid #fff;
      font-weight: bold;
    }
  }

  .cart-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .total-price {
      font-size: 38rpx;
      color: #fff;
      font-weight: bold;
    }

    .empty-cart-text {
      font-size: 30rpx;
      color: #999;
    }

    .delivery-fee {
      font-size: 22rpx;
      color: #999;
      margin-top: 4rpx;
    }
  }

  .checkout-btn {
    width: 220rpx;
    height: 110rpx;
    background-color: #555;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;

    &.active {
      background-color: #ff9900;
      color: #fff;
    }
  }
}
</style>