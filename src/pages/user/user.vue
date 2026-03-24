<template>
  <view class="user-container">
    <!-- 头部用户信息 -->
    <view class="user-info-section">
      <view class="avatar-wrap">
        <image class="avatar" src="/static/logo.png" mode="aspectFill" />
      </view>
      <view class="info-wrap">
        <text class="nickname"> 微信用户 </text>
        <text class="phone"> 138****8888 </text>
      </view>
    </view>

    <!-- 订单状态统计 -->
    <view class="order-section">
      <view class="section-header">
        <text class="title"> 我的订单 </text>
        <view class="more-order" @click="goToOrderList(0)">
          <text>全部订单</text>
          <text class="arrow"> > </text>
        </view>
      </view>
      <view class="order-status-list">
        <view class="status-item" @click="goToOrderList(1)">
          <image
            class="icon"
            src="/static/images/order/wait_payment.svg"
            mode="aspectFill"
          />
          <view class="icon"> 待付款 </view>
        </view>
        <view class="status-item" @click="goToOrderList(2)">
          <image
            class="icon"
            src="/static/images/order/in_progress.svg"
            mode="aspectFill"
          />
          <view class="icon"> 进行中 </view>
        </view>
        <view class="status-item" @click="goToOrderList(3)">
          <image
            class="icon"
            src="/static/images/order/has_finished.svg"
            mode="aspectFill"
          />
          <view class="icon"> 已完成 </view>
        </view>
        <view class="status-item" @click="goToOrderList(4)">
          <image
            class="icon"
            src="/static/images/order/refund.svg"
            mode="aspectFill"
          />
          <view class="icon"> 退款/售后 </view>
        </view>
      </view>
    </view>

    <!-- 常用功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="handleMenuClick('address')">
        <view class="left">
          <text class="icon"> 📍 </text>
          <text class="text"> 地址管理 </text>
        </view>
        <text class="arrow"> > </text>
      </view>
      <view class="menu-item" @click="handleMenuClick('coupon')">
        <view class="left">
          <text class="icon"> 🎫 </text>
          <text class="text"> 我的优惠券 </text>
        </view>
        <text class="arrow"> > </text>
      </view>
      <view class="menu-item" @click="handleMenuClick('service')">
        <view class="left">
          <text class="icon"> 🎧 </text>
          <text class="text"> 联系客服 </text>
        </view>
        <text class="arrow"> > </text>
      </view>
      <view class="menu-item" @click="handleMenuClick('about')">
        <view class="left">
          <text class="icon"> ℹ️ </text>
          <text class="text"> 关于我们 </text>
        </view>
        <text class="arrow"> > </text>
      </view>
    </view>
  </view>
</template>

<script setup>
const goToOrderList = (type) => {
  uni.showToast({
    title: `点击了订单类型: ${type}`,
    icon: 'none'
  })
}

const handleMenuClick = (type) => {
  uni.showToast({
    title: `点击了菜单: ${type}`,
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.user-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 40rpx;
}

/* 头部用户信息 */
.user-info-section {
  display: flex;
  align-items: center;
  padding: 60rpx 40rpx;
  background-color: #ff9900;
  color: #fff;

  .avatar-wrap {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #fff;
    padding: 4rpx;
    margin-right: 30rpx;

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .info-wrap {
    display: flex;
    flex-direction: column;

    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .phone {
      font-size: 28rpx;
      opacity: 0.8;
    }
  }
}

/* 订单模块 */
.order-section {
  margin: -30rpx 30rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .more-order {
      font-size: 24rpx;
      color: #999;
      display: flex;
      align-items: center;

      .arrow {
        margin-left: 6rpx;
      }
    }
  }

  .order-status-list {
    display: flex;
    justify-content: space-around;

    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 12rpx;
      }

      .icon {
        font-size: 28rpx;
        color: #333;
        // padding: 20rpx 0;
      }
    }
  }
}

/* 常用功能列表 */
.menu-list {
  margin: 0 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .left {
      display: flex;
      align-items: center;

      .icon {
        font-size: 36rpx;
        margin-right: 20rpx;
      }

      .text {
        font-size: 28rpx;
        color: #333;
      }
    }

    .arrow {
      font-size: 28rpx;
      color: #ccc;
    }
  }
}
</style>