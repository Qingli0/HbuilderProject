<template>
  <view class="search-box">
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
  </view>
  
  <!-- 搜索建议列表 -->
  <view class="sugg-list" v-if="searchResults.length !== 0">
    <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
      <view class="goods-name">{{item.goods_name}}</view>
      <uni-icons type="arrowright" size="16"></uni-icons>
    </view>
  </view>
<view class="history-box" v-else>
  <!-- 标题区域 -->
  <view class="history-title">
    <text>搜索历史</text>
    <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
  </view>
  <!-- 列表区域 -->
  <view class="history-list">
    <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
  </view>
</view>
</template>

<script>
  export default {
    data() {
      return {
            timer: null,
            kw: '',
            // 搜索结果列表
            searchResults: [] ,
            historyList: ['a', 'app', 'apple']
      };
    },
    onLoad(){
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 清除 timer 对应的延时器
          clearTimeout(this.timer)
          // 重新启动一个延时器，并把 timerId 赋值给 this.timer
          this.timer = setTimeout(() => {
            // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
            this.kw = e,
            this.getSearchList()
          }, 500)
      },
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索建议列表
        const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
        if (res.meta.status !== 200) return uni.$showMsg()
        console.log(res.message)
        this.searchResults = res.message
        this.saveSearchHistory()
      },
     gotoDetail(goods_id) {
       uni.navigateTo({
         // 指定详情页面的 URL 地址，并传递 goods_id 参数
         url: '/subpkg/good_details/good_details?goods_id=' + goods_id
       })
     },
     saveSearchHistory() {
         // 1. 将 Array 数组转化为 Set 对象
           const set = new Set(this.historyList)
           // 2. 调用 Set 对象的 delete 方法，移除对应的元素
           set.delete(this.kw)
           // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
           set.add(this.kw)
           // 4. 将 Set 对象转化为 Array 数组
           this.historyList = Array.from(set)
           //调用setStoageSync函数 将搜索历史记录持久化存储到本地
           uni.setStorageSync('kw', JSON.stringify(this.historyList))
       },
       cleanHistory() {
         // 清空 data 中保存的搜索历史
         this.historyList = []
         // 清空本地存储中记录的搜索历史
         uni.setStorageSync('kw', '[]')
       },
       gotoGoodsList(item){
          uni.navigateTo({
             url: '/subpkg/goods_list/goods_list?query=' + item
           })
       }
    },
    computed:{
      histories(){
       return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
.uni-searchbar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  position: relative;
  padding: 16rpx;
  /* 将默认的 #FFFFFF 改为 #C00000 */
  background-color: #c00000;
}
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
