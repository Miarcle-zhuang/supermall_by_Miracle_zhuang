<template>
  <div class="goods">
    <goods-list-item-category v-for="(item, index) in goods" :goods-item="item" :key="index"></goods-list-item-category>
  </div>
</template>

<script>
  import GoodsListItemCategory from 'components/content/goods_category/GoodsListItemCategory'

  export default {
    name: "GoodsListCategory",
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      GoodsListItemCategory
    }
  }
</script>

<style scoped>
  .goods {
    /*默认所有的子组件都往一行塞*/
    display: flex;
    /*flex-wrap的作用是根据父元素的大小,决定一行当中能够显示多少个子元素,一行中显示不了的,会自动换行显示*/
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 2px;
  }
</style>
