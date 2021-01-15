import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutations-types";

export default {
  //actions中的context参数就是创建出来的store对象,payload是要添加的商品
  addCart(context, payload) {
    //注意,是state,而不是this
    //state.cartList.push(payload);
    //下面是电商平台添加商品置购物车经常写的代码
    //第一种做法
    /*let oldProduct = null;
    for(let item of state.cartList){
      if(payload.iid === item.iid) {
        oldProduct = item;
      }
    }

    if(oldProduct) {
      oldProduct.count += 1;
    }else {
      payload.count = 1;
      state.cartList.push(payload);
    }*/

    //第二种做法, 这一种方法比较简单;
    //数组中查找方法
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
      if (oldProduct) {//商品数量+1
        //oldProduct.count += 1;
        context.commit(ADD_COUNTER, oldProduct);
        resolve('当前商品数量+1');
      } else {//添加新的商品
        payload.count = 1;
        //state.cartList.push(payload);
        context.commit(ADD_TO_CART, payload);
        resolve('当前添加新的商品');
      }
    })
  }
}
