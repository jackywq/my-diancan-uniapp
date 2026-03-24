<!-- 商家列表组件 -->
<template>
  <view class="merchant-list-container">
    <!-- 顶部筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item active">
        <text>综合排序</text>
        <text class="icon-down">
          ▼
        </text>
      </view>
      <view class="filter-item">
        <text>全部美食</text>
        <text class="icon-down">
          ▼
        </text>
      </view>
      <view class="filter-item">
        <text>筛选</text>
      </view>
    </view>

    <!-- 商家列表 -->
    <view class="merchant-list">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="merchant-item"
        @click="handleClick(item)"
      >
        <image class="merchant-img" :src="item.image" mode="aspectFill" />
        <view class="merchant-info">
          <view class="info-top">
            <text class="merchant-name">
              {{ item.name }}
            </text>
            <view class="tags">
              <text
                v-if="item.tags?.includes('点')"
                class="tag tag-dian"
              >
                点
              </text>
              <text
                v-if="item.tags?.includes('预')"
                class="tag tag-yu"
              >
                预
              </text>
              <text
                v-if="item.tags?.includes('外')"
                class="tag tag-wai"
              >
                外
              </text>
            </view>
          </view>
          <view class="info-bottom">
            <text class="merchant-desc">
              {{ item.desc }}
            </text>
            <text class="merchant-distance">
              {{ item.distance }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineEmits } from 'vue'

// const props = defineProps({
//   list: {
//     type: Array,
//     default: () => []
//   }
// })

const emit = defineEmits(['click'])

const handleClick = (item) => {
  emit('click', item)
}
</script>

<style lang="scss" scoped>
.merchant-list-container {
  background-color: #f8f8f8;
  padding-top: 10rpx;

  .filter-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    padding: 20rpx 0;
    margin-bottom: 20rpx;

    .filter-item {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #666;

      text {
        margin-right: 8rpx;
      }

      &.active {
        color: #333;
        font-weight: bold;
      }

      .icon-down {
        font-size: 20rpx;
        transform: scale(0.8);
      }
    }
  }

  .merchant-list {
    background-color: #fff;
    padding: 0 30rpx;

    .merchant-item {
      display: flex;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .merchant-img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }

      .merchant-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info-top {
          .merchant-name {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 12rpx;
            display: block;
          }

          .tags {
            display: flex;
            gap: 10rpx;

            .tag {
              font-size: 20rpx;
              padding: 2rpx 8rpx;
              border-radius: 4rpx;

              &.tag-dian {
                color: #ff6b6b;
                border: 1rpx solid #ff6b6b;
              }

              &.tag-yu {
                color: #4facfe;
                border: 1rpx solid #4facfe;
              }

              &.tag-wai {
                color: #fca130;
                border: 1rpx solid #fca130;
              }
            }
          }
        }

        .info-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24rpx;
          color: #999;

          .merchant-desc {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 20rpx;
          }

          .merchant-distance {
            color: #666;
          }
        }
      }
    }
  }
}
</style>
