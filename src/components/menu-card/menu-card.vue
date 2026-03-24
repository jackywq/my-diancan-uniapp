<!-- 菜单卡片组件 -->
<template>
  <view class="menu-card">
    <image
      class="food-image"
      :src="food.image || '/static/default-food.png'"
      mode="aspectFill"
    />
    <view class="food-info">
      <view class="food-name">
        {{ food.name }}
      </view>
      <view class="food-sales">
        月售 {{ food.sales || 0 }}
      </view>
      <view class="food-bottom">
        <text class="food-price">
          ¥{{ food.price }}
        </text>
        <view class="add-btn" @click.stop="handleAdd">
          +
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  food: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add']);

const handleAdd = () => {
  emit('add', props.food);
};
</script>

<style lang="scss" scoped>
.menu-card {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f5f5f5;

  .food-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
    background-color: #f0f0f0;
  }

  .food-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .food-name {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .food-sales {
      font-size: 24rpx;
      color: #999;
    }

    .food-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .food-price {
        font-size: 32rpx;
        color: #ff5a5f;
        font-weight: bold;
      }

      .add-btn {
        width: 48rpx;
        height: 48rpx;
        line-height: 44rpx;
        text-align: center;
        background-color: #ff5a5f;
        color: #fff;
        border-radius: 50%;
        font-size: 36rpx;
        font-weight: bold;
      }
    }
  }
}
</style>