<template>
  <view>
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
   <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="30000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
         <navigator class="swiper-item" :url="'/subpkg/good_details/good_details?goods_id=' + item.goods_id">
         <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
  </view>
  <view class="nav-list">
    <view class="nav-item" v-for="(item,index) in navList" :key="index" >
      <image class="nav-img_src" :src="item.image_src" @click="navClickHandler(item)"></image>
    </view>
  </view>
  <view class="floor-list">
    <view class="floor-item" v-for="(item,index) in floorList" :key="index">
      <image class="floor-title" :src="item.floor_title.image_src"></image>
      <!-- 楼层图片区域 -->
      <view class="floor-img-box">
         <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <view class="right-img-box">
              <navigator class="right-img-item" v-for="(item2, i2) of item.product_list.slice(1)" :key="i2" :url="item2.url">
                <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
              </navigator>
            </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //这是轮播图的数据列表
        swiperList:[],
        //这是导航栏的数据列表
        navList:[],
        //定义楼层的数据
        floorList:[],
      };
    },
    onLoad(){
      this.getSwiperList(),
      this.getNavList(),
      this.getFloorList()
    },
    methods:{
    async  getSwiperList() {
          // 3.1 发起请求
          const  {data:res}   = await  uni.$http.get('/api/public/v1/home/swiperdata')
          if(res.meta.status !== 200){
            return uni.$showMsg()
          }
          this.swiperList = res.message
        },
    async getNavList(){
          const  {data:res}   = await  uni.$http.get('/api/public/v1/home/catitems')
         if(res.meta.status !== 200){
           return uni.$showMsg()
         }
         this.navList = res.message
    },
    async getFloorList(){
        const  {data:res}   = await  uni.$http.get('/api/public/v1/home/floordata')
        res.message.forEach(floor => {
            floor.product_list.forEach(prod => {
              prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
            })
          })
          this.floorList = res.message
        console.log(res)
    },
    navClickHandler(item){
      if(item.name === '分类'){
        uni.switchTab({
          url:'/pages/cate/cate'
        })
      }
    },
    gotoSearch(){
      uni.navigateTo({
          url: '/subpkg/search/search'
        })
    }
    }
  }
</script>

<style lang="scss">
swiper {
 height: 330rpx;

 .swiper-item,
 image {
   width: 100%;
   height: 100%;
 }
 }
 .nav-list {
   display: flex;
   justify-content: space-around;
   margin: 15px 0;
 
   .nav-img_src {
     width: 128rpx;
     height: 140rpx;
   }
 }
 .floor-title {
   height: 60rpx;
   width: 100%;
   display: flex;
 }
 .right-img-box {
   display: flex;
   flex-wrap: wrap;
   justify-content: space-around;
 }
 
 .floor-img-box {
   display: flex;
   padding-left: 10rpx;
 }
 .search-box {
   // 设置定位效果为“吸顶”
   position: sticky;
   // 吸顶的“位置”
   top: 0;
   // 提高层级，防止被轮播图覆盖
   z-index: 999;
 }
</style>
