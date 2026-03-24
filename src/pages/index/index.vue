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
      { image: 'https://thumbnail0.baidupcs.com/thumbnail/c291a0460oa3060fb009db5ec7e894f1?fid=121420358-250528-905529882891823&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-e%2BLxhVg5o2y9R3p%2FwFf5qf0Vg0s%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8832952150313502714&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video', link: '' },
      { image: 'https://thumbnail0.baidupcs.com/thumbnail/51d899a4cs30cdba098b00b5a0bfd3cb?fid=121420358-250528-37519512663804&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-ztIa6uL1U1JzhcNPUtkNBBwGw%2BA%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8833064514411396667&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video', link: '' }
    ];

    categoryList.value = [
      { id: 1, name: '热销推荐', icon: 'https://thumbnail0.baidupcs.com/thumbnail/4e4fb670ev860feb172fc89525c37b05?fid=121420358-250528-120146867008849&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-SyTytvImHD3951%2BRabYbqojycw8%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8833076587286666234&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video' },
      { id: 2, name: '主食', icon: 'https://thumbnail0.baidupcs.com/thumbnail/732383849m8875fbaf392722153d3dc4?fid=121420358-250528-838688766907837&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-xYiVwIn7t8cBunnDSFto0YAtxf4%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8833086231806415151&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video' },
      { id: 3, name: '小吃', icon: 'https://thumbnail0.baidupcs.com/thumbnail/ff83e545dic3380d2215d433c050633b?fid=121420358-250528-499280008807162&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-b2G%2FJDGTE9Iab0E0jO4l66Fjq6I%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8833096958884066574&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video' },
      { id: 4, name: '饮品', icon: 'https://thumbnail0.baidupcs.com/thumbnail/647d9e547u9a4d49c7d38d8e338baf41?fid=121420358-250528-1005859108980620&time=1774332000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-X7w8VDajd%2BtBS3yO2XA3db2VR98%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8833105195602797146&dp-callid=0&file_type=0&size=c710_u400&quality=100&vuk=-&ft=video' }
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
const handleCategorySelect = () => {
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
      }
    }
  }
}
</style>
