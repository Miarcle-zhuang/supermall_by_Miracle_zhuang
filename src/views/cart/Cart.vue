<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list></cart-list>
    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import { mapGetters } from "vuex"

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      //下面这种用法重复使用了computed属性,不太行
      /*cartLength() {
        return this.$store.getters.cartLength;
      }*/
      //下面mapGetters有两种用法
      //这是第一种用法,是可行的,详细可查mapGetters的使用
      //...mapGetters(['cartLength'])
      //这是第二种用法
      //将一个 getter 属性另取一个名字，使用对象形式
      ...mapGetters({
        //将length属性映射为cartLength计算属性
        length: 'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
  }
</style>
