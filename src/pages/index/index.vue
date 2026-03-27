<template>
  <view class="index-container">
    <!-- 店铺信息 -->
    <shop-info :info="shopInfo" />
    <!-- 轮播广告 -->
    <view class="banner-wrap">
      <swiper
        class="swiper"
        circular
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item
          v-for="(item, index) in bannerList"
          :key="index"
          @click="handleBannerClick(item)"
        >
          <image class="swiper-image" :src="item.image" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 菜品分类 -->
    <category-list :list="categoryList" @select="handleCategorySelect" />

    <!-- 商家列表 -->
    <merchant-list :list="merchantListData" @click="handleMerchantClick" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// ✅ 从 uni-app 导入页面生命周期 onLoad
// import { onLoad } from '@dcloudio/uni-app'
import { getShopInfo, getBannerList, getCategoryList } from '@/common/request/api'
import ShopInfo from '@/components/shop-info/shop-info.vue'
import CategoryList from '@/components/category-list/category-list.vue'
import MerchantList from '@/components/merchant-list/merchant-list.vue'
import hotFoodIcon from '@/static/images/classify/hot_food.svg'
import fineFoodIcon from '@/static/images/classify/fine_food.svg'
import mainFoodIcon from '@/static/images/classify/main_food.svg'
import drinkIcon from '@/static/images/classify/drink.svg'
import BannerImage1 from '@/static/images/banner/banner1.jpg'
import BannerImage2 from '@/static/images/banner/banner2.jpg'

// 响应式数据
const shopInfo = ref({})
const bannerList = ref([])
const categoryList = ref([])
const merchantListData = ref([])



// 生命周期：获取首页数据
onMounted(async () => {
  try {
    // 模拟数据，如果接口不通则使用默认数据
    shopInfo.value = {
      name: '豪客来',
      score: '4.9',
      desc: '提供最优质的餐饮服务'
    };

    bannerList.value = [
      { image: BannerImage1, link: '' },
      { image: BannerImage2, link: '' }
    ];

    categoryList.value = [
      { id: 1, name: '热销推荐', icon: hotFoodIcon },
      { id: 2, name: '主食', icon: mainFoodIcon },
      { id: 3, name: '小吃', icon: fineFoodIcon },
      { id: 4, name: '饮品', icon: drinkIcon }
    ];

    merchantListData.value = [
      {
        id: 1,
        name: '奶茶配汉堡',
        image: 'https://picsum.photos/200/200?random=1',
        desc: '闵行区',
        distance: '4.5km',
        tags: ['点', '预']
      },
      {
        id: 2,
        name: '马厂老火锅（中骏广场店上海45...',
        image: 'https://picsum.photos/200/200?random=2',
        desc: '重庆火锅 闵行区',
        distance: '508m',
        tags: ['点', '预']
      },
      {
        id: 3,
        name: '古丽古丽拌面·米粉·大盘鸡',
        image: 'https://picsum.photos/200/200?random=3',
        desc: '面条 闵行区',
        distance: '338m',
        tags: ['点']
      },
      {
        id: 4,
        name: '乡味水煮牛肉·鱼片·烤鱼',
        image: 'https://picsum.photos/200/200?random=4',
        desc: '长宁区',
        distance: '4.7km',
        tags: ['点', '外']
      },
      {
        id: 5,
        name: '冰冰酱·绵绵冰·冰糖葫芦（虹桥天...',
        image: 'https://picsum.photos/200/200?random=5',
        desc: '冰淇淋 闵行区',
        distance: '1.9km',
        tags: ['点']
      },
      {
        id: 6,
        name: '汤客牛羊肉汤馆',
        image: 'https://picsum.photos/200/200?random=6',
        desc: '嘉定区',
        distance: '2.5km',
        tags: ['点']
      },
      {
        id: 7,
        name: '漫心酒店 M·bar',
        image: 'https://picsum.photos/200/200?random=7',
        desc: '闵行区',
        distance: '584m',
        tags: ['点']
      }
    ];

    // 实际项目中应解开下方注释进行真实请求
    // const [shopRes, bannerRes, categoryRes] = await Promise.all([
    //   getShopInfo(),
    //   getBannerList(),
    //   getCategoryList()
    // ])
    // shopInfo.value = shopRes.data || shopInfo.value
    // bannerList.value = bannerRes.data || bannerList.value
    // categoryList.value = categoryRes.data || categoryList.value
  } catch (err) {
    uni.showToast({ title: '数据加载失败', icon: 'none' })
  }
})

// 分类选择事件
const handleCategorySelect = (categoryId) => {
  // 保存选中的分类 ID 到本地存储或者状态管理，以便 tabBar 页面读取
  uni.setStorageSync('selectedCategoryId', categoryId)
  // 跳转到对应分类的点餐页面
  uni.switchTab({ url: `/pages/menu/menu` })
}

// 轮播点击事件
const handleBannerClick = (item) => {
  if (item.link) uni.navigateTo({ url: item.link })
}

// 商家点击事件
const handleMerchantClick = (item) => {
  uni.showToast({ title: `点击了: ${item.name}`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  background-color: #f8f8f8;

  .banner-wrap {
    margin-top: 20rpx;
    padding: 0 20rpx;

    .swiper {
      height: 300rpx;
      border-radius: 16rpx;
      overflow: hidden;

      .swiper-image {
        width: 100%;
        height: 100%;
        aspect-ratio: 16/9; /* 固定宽高比：提高CLS布局偏移的稳定性 */
      }
    }
  }
}
</style>
