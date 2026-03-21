<template>
  <view class="category-list">
    <view class="category-title">
      <text>菜品分类</text>
    </view>
    <view class="category-grid">
      <view
        class="category-item"
        v-for="item in list"
        :key="item.id"
        @click="handleSelect(item.id)"
      >
        <image
          class="category-icon"
          :src="item.icon || '/static/default-icon.png'"
          mode="aspectFill"
        ></image>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select']);

const handleSelect = (id) => {
  emit('select', id);
};
</script>

<style lang="scss" scoped>
.category-list {
  padding: 20rpx;
  background-color: #fff;
  margin-top: 20rpx;

  .category-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .category-grid {
    display: flex;
    flex-wrap: wrap;

    .category-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20rpx;

      .category-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background-color: #f5f5f5;
        margin-bottom: 10rpx;
      }

      .category-name {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
}
</style>