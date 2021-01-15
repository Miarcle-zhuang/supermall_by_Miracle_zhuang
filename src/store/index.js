import Vue from 'vue';
import Vuex from 'vuex';

import mutations from "./mutations";
import actions from "./actions";
import getters from './getters'

//1、安装插件
Vue.use(Vuex);


/*const state = {
  cartList: []
}*/

//2、创建store对象
const store =new Vuex.Store({
  state: {
    cartList: []
  },
  //mutations唯一的目标就是修改state中的状态
  //mutations中的每一个方法尽可能完成的事情比较单一一点
  //类似有判断逻辑的,以及各种异步操作的代码(比较复杂的操作),应该放到actions中
  mutations,
  actions,
  getters
});

//3、挂载到Vue实例上
export default store
