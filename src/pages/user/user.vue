<template>
  <view class="user-container">
    <view class="header">
      <text class="title">
        我的
      </text>
    </view>
    <view class="content">
      <text>个人中心开发中...</text>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.user-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
}
.header {
  padding: 40rpx;
  background-color: #fff;
  text-align: center;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
}
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>