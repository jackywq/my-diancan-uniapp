<template>
  <view class="cart-container">
    <view v-if="cartStore.cartList.length === 0" class="empty-cart">
      <text>购物车空空如也，快去点餐吧~</text>
      <button class="go-menu-btn" @click="goToMenu">
        去点餐
      </button>
    </view>
    <view v-else class="cart-content">
      <!-- 购物车列表 -->
      <view class="cart-list">
        <view
          v-for="item in cartStore.cartList"
          :key="item.id + '-' + item.spec"
          class="cart-item"
        >
          <checkbox
            :checked="cartStore.selectedIds.includes(item.id)"
            color="#FF5A5F"
            @click="cartStore.toggleSelect(item.id)"
          />
          <image
            class="food-img"
            :src="item.image || '/static/default-food.png'"
            mode="aspectFill"
          />
          <view class="food-info">
            <view class="food-name">
              {{ item.name }}
            </view>
            <view v-if="item.spec" class="food-spec">
              {{ item.spec }}
            </view>
            <view class="price-wrap">
              <text class="price">
                ¥{{ item.price }}
              </text>
              <view class="count-ctrl">
                <text class="btn minus" @click="handleMinus(item)">
                  -
                </text>
                <text class="count">
                  {{ item.count }}
                </text>
                <text class="btn plus" @click="handleAdd(item)">
                  +
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部结算栏 -->
      <view class="bottom-bar">
        <view class="left">
          <label class="check-all" @click="toggleAll">
            <checkbox :checked="isAllSelected" color="#FF5A5F" />
            <text>全选</text>
          </label>
          <view class="total-info">
            <text>合计：</text>
            <text class="total-price">
              ¥{{ cartStore.totalPrice }}
            </text>
          </view>
        </view>
        <button class="submit-btn" @click="handleSubmitOrder">
          去结算
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";

const cartStore = useCartStore();
const userStore = useUserStore();

// 计算是否全选
const isAllSelected = computed(() => {
  return cartStore.cartList.length > 0 && cartStore.selectedIds.length === new Set(cartStore.cartList.map(item => item.id)).size;
});

// 去点餐
const goToMenu = () => {
  uni.switchTab({ url: '/pages/menu/menu' });
};

// 全选切换
const toggleAll = () => {
  cartStore.toggleAll(!isAllSelected.value);
};

// 增加数量
const handleAdd = (item) => {
  cartStore.addToCart({ ...item, count: 1 });
};

// 减少数量
const handleMinus = (item) => {
  if (item.count > 1) {
    // 简单处理数量减少，并在 store 中未实现特定减数量时这里暂时代替
    item.count--;
    uni.setStorageSync("cartList", cartStore.cartList);
  } else {
    cartStore.removeFromCart(item.id, item.spec);
  }
};

// 提交订单校验
const handleSubmitOrder = () => {
  // 1. 校验用户是否登录
  if (!userStore.token) {
    uni.showModal({
      title: "提示",
      content: "请先登录",
      confirmText: "去登录",
      success: (res) => {
        if (res.confirm) uni.switchTab({ url: "/pages/user/user" }); // 跳转到 tabBar 的 user
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
    url: `/pages/order/order`,
  });
};
</script>

<style lang="scss" scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx; // 留出底部结算栏空间

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
    color: #999;

    .go-menu-btn {
      margin-top: 40rpx;
      background-color: #ff5a5f;
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 0 60rpx;
    }
  }

  .cart-list {
    padding: 20rpx;

    .cart-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 20rpx;
      border-radius: 16rpx;
      margin-bottom: 20rpx;

      .food-img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 8rpx;
        margin: 0 20rpx;
      }

      .food-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 140rpx;

        .food-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }

        .food-spec {
          font-size: 24rpx;
          color: #999;
        }

        .price-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #ff5a5f;
            font-size: 32rpx;
            font-weight: bold;
          }

          .count-ctrl {
            display: flex;
            align-items: center;

            .btn {
              width: 48rpx;
              height: 48rpx;
              line-height: 44rpx;
              text-align: center;
              border: 1rpx solid #ddd;
              border-radius: 50%;
              font-size: 32rpx;
              color: #666;
            }

            .count {
              margin: 0 20rpx;
              font-size: 28rpx;
            }
          }
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px; // H5 适配 tabBar
    /* #endif */
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 99;

    .left {
      display: flex;
      align-items: center;

      .check-all {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
        margin-right: 30rpx;
      }

      .total-info {
        font-size: 28rpx;
        color: #333;

        .total-price {
          color: #ff5a5f;
          font-size: 36rpx;
          font-weight: bold;
        }
      }
    }

    .submit-btn {
      margin: 0;
      background-color: #ff5a5f;
      color: #fff;
      font-size: 30rpx;
      border-radius: 50rpx;
      padding: 0 50rpx;
      line-height: 70rpx;
    }
  }
}
</style>