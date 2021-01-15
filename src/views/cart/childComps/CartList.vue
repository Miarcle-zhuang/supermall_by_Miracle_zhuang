<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
        v-for="(item, index) in cartList"
        :item-info="item"
        :key="index"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll"
  import CartListItem from "./CartListItem";

  import { mapGetters } from "vuex"

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    /* 每重新进去一起滚动页面,就进行一次可滚动区域的刷新 */
    activated() {
      //console.log('-----');
      this.$refs.scroll.refresh();
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 40px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
