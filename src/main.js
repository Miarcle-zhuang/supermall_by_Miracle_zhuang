import Vue from 'vue'
import App from './App.vue'
import router from  './router'
import store from './store'

//自己封装的插件
import toast from 'components/common/toast'
//引入懒加载插件
import VueLazyLoad from 'vue-lazyload'

//第三方引入的插件
import FastClick from 'fastclick'

Vue.config.productionTip = false

//Vue实例是可以作为事件总线的
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast);

//调用attach()函数
FastClick.attach(document.body);

//安装懒加载插件
Vue.use(VueLazyLoad, {
  //loading里面存放的是占位图,即真正图片还没加载过来时,首先显示的占位图
  loading: require("assets/img/common/placeholder.png")
});

new Vue({
  render: h => h(App),
  router,
  //将vuex对象挂载到Vue实例当中
  store
}).$mount('#app')
