<template>
  <view class="shop-info">
    <view class="shop-header">
      <text class="shop-name">
        {{ info.name || "默认店铺" }}
      </text>
      <text class="shop-score"> 评分：{{ info.score || "5.0" }} </text>
    </view>
    <view class="shop-desc">
      <text>{{ info.desc || "欢迎光临，本店提供美味佳肴。" }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style lang="scss" scoped>
.shop-info {
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;

    .shop-name {
      font-size: 32rpx;
      font-weight: bold;
    }

    .shop-score {
      font-size: 24rpx;
      color: #ff9900;
    }
  }

  .shop-desc {
    font-size: 24rpx;
    color: #666;
  }
}
</style>
