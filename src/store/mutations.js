import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutations-types";

export default {
  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    /*
      购物车的选中状态,以后都选用对象模型, 即先将每一个对象
      先都加入checked这个属性, 后面再进行相应的更改
     */
    payload.checked = true;
    state.cartList.push(payload);
  }
}
