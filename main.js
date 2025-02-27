
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'

uni.$http = $http
$http.baseUrl= 'https://api-hmugo-web.itheima.net'
//请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中.....'
  })
  
}
//响应拦截器
$http.afterRequest= function(options){
  uni.hideLoading()
  
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import { $http } from '@escook/request-miniprogram'

uni.$http = $http
$http.baseUrl= 'https://api-hmugo-web.itheima.net'
//请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中.....'
  }),
  uni.$showMsg = function(){
    uni.showToast({
      title:"数据请求成功！",
      duration:1500,
      icon:"none"
    })
  }
  
}
//响应拦截器
$http.afterRequest= function(options){
  uni.hideLoading()
  
}
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif